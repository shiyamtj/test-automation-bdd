import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/CustomWorld";
import { TEST_USERS, BASE_URL } from "../config";

/**
 * Composite step to log in with valid credentials
 */
Given(
  "I am logged in with valid credentials",
  async function (this: CustomWorld) {
    // Navigate to login page
    await this.loginPage.goto();
    // Fill credentials from constants
    await this.loginPage.fillUsername(TEST_USERS.VALID.username);
    await this.loginPage.fillPassword(TEST_USERS.VALID.password);
    // Submit login form
    await this.loginPage.clickLogin();
    // Wait for navigation to complete
    await this.page.waitForLoadState("networkidle");
  },
);

/**
 * Add the first product (index 0) to the cart
 */
When("I add the first product to the cart", async function (this: CustomWorld) {
  await this.inventoryPage.addProductToCart(0);
});

/**
 * Verify the cart badge displays the expected count
 */
Then(
  "the cart badge should show {string}",
  async function (this: CustomWorld, expected: string) {
    const actual = await this.inventoryPage.getCartBadgeCount();
    expect(actual).toBe(parseInt(expected, 10));
  },
);

/**
 * Logout from the application via the inventory page menu
 */
When("I logout from the application", async function (this: CustomWorld) {
  // Open the side menu before clicking logout
  await this.inventoryPage.openMenu();
  await this.inventoryPage.logout();
  await this.page.waitForLoadState("networkidle");
});

/**
 * Verify redirection to the login page after logout
 */
Then(
  "I should be redirected to the login page",
  async function (this: CustomWorld) {
    const currentUrl = this.page.url();
    // Normalize URLs by removing any trailing slash for comparison
    const normalize = (url: string) => url.replace(/\/+$/, "");
    expect(normalize(currentUrl)).toBe(normalize(BASE_URL));
  },
);
