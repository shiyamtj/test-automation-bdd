import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { hooksContext } from '../hooks/hooks';
import { logger } from '../utils/Logger';

// ============================================================================
// GIVEN STEPS - Preconditions for test scenarios
// ============================================================================

/**
 * Navigate to SauceDemo login page
 */
Given('I navigate to the SauceDemo login page', async () => {
  logger.info('Step: Navigating to SauceDemo login page');
  await hooksContext.loginPage!.goto();
});

// ============================================================================
// WHEN STEPS - Actions performed during test scenarios
// ============================================================================

/**
 * Enter username in username field
 */
When('I enter username {string}', async (username: string) => {
  logger.info(`Step: Entering username: ${username}`);
  await hooksContext.loginPage!.fillUsername(username);
});

/**
 * Enter password in password field
 */
When('I enter password {string}', async (password: string) => {
  logger.info('Step: Entering password');
  await hooksContext.loginPage!.fillPassword(password);
});

/**
 * Click login button and wait for navigation
 */
When('I click the login button', async () => {
  logger.info('Step: Clicking login button');
  await hooksContext.loginPage!.clickLogin();
  // Wait for navigation to complete
  await hooksContext.page!.waitForLoadState('networkidle');
});

/**
 * Clear username field without entering anything
 */
When('I leave the username field empty', async () => {
  logger.info('Step: Leaving username field empty');
  await hooksContext.loginPage!.clearUsername();
});

/**
 * Clear password field without entering anything
 */
When('I leave the password field empty', async () => {
  logger.info('Step: Leaving password field empty');
  await hooksContext.loginPage!.clearPassword();
});

/**
 * Click on forgot password link
 */
When('I click on the forgot password link', async () => {
  logger.info('Step: Clicking forgot password link');
  await hooksContext.loginPage!.clickResetPassword();
  await hooksContext.page!.waitForLoadState('networkidle');
});

// ============================================================================
// THEN STEPS - Assertions and verifications
// ============================================================================

/**
 * Verify successful redirect to inventory page
 */
Then('I should be redirect to the inventory page', async () => {
  logger.info('Step: Asserting redirect to inventory page');
  const isOnInventoryPage = await hooksContext.inventoryPage!.isOnInventoryPage();
  expect(isOnInventoryPage).toBe(true);
});

/**
 * Verify products list is visible and contains products
 */
Then('I should see the products list', async () => {
  logger.info('Step: Asserting products list visibility and count');
  const isVisible = await hooksContext.inventoryPage!.isProductsListVisible();
  expect(isVisible).toBe(true);

  const productCount = await hooksContext.inventoryPage!.getProductCount();
  expect(productCount).toBeGreaterThan(0);
});

/**
 * Verify error message is displayed
 */
Then('I should see an error message', async () => {
  logger.info('Step: Asserting error message visibility');
  const isErrorVisible = await hooksContext.loginPage!.isErrorVisible();
  expect(isErrorVisible).toBe(true);
});

/**
 * Verify error message contains expected text
 */
Then('the error message should contain {string}', async (expectedText: string) => {
  logger.info(`Step: Asserting error message contains: "${expectedText}"`);
  const errorMessage = await hooksContext.loginPage!.getErrorMessage();
  expect(errorMessage).toContain(expectedText);
});

/**
 * Verify user is redirected to password reset page
 */
Then('I should see the password reset page', async () => {
  logger.info('Step: Asserting password reset page');
  const currentUrl = await hooksContext.page!.url();
  expect(currentUrl).toContain('reset_password');
});
