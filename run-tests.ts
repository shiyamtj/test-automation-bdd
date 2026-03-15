// run-tests.ts
// This TypeScript script loads environment variables (via dotenv) and runs multiple Cucumber test suites in batches.
// It is now refactored into a class for better structure.

import { spawn } from "child_process";
import { logger } from "./tests/utils/Logger";
import path from "path";
import { readFileSync } from "fs";

interface CommandDef {
  command: string;
  args: string[];
  label: string;
  env?: Record<string, string>;
}

class TestRunner {
  private argv: string[];
  private runCommandFile: string = "run-commands-smoke.json"; // default command file
  private batchSize: number = 3; // default batch size
  private commandDefs: CommandDef[] = [];

  constructor() {
    this.argv = process.argv.slice(2);
    this.parseArgs();
    this.loadCommands();
  }

  // Parse command‑line arguments: --run-command-file <file> and --batch-size <n>
  private parseArgs(): void {
    const runFileFlagIndex = this.argv.findIndex(arg => arg === "--run-command-file");
    if (runFileFlagIndex !== -1 && this.argv.length > runFileFlagIndex + 1) {
      this.runCommandFile = this.argv[runFileFlagIndex + 1];
    }

    const batchFlagIndex = this.argv.findIndex(arg => arg === "--batch-size");
    if (batchFlagIndex !== -1 && this.argv.length > batchFlagIndex + 1) {
      const parsed = parseInt(this.argv[batchFlagIndex + 1], 10);
      if (!isNaN(parsed) && parsed > 0) {
        this.batchSize = parsed;
      }
    }
  }

  // Load command definitions from the JSON file.
  private loadCommands(): void {
    const commandsPath = path.resolve(__dirname, this.runCommandFile);
    const raw = readFileSync(commandsPath, "utf8");
    this.commandDefs = JSON.parse(raw) as CommandDef[];
  }

  // Execute a single command.
  private static runCommand(
    command: string,
    args: string[],
    label: string,
    envVars?: Record<string, string>,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: "inherit",
        shell: true,
        env: { ...process.env, ...(envVars || {}) },
      });
      child.on("close", code => {
        if (code === 0) resolve();
        else reject(new Error(`${label} exited with code ${code}`));
      });
    });
  }

  // Logging helpers.
  private logCommandInfo(label: string, env?: Record<string, string>) {
    const envInfo = env ? ` with env ${JSON.stringify(env)}` : "";
    logger.info(`▶ Starting command: ${label}${envInfo}`);
  }

  private logBatchInfo(batchIndex: number, totalBatches: number) {
    logger.info(`\n=== Running batch ${batchIndex + 1}/${totalBatches} (up to ${this.batchSize} tests) ===`);
  }

  private logBatchResult(passed: number, failed: number, skipped: number) {
    logger.info(`✅ Batch result – passed: ${passed}, failed: ${failed}, skipped: ${skipped}\n`);
  }

  private logFinalSummary(totalPassed: number, totalFailed: number, totalSkipped: number) {
    logger.info("\n=== Batch Execution Summary ===");
    logger.info(`Total passed : ${totalPassed}`);
    logger.info(`Total failed : ${totalFailed}`);
    logger.info(`Total skipped: ${totalSkipped}`);
  }

  // Main execution loop.
  public async run(): Promise<void> {
    const totalBatches = Math.ceil(this.commandDefs.length / this.batchSize);
    let totalPassed = 0;
    let totalFailed = 0;
    let totalSkipped = 0;

    for (let i = 0; i < this.commandDefs.length; i += this.batchSize) {
      const batch = this.commandDefs.slice(i, i + this.batchSize);
      const batchIndex = i / this.batchSize;
      this.logBatchInfo(batchIndex, totalBatches);

      const results = await Promise.all(
        batch.map(async (c) => {
          this.logCommandInfo(c.label, c.env);
          try {
            await TestRunner.runCommand(c.command, c.args, c.label, c.env);
            return { status: "passed" };
          } catch (e) {
            return { status: "failed" };
          }
        })
      );

      const passed = results.filter(r => r.status === "passed").length;
      const failed = results.filter(r => r.status === "failed").length;
      const skipped = 0; // placeholder for future skip handling
      this.logBatchResult(passed, failed, skipped);

      totalPassed += passed;
      totalFailed += failed;
      totalSkipped += skipped;
    }

    this.logFinalSummary(totalPassed, totalFailed, totalSkipped);
  }
}

// Instantiate and run.
new TestRunner().run().catch(err => {
  console.error(err);
  process.exit(1);
});
