// run-tests.ts
// This TypeScript script loads environment variables (via dotenv) and runs multiple Cucumber test suites concurrently.
// It is intended to be executed with `ts-node` (already a devDependency).

import { spawn } from "child_process";
import { logger } from "./tests/utils/Logger";

// Helper to merge custom environment variables with the current process.env.
function mergeEnv(custom?: Record<string, string>): NodeJS.ProcessEnv {
  return { ...process.env, ...(custom || {}) };
}

/**
 * Execute a command as a child process and inherit stdio so output appears in the console.
 * Returns a promise that resolves when the process exits with code 0, otherwise rejects.
 */
function runCommand(
  command: string,
  args: string[],
  label: string,
  envVars?: Record<string, string>,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: true,
      env: mergeEnv(envVars),
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${label} exited with code ${code}`));
      }
    });
  });
}

function logCommandInfo(label: string, env?: Record<string, string>) {
  const envInfo = env ? ` with env ${JSON.stringify(env)}` : "";
  logger.info(`▶ Starting command: ${label}${envInfo}`);
}

function logBatchInfo(
  batchIndex: number,
  batchSize: number,
  totalBatches: number,
) {
  logger.info(
    `\n=== Running batch ${batchIndex + 1}/${totalBatches} (up to ${batchSize} tests) ===`,
  );
}

function logBatchResult(passed: number, failed: number, skipped: number) {
  logger.info(
    `✅ Batch result – passed: ${passed}, failed: ${failed}, skipped: ${skipped}\n`,
  );
}

function logFinalSummary(
  totalPassed: number,
  totalFailed: number,
  totalSkipped: number,
) {
  logger.info("\n=== Batch Execution Summary ===");
  logger.info(`Total passed : ${totalPassed}`);
  logger.info(`Total failed : ${totalFailed}`);
  logger.info(`Total skipped: ${totalSkipped}`);
}

import path from "path";
import { readFileSync } from "fs";

async function main() {
  const argv = process.argv.slice(2);
  // Parse command‑line arguments for `--run-command-file`.
  // Example usage: ts-node run-tests.ts --run-command-file custom-commands.json
  let runCommandFile = "run-commands-smoke.json";
  const runFileFlagIndex = argv.findIndex(
    (arg) => arg === "--run-command-file",
  );
  if (runFileFlagIndex !== -1 && argv.length > runFileFlagIndex + 1) {
    runCommandFile = argv[runFileFlagIndex + 1];
  }

  // Load command definitions from the specified JSON file.
  const commandsPath = path.resolve(__dirname, runCommandFile);
  const raw = readFileSync(commandsPath, "utf8");
  const commandDefs: {
    command: string;
    args: string[];
    label: string;
    env?: Record<string, string>;
  }[] = JSON.parse(raw);

  const DEFAULT_BATCH_SIZE = 3;

  // Parse command‑line arguments for `--batch-size`.
  // Example usage: ts-node run-tests.ts --batch-size 5
  let BATCH_SIZE = DEFAULT_BATCH_SIZE;
  const batchFlagIndex = argv.findIndex((arg) => arg === "--batch-size");
  if (batchFlagIndex !== -1 && argv.length > batchFlagIndex + 1) {
    const parsed = parseInt(argv[batchFlagIndex + 1], 10);
    if (!isNaN(parsed) && parsed > 0) {
      BATCH_SIZE = parsed;
    }
  }

  const totalBatches = Math.ceil(commandDefs.length / BATCH_SIZE);

  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0; // placeholder for future skip handling

  for (let i = 0; i < commandDefs.length; i += BATCH_SIZE) {
    const batch = commandDefs.slice(i, i + BATCH_SIZE);
    const batchIndex = i / BATCH_SIZE;
    logBatchInfo(batchIndex, BATCH_SIZE, totalBatches);

    const results = await Promise.all(
      batch.map(async (c) => {
        logCommandInfo(c.label, c.env);
        try {
          await runCommand(c.command, c.args, c.label, c.env);
          return { status: "passed" };
        } catch (e) {
          return { status: "failed" };
        }
      }),
    );

    const passed = results.filter((r) => r.status === "passed").length;
    const failed = results.filter((r) => r.status === "failed").length;
    const skipped = 0;
    logBatchResult(passed, failed, skipped);
    totalPassed += passed;
    totalFailed += failed;
    totalSkipped += skipped;
  }

  logFinalSummary(totalPassed, totalFailed, totalSkipped);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
