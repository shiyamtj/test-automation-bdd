import { When, Then, Given } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/CustomWorld";
import { logger } from "../utils/Logger";

// ============================================================================
// GIVEN STEPS - Preconditions for test scenarios
// ============================================================================

/**
 * Navigate to SauceDemo login page
 */
Given(
  "I navigate to the SauceDemo login page",
  async function (this: CustomWorld) {
    logger.info("Step: Navigating to SauceDemo login page");
    await this.loginPage.goto();
  },
);

// ============================================================================
// WHEN STEPS - Actions performed during test scenarios
// ============================================================================

/**
 * Enter username in username field
 */
When(
  "I enter username {string}",
  async function (this: CustomWorld, username: string) {
    logger.info(`Step: Entering username: ${username}`);
    await this.loginPage.fillUsername(username);
  },
);

/**
 * Enter password in password field
 */
When(
  "I enter password {string}",
  async function (this: CustomWorld, password: string) {
    logger.info("Step: Entering password");
    await this.loginPage.fillPassword(password);
  },
);

/**
 * Click login button and wait for navigation
 */
When("I click the login button", async function (this: CustomWorld) {
  logger.info("Step: Clicking login button");
  await this.loginPage.clickLogin();
  // Wait for navigation to complete
  await this.page.waitForLoadState("networkidle");
});

/**
 * Clear username field without entering anything
 */
When("I leave the username field empty", async function (this: CustomWorld) {
  logger.info("Step: Leaving username field empty");
  await this.loginPage.clearUsername();
});

/**
 * Clear password field without entering anything
 */
When("I leave the password field empty", async function (this: CustomWorld) {
  logger.info("Step: Leaving password field empty");
  await this.loginPage.clearPassword();
});

/**
 * Click on forgot password link
 */
When("I click on the forgot password link", async function (this: CustomWorld) {
  logger.info("Step: Clicking forgot password link");
  await this.loginPage.clickResetPassword();
  await this.page.waitForLoadState("networkidle");
});

// ============================================================================
// THEN STEPS - Assertions and verifications
// ============================================================================

/**
 * Verify successful redirect to inventory page
 */
Then(
  "I should be redirect to the inventory page",
  async function (this: CustomWorld) {
    logger.info("Step: Asserting redirect to inventory page");
    const isOnInventoryPage = await this.inventoryPage.isOnInventoryPage();
    expect(isOnInventoryPage).toBe(true);
  },
);

/**
 * Verify products list is visible and contains products
 */
Then("I should see the products list", async function (this: CustomWorld) {
  logger.info("Step: Asserting products list visibility and count");
  const isVisible = await this.inventoryPage.isProductsListVisible();
  expect(isVisible).toBe(true);

  const productCount = await this.inventoryPage.getProductCount();
  expect(productCount).toBeGreaterThan(0);
});

/**
 * Verify error message is displayed
 */
Then("I should see an error message", async function (this: CustomWorld) {
  logger.info("Step: Asserting error message visibility");
  const isErrorVisible = await this.loginPage.isErrorVisible();
  expect(isErrorVisible).toBe(true);
});

/**
 * Verify error message contains expected text
 */
Then(
  "the error message should contain {string}",
  async function (this: CustomWorld, expectedText: string) {
    logger.info(`Step: Asserting error message contains: "${expectedText}"`);
    const errorMessage = await this.loginPage.getErrorMessage();
    expect(errorMessage).toContain(expectedText);
  },
);

/**
 * Verify user is redirected to password reset page
 */
Then(
  "I should see the password reset page",
  async function (this: CustomWorld) {
    logger.info("Step: Asserting password reset page");
    const currentUrl = await this.page.url();
    expect(currentUrl).toContain("reset_password");
  },
);
