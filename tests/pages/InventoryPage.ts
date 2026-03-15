import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SELECTORS } from '../config';

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
    return url.includes('/inventory.html');
  }

  /**
   * Click on cart icon to view cart
   */
  async clickCart(): Promise<void> {
    await this.clickElement(this.cartIcon, 'cart icon');
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
    await this.clickElement(this.menuButton, 'menu button');
  }

  /**
   * Click logout option
   */
  async logout(): Promise<void> {
    await this.clickElement(this.logoutLink, 'logout link');
  }

  /**
   * Get product by index and click 'Add to Cart' button
   */
  async addProductToCart(productIndex: number): Promise<void> {
    const addToCartButton = this.page.locator(SELECTORS.INVENTORY_PAGE.addToCartBtn).nth(productIndex);
    await this.clickElement(addToCartButton, `add to cart button for product ${productIndex}`);
  }
}
