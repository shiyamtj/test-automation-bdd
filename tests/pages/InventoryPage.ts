import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { SELECTORS } from "../config";

/**
 * InventoryPage - Page Object for SauceDemo inventory/products page
 * Handles all interactions with inventory page elements
 */
export class InventoryPage extends BasePage {
  private readonly productsList: Locator;
  private readonly productItems: Locator;
  private readonly cartIcon: Locator;
  private readonly menuButton: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.productsList = page.locator(SELECTORS.INVENTORY_PAGE.productList);
    this.productItems = page.locator(SELECTORS.INVENTORY_PAGE.productItem);
    this.cartIcon = page.locator(SELECTORS.INVENTORY_PAGE.cartIcon);
    this.menuButton = page.locator(SELECTORS.INVENTORY_PAGE.menuBtn);
    this.logoutLink = page.locator(SELECTORS.INVENTORY_PAGE.logout);
  }

  /**
   * Check if products list is visible
   */
  async isProductsListVisible(): Promise<boolean> {
    return this.isElementVisible(this.productsList);
  }

  /**
   * Get total count of products displayed
   */
  async getProductCount(): Promise<number> {
    return this.productItems.count();
  }

  /**
   * Check if user is on inventory page by URL
   */
  async isOnInventoryPage(): Promise<boolean> {
    const url = this.getCurrentUrl();
    return url.includes("/inventory.html");
  }

  /**
   * Click on cart icon to view cart
   */
  async clickCart(): Promise<void> {
    await this.clickElement(this.cartIcon, "cart icon");
  }

  /**
   * Check if cart icon is visible
   */
  async isCartIconVisible(): Promise<boolean> {
    return this.isElementVisible(this.cartIcon);
  }

  /**
   * Open menu
   */
  async openMenu(): Promise<void> {
    await this.clickElement(this.menuButton, "menu button");
  }

  /**
   * Click logout option
   */
  async logout(): Promise<void> {
    await this.clickElement(this.logoutLink, "logout link");
  }

  /**
   * Get product by index and click 'Add to Cart' button
   */
  async addProductToCart(productIndex: number): Promise<void> {
    const addToCartButton = this.page
      .locator(SELECTORS.INVENTORY_PAGE.addToCartBtn)
      .nth(productIndex);
    await this.clickElement(
      addToCartButton,
      `add to cart button for product ${productIndex}`,
    );
  }

  /**
   * Remove a product from the cart by clicking the same button (which toggles to "Remove")
   */
  async removeProductFromCart(productIndex: number): Promise<void> {
    const removeButton = this.page
      .locator(SELECTORS.INVENTORY_PAGE.removeFromCartBtn)
      .nth(productIndex);
    await this.clickElement(
      removeButton,
      `remove from cart button for product ${productIndex}`,
    );
    // Small pause to allow the cart badge to update after removal
    // Wait a bit longer to ensure the cart badge updates after removal
    await this.page.waitForTimeout(1500);
  }

  /**
   * Get the number displayed in the cart badge (items count)
   * Returns 0 if badge is not visible
   */
  async getCartBadgeCount(): Promise<number> {
    const badge = this.page.locator(SELECTORS.INVENTORY_PAGE.cartBadge);
    if (await badge.isVisible()) {
      const text = await badge.textContent();
      const count = parseInt(text ?? "0", 10);
      return isNaN(count) ? 0 : count;
    }
    return 0;
  }
}
