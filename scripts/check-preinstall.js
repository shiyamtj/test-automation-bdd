#!/usr/bin/env node
// scripts/check-preinstall.js
// This script runs during the npm/yarn preinstall phase.
// It verifies that the project is being installed with Yarn and that the Playwright CLI is available globally.
// If a requirement is missing, it prints a clear message with the exact command to install it and aborts.

const { execSync } = require('child_process');

function abort(message) {
  console.error('❌ ' + message);
  process.exit(1);
}

// 1️⃣ Ensure Yarn is the package manager
if (!process.env.npm_execpath || !process.env.npm_execpath.includes('yarn')) {
  abort('This project requires Yarn. Please run the installation with:\n    yarn install');
}

// 2️⃣ Ensure Playwright CLI is installed globally
try {
  execSync('playwright --version', { stdio: 'ignore' });
} catch (_) {
  abort('Playwright CLI is not installed globally. Install it with one of the following commands:\n    npm i -g playwright\n    yarn global add playwright');
}

console.log('✅ All pre‑install dependencies are satisfied.');
process.exit(0);
