import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/CustomWorld";

/**
 * Add a product to the cart by its index (0‑based)
 */
When(
  "I add product {int} to the cart",
  async function (this: CustomWorld, index: number) {
    await this.inventoryPage.addProductToCart(index);
  },
);

/**
 * Remove a product from the cart by its index
 */
When(
  "I remove product {int} from the cart",
  async function (this: CustomWorld, index: number) {
    await this.inventoryPage.removeProductFromCart(index);
  },
);

/**
 * Verify the cart badge shows the expected number of items
 */
import { SELECTORS } from "../config";

Then(
  "the cart badge should show {int}",
  async function (this: CustomWorld, expectedCount: number) {
    // Use Playwright's built‑in matcher to wait for the badge text to match the expected count
    const badge = this.page.locator(SELECTORS.INVENTORY_PAGE.cartBadge);
    await expect(badge).toHaveText(expectedCount.toString(), { timeout: 5000 });
  },
);
