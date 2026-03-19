<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# BDD Test Automation Project - Development Guide

## Project Overview

This is a comprehensive BDD test automation project using CucumberJS, Playwright, TypeScript, and Yarn. The project includes sample login tests for SauceDemo (https://www.saucedemo.com/).

## Key Technologies

- **CucumberJS**: BDD framework for writing readable test scenarios
- **Playwright**: Browser automation and testing framework
- **TypeScript**: Strongly-typed JavaScript for better code quality
- **Yarn**: Package manager for dependency management
- **Page Object Model**: Design pattern for maintainable test code

## Project Setup

### Prerequisites

- Node.js v16 or higher
- Yarn package manager installed

### Installation Steps

1. Navigate to project directory: `cd test-automation-bdd`
2. Install dependencies: `yarn install`
3. Copy environment template: `cp .env.example .env`
4. Install Playwright browsers: `npx playwright install`

## Development Guidelines

### File Structure

```
test-automation-bdd/
├── .github/                         # Workspace‑specific Copilot instructions
│   └── copilot-instructions.md      # This file
├── tests/                            # All test‑related code
│   ├── features/                     # Gherkin feature files
│   │   └── login.feature             # Login test scenarios
│   ├── steps/                        # Step definitions (Gherkin implementation)
│   │   └── login.steps.ts            # Login step definitions
│   ├── support/                      # Cucumber support code
│   │   ├── hooks.ts                  # Setup/teardown lifecycle hooks
│   │   └── CustomWorld.ts            # Cucumber World fixture class
│   ├── pages/                        # Page Object Models
│   │   ├── BasePage.ts               # Base class with common methods
│   │   ├── LoginPage.ts              # Login page object
│   │   └── InventoryPage.ts          # Inventory page object
│   ├── config/                       # Configuration \& constants
│   │   ├── index.ts                  # Selectors \& config barrel export
│   │   ├── constants.ts              # URLs, timeouts, test users, error messages
│   │   └── browser.config.ts         # Browser launch settings
│   └── utils/                        # Test utilities
│       ├── Logger.ts                 # Logging utility
│       └── BrowserManager.ts         # Browser lifecycle management
├── cucumber.js                       # Cucumber configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Project dependencies
├── .env.example                      # Template for environment variables
└── .env                              # Local environment overrides (git‑ignored)
```

### Writing Tests

1. **Feature Files** (`tests/features/*.feature`): Write test scenarios in Gherkin syntax (Given/When/Then)
2. **Page Objects** (`tests/pages/`): Define UI elements and interactions using Playwright locators
3. **Step Definitions** (`tests/steps/*.steps.ts`): Implement Gherkin steps matching feature file text
4. **Hooks** (`tests/hooks/hooks.ts`): Use Before/After hooks for browser setup/teardown
5. **Tags**: Use `@smoke`, `@regression`, `@login` to organize and filter tests

### Common Commands

- `yarn test` - Run all tests in parallel (default: 2 workers)
- `yarn test:headed` - Run tests with visible browser (sequential: useful for debugging)
- `yarn test:smoke` - Run only @smoke tagged tests
- `yarn test:regression` - Run only @regression tagged tests
- `yarn test:tags @tag-name` - Run tests matching specific tag(s)
- `yarn test:debug` - Run tests with Node debugger enabled
- `yarn clean` - Clean up test results and reports directories
- `yarn test:concurrent` - Run tests concurrently using the custom `run-tests.ts` script. This is ideal for CI environments where you want all tests to execute in parallel.
- `yarn report` - Generate HTML and JSON test reports. Run this after executing tests to produce the report files in `test-results/`.

**Note:** HTML and JSON reports are automatically generated in `test-results/` after each test run

### Test Configuration

The `cucumber.js` file defines multiple profiles:

- **default**: Runs all tests with parallel execution (2 workers), generates HTML and JSON reports
- **smoke**: Runs only @smoke tagged tests, generates HTML report
- Both profiles use ts-node to transpile TypeScript on-the-fly

## Test Scenarios

The login.feature file includes:

- ✅ Successful login (valid credentials)
- ❌ Failed login (invalid credentials, empty fields)
- 🔄 Password reset navigation

## Page Objects Created

- **LoginPage.ts**: Username/password fields, login button, error messages
- **InventoryPage.ts**: Products list validation, page navigation checks

## Naming Conventions

- Page classes: PascalCase (e.g., `LoginPage`)
- Feature files: kebab-case (e.g., `login.feature`)
- Step definitions: kebab-case with `.steps.ts` suffix
- Gherkin keywords: Given, When, Then

## Environment Configuration

All configuration values have sensible defaults defined in `tests/config/constants.ts`. Create a `.env` file based on `.env.example` to override only the values you need:

**Application URL**

- `BASE_URL`: Application under test (default: `https://www.saucedemo.com`)

**Browser Settings**

- `BROWSER`: Choose `chromium`, `firefox`, or `webkit` (default: `chromium`)
- `HEADLESS`: Set to `true` for headless mode or `false` for visible browser (default: `true`)
- `SLOW_MO`: Slow down actions in milliseconds for debugging (default: `0`)
- `VIEWPORT_WIDTH`: Browser viewport width in pixels (default: `1280`)
- `VIEWPORT_HEIGHT`: Browser viewport height in pixels (default: `720`)

**Timeouts** (in milliseconds)

- `NAVIGATION_TIMEOUT`: Maximum time to wait for page navigation (default: `30000`)
- `ACTION_TIMEOUT`: Maximum time to wait for user interactions (default: `10000`)

**Test Credentials** (for SauceDemo)

- `VALID_USERNAME`: Valid login username (default: `standard_user`)
- `VALID_PASSWORD`: Valid login password (default: `secret_sauce`)
- `INVALID_USERNAME`: Invalid login username (default: `invalid_user`)
- `INVALID_PASSWORD`: Invalid login password (default: `wrong_password`)

**Note:** Test credentials are provided by SauceDemo for demonstration purposes only.

## Adding New Tests

1. **Create feature file** in `tests/features/` with scenarios using Gherkin syntax
   - Example: `tests/features/checkout.feature`
   - Use descriptive scenario names and meaningful Given/When/Then steps
   - Apply tags for test organization: `@smoke`, `@regression`, `@checkout`

2. **Create page object** in `tests/pages/` for any new pages
   - Extend `BasePage` class for common functionality
   - Example: `tests/pages/CheckoutPage.ts`
   - Define locators as protected properties, implement page interactions as methods

3. **Implement step definitions** in `tests/steps/`
   - Create file with naming pattern: `feature-name.steps.ts`
   - Example: `tests/steps/checkout.steps.ts`
   - Use `Given`, `When`, `Then` decorators from `@cucumber/cucumber`
   - Access page objects and browser via CustomWorld context: `async function (this: CustomWorld)`
   - Reference pages as `this.loginPage`, `this.inventoryPage`, `this.page`

4. **Update support code** if needed in `tests/support/`
   - Add page object properties to `tests/support/CustomWorld.ts` for new pages
   - Update hooks in `tests/support/hooks.ts` to instantiate new page objects
   - Use After hooks for cleanup or reporting

5. **Run tests** with appropriate command:
   - `yarn test` - Run all tests
   - `yarn test:tags @your-tag` - Run specific tag
   - `yarn test:headed` - Run with visible browser (sequential)

## Testing Best Practices

- Use Page Object Model pattern
- Keep step definitions focused and reusable
- Use meaningful tags for test organization
- Handle waits explicitly (networkidle, etc.)
- Validate with assertions from @playwright/test

## Configuration Structure

### constants.ts

Centralized configuration file that exports:

- `BASE_URL`: Application URL
- `TIMEOUTS`: Navigation and action timeout values
- `TEST_USERS`: Valid and invalid user credentials
- `ENDPOINTS`: Application route paths
- `ERROR_MESSAGES`: Common error message strings

### index.ts

Barrel export file that re-exports all constants plus:

- `SELECTORS`: Centralized UI element locators for all pages (organized by page)

### browser.config.ts

Browser configuration helper that reads environment variables and provides:

- `getBrowserConfig()`: Returns Playwright browser options

## Troubleshooting

- **Timeout errors**: Increase `NAVIGATION_TIMEOUT` or `ACTION_TIMEOUT` in `.env`
- **Element not found**: Verify selectors in `tests/config/index.ts` match current DOM
- **Browser issues**: Run `npx playwright install` to install browser binaries
- **Tests fail to run**: Ensure TypeScript is transpiled via `ts-node` (configured in `cucumber.js`)

## Useful Links

- Cucumber.js: https://github.com/cucumber/cucumber-js
- Playwright: https://playwright.dev/
- SauceDemo: https://www.saucedemo.com/
- Page Object Model: https://playwright.dev/docs/pom
