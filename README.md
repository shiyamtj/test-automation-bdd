# BDD Test Automation Project

A comprehensive test automation project built with **CucumberJS**, **Playwright**, **TypeScript**, and **Yarn**. This project includes sample login tests for the [SauceDemo](https://www.saucedemo.com/) application.

## Project Structure

```
test-automation-bdd/
├── tests/                            # All test-related code
│   ├── features/                     # Gherkin feature files
│   │   └── login.feature             # Login test scenarios
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
│   ├── config/                       # Configuration & constants
│   │   ├── index.ts                  # Config barrel export
│   │   ├── constants.ts              # URLs, timeouts, test users, messages
│   │   └── browser.config.ts         # Browser launch settings
│   ├── utils/                        # Test utilities
│   │   ├── Logger.ts                 # Logging utility
│   │   └── BrowserManager.ts         # Browser lifecycle management
├── cucumber.js                       # Cucumber configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
├── .env.example                      # Environment variables template
└── README.md                          # This file

```

## Prerequisites

- **Node.js** (v16 or higher)
- **Yarn** package manager

## Installation

1. **Clone or navigate to the project:**

   ```bash
   cd test-automation-bdd
   ```

2. **Install dependencies using Yarn:**

   ```bash
   yarn install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   The `.env` file includes:
   - `BASE_URL`: Target application URL (default: https://www.saucedemo.com)
   - `BROWSER`: Browser to use (chromium, firefox, webkit)
   - `HEADLESS`: Run browser in headless mode (true/false)
   - `SLOW_MO`: Slow down actions (in milliseconds)
   - Test credentials for the SauceDemo application

## Running Tests

### Run all tests

```bash
yarn test
```

### Run tests in headed mode

```bash
yarn test:headed
```

### Run smoke tests only

```bash
yarn test:smoke
```

### Run regression tests only

```bash
yarn test:regression
```

### Run tests with specific tags

```bash
yarn test:tags @login
```

### Debug tests

```bash
yarn test:debug
```

## Test Architecture

The project uses the **Page Object Model** pattern with **Cucumber's World fixture** for clean, maintainable tests:

- **CustomWorld**: Cucumber World class that provides page object instances and browser page to step definitions
- **Page Objects**: Encapsulate UI interactions and element locators for each page
- **Step Definitions**: Implement Gherkin steps using the CustomWorld context (`this.loginPage`)
- **Hooks**: Before/After lifecycle hooks manage browser and page setup/teardown

## Test Features

The project includes comprehensive login test scenarios:

- ✅ Successful login with valid credentials
- ❌ Login fails with invalid credentials
- ❌ Login fails with empty username
- ❌ Login fails with empty password
- 🔄 Navigation to reset password

Each scenario is tagged with:

- `@smoke`: Quick smoke tests
- `@regression`: Full regression test suite

## Page Object Model

### LoginPage

- `fillUsername(username)` - Fill username field
- `fillPassword(password)` - Fill password field
- `clickLogin()` - Click login button
- `getErrorMessage()` - Get error message text
- `clickResetPassword()` - Click reset password link

### InventoryPage

- `isProductsListVisible()` - Check if products are visible
- `getProductCount()` - Get number of products
- `isOnInventoryPage()` - Verify user is on inventory page

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
BASE_URL=https://www.saucedemo.com
BROWSER=chromium              # chromium, firefox, or webkit
HEADLESS=true                 # true or false
SLOW_MO=0                      # milliseconds to slow down
NAVIGATION_TIMEOUT=30000       # milliseconds
ACTION_TIMEOUT=10000           # milliseconds
```

## Test Credentials (SauceDemo)

The following credentials are available for testing:

### Valid Users

- Username: `standard_user` | Password: `secret_sauce`
- Username: `problem_user` | Password: `secret_sauce`
- Username: `performance_glitch_user` | Password: `secret_sauce`

### Locked User

- Username: `locked_out_user` | Password: `secret_sauce`

## Project Dependencies

- **@cucumber/cucumber** - BDD framework
- **@playwright/test** - Browser automation and testing
- **playwright** - Browser automation library
- **typescript** - TypeScript compiler
- **ts-node** - TypeScript execution
- **@types/node** - Node.js type definitions
- **dotenv** - Environment variable management

## Scripts

- `yarn test` - Run all tests
- `yarn test:headed` - Run tests in headed mode
- `yarn test:debug` - Debug tests
- `yarn test:tags` - Run tests by tags
- `yarn test:smoke` - Run smoke tests
- `yarn test:regression` - Run regression tests
- `yarn report` - Generate HTML report
- `yarn clean` - Clean test results
  [Additional scripts]
- `yarn test:concurrent` - Run tests concurrently using the custom script defined in `run-tests.ts`. This script executes all tests in parallel and is useful for CI pipelines.
- `yarn report` - Generate HTML and JSON reports (already listed). Ensure you run this after tests to view results in `test-results/`.

## Test Results

## Documentation

- [Test Development Quick Reference](tests/.instructions.md)

Test results are generated in the following locations:

- **HTML Report**: `test-results/cucumber-report.html`
- **JSON Report**: `test-results/cucumber-report.json`

## Best Practices

1. **Use Page Object Model** - Keep selenium element selectors in page classes
2. **Use Feature Files** - Write readable test scenarios in Gherkin syntax
3. **Environment Variables** - Store configuration in `.env` file
4. **Tagging** - Use tags to organize and run specific test sets
5. **Timeouts** - Configure appropriate timeouts for your application
6. **Error Handling** - Implement proper error handling in step definitions

## Troubleshooting

### Tests fail with timeout errors

- Increase `NAVIGATION_TIMEOUT` or `ACTION_TIMEOUT` in `.env`

### Browser won't start

- Ensure Playwright browsers are installed: `npx playwright install`
- Check BROWSER environment variable is set correctly

### Element not found errors

- Verify the application URL is correct in `.env`
- Use browser DevTools to inspect element selectors
- Update selectors in page classes if application changed

## Next Steps

1. Add more feature files in `tests/features/` directory
2. Create additional page objects in `tests/pages/`
3. Implement helper utilities in `tests/utils/`
4. Add more step definitions in `tests/steps/`
5. Configure CI/CD pipeline for automated testing
6. Integrate with test reporting tools

## License

MIT

## Contributing

Feel free to extend this project with additional features, page objects, and test scenarios.
