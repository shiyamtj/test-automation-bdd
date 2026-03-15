// run-tests.ts
// This TypeScript script loads environment variables (via dotenv) and runs multiple Cucumber test suites concurrently.
// It is intended to be executed with `ts-node` (already a devDependency).

import { spawn } from "child_process";

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

async function main() {
  // Load command definitions from a JSON file (run-commands.json).
  const path = require('path');
  const { readFileSync } = require('fs');
  const commandsPath = path.resolve(__dirname, 'run-commands.json');
  const raw = readFileSync(commandsPath, 'utf8');
  const commandDefs: {
    command: string;
    args: string[];
    label: string;
    env?: Record<string, string>;
  }[] = JSON.parse(raw);

  // Convert each definition into a runCommand promise.
  const tasks: Promise<void>[] = commandDefs.map((c) =>
    runCommand(c.command, c.args, c.label, c.env)
  );

  // Await all tasks concurrently.
  await Promise.all(tasks);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
