// run-tests.ts
// This TypeScript script loads environment variables (via dotenv) and runs multiple Cucumber test suites in batches.
// It is now refactored into a class for better structure.

import { spawn } from "child_process";
import { logger } from "./tests/utils/Logger";
import path from "path";
import { readFileSync } from "fs";

interface CommandDef {
  command: string;
  resultFile: string; // optional field for future use
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
    const runFileFlagIndex = this.argv.findIndex(
      (arg) => arg === "--run-command-file",
    );
    if (runFileFlagIndex !== -1 && this.argv.length > runFileFlagIndex + 1) {
      this.runCommandFile = this.argv[runFileFlagIndex + 1];
    }

    const batchFlagIndex = this.argv.findIndex((arg) => arg === "--batch-size");
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
      child.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`${label} exited with code ${code}`));
      });
    });
  }

  // Read a cucumber JSON result file and count passed scenarios.
  // Read a cucumber JSON result file and count passes/fails/skips.
  private static parseResultFile(filePath: string): {
    passed: number;
    failed: number;
    skipped: number;
  } {
    try {
      const raw = readFileSync(filePath, "utf8");
      const features = JSON.parse(raw) as any[];
      let passed = 0,
        failed = 0,
        skipped = 0;
      for (const feature of features) {
        const elements = feature.elements || [];
        for (const elem of elements) {
          if (elem.keyword === "Scenario") {
            const steps = elem.steps || [];
            // Assume scenario passes unless any step fails or is skipped.
            let scenarioFailed = false;
            for (const step of steps) {
              if (step.result && step.result.status) {
                const s = step.result.status;
                if (s === "failed" || s === "skipped") {
                  scenarioFailed = true;
                  break;
                }
              }
            }
            if (scenarioFailed) {
              failed++;
            } else {
              passed++;
            }
          }
        }
      }
      logger.separator();
      logger.stats(`Parsed results from ${filePath}`);
      logger.stats(`Passed: ${passed}, Failed: ${failed}, Skipped: ${skipped}`);
      return { passed, failed, skipped };
    } catch (e) {
      logger.error(`Error parsing result file ${filePath}: ${e}`);
      return { passed: 0, failed: 0, skipped: 0 };
    } finally {
      logger.separator();
    }
  }

  // Logging helpers.
  private logCommandInfo(label: string, env?: Record<string, string>) {
    const envInfo = env ? ` with env ${JSON.stringify(env)}` : "";
    logger.separator();
    logger.stats(`▶ Starting command: ${label}${envInfo}`);
    logger.separator();
  }

  private logBatchInfo(batchIndex: number, totalBatches: number) {
    logger.separator();
    logger.stats(
      `Running batch ${batchIndex + 1}/${totalBatches} (up to ${this.batchSize} tests)`,
    );
    logger.separator();
  }

  private logBatchResult(passed: number, failed: number, skipped: number) {
    logger.separator();
    logger.stats(
      `Batch result – Passed: ${passed}, Failed: ${failed}, Skipped: ${skipped}`,
    );
    logger.separator();
  }

  private logFinalSummary(
    totalPassed: number,
    totalFailed: number,
    totalSkipped: number,
  ) {
    logger.separator();
    logger.stats("Batch Execution Summary ");
    logger.separator();
    logger.stats(`Total Passed : ${totalPassed}`);
    logger.stats(`Total Failed : ${totalFailed}`);
    logger.stats(`Total Skipped: ${totalSkipped}`);
    logger.separator();
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
          let stats = { passed: 0, failed: 0, skipped: 0 };
          try {
            await TestRunner.runCommand(c.command, c.args, c.label, c.env);
            if (c.resultFile) {
              const resultPath = path.resolve(process.cwd(), c.resultFile);
              stats = TestRunner.parseResultFile(resultPath);
            } else {
              stats.passed = 1;
            }
            return { status: "passed", ...stats };
          } catch (e) {
            if (c.resultFile) {
              const resultPath = path.resolve(process.cwd(), c.resultFile);
              stats = TestRunner.parseResultFile(resultPath);
            } else {
              stats.failed = 1;
            }
            return { status: "failed", ...stats };
          }
        }),
      );

      const passed = results.reduce((sum, r) => sum + (r.passed || 0), 0);
      const failed = results.reduce((sum, r) => sum + (r.failed || 0), 0);
      const skipped = results.reduce((sum, r) => sum + (r.skipped || 0), 0);
      this.logBatchResult(passed, failed, skipped);

      totalPassed += passed;
      totalFailed += failed;
      totalSkipped += skipped;
    }

    this.logFinalSummary(totalPassed, totalFailed, totalSkipped);
  }
}

// Instantiate and run.
new TestRunner().run().catch((err) => {
  console.error(err);
  process.exit(1);
});
