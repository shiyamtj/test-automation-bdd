import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SELECTORS, BASE_URL } from '../config';

/**
 * LoginPage - Page Object for SauceDemo login page
 * Handles all interactions with login page elements
 */
export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly resetPasswordLink: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator(SELECTORS.LOGIN_PAGE.username);
    this.passwordInput = page.locator(SELECTORS.LOGIN_PAGE.password);
    this.loginButton = page.locator(SELECTORS.LOGIN_PAGE.loginBtn);
    this.errorMessage = page.locator(SELECTORS.LOGIN_PAGE.errorMsg);
    this.resetPasswordLink = page.locator(SELECTORS.LOGIN_PAGE.resetPwdLink);
  }

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await this.navigateToUrl(BASE_URL);
  }

  /**
   * Fill username field with provided username
   */
  async fillUsername(username: string): Promise<void> {
    await this.fillText(this.usernameInput, username, 'username');
  }

  /**
   * Fill password field with provided password
   */
  async fillPassword(password: string): Promise<void> {
    await this.fillText(this.passwordInput, password, 'password');
  }

  /**
   * Clear username field
   */
  async clearUsername(): Promise<void> {
    await this.clearElement(this.usernameInput, 'username');
  }

  /**
   * Clear password field
   */
  async clearPassword(): Promise<void> {
    await this.clearElement(this.passwordInput, 'password');
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    await this.clickElement(this.loginButton, 'login button');
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    return this.getElementText(this.errorMessage);
  }

  /**
   * Check if error message is visible
   */
  async isErrorVisible(): Promise<boolean> {
    return this.isElementVisible(this.errorMessage);
  }

  /**
   * Click reset password link
   */
  async clickResetPassword(): Promise<void> {
    await this.clickElement(this.resetPasswordLink, 'reset password link');
  }

  /**
   * Check if reset password link is visible
   */
  async isResetPasswordLinkVisible(): Promise<boolean> {
    return this.isElementVisible(this.resetPasswordLink);
  }
}
