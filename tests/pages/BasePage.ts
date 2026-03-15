/**
 * BasePage Class
 * Base class for all page objects with common functionality
 */

import { Page, Locator } from '@playwright/test';
import { logger } from '../utils/Logger';
import { TIMEOUTS } from '../config/constants';

export abstract class BasePage {
  protected page: Page;
  /**
   * Protected constructor - only subclasses can instantiate
   */
  constructor(page: Page) {
    this.page = page;
    logger.debug(`${this.constructor.name} initialized`);
  }

  /**
   * Navigate to a URL (protected method for subclasses)
   */
  protected async navigateToUrl(url: string): Promise<void> {
    logger.info(`Navigating to: ${url}`);
    try {
      await this.page.goto(url, { waitUntil: 'networkidle' });
      logger.info(`Successfully navigated to: ${url}`);
    } catch (error) {
      logger.error(`Failed to navigate to ${url}`, error);
      throw error;
    }
  }

  /**
   * Get current page URL
   */
  protected getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Safe element visibility check
   */
  protected async isElementVisible(locator: Locator, timeout: number = TIMEOUTS.WAIT_FOR_ELEMENT): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Safe text content retrieval
   */
  protected async getElementText(locator: Locator): Promise<string | null> {
    try {
      return await locator.textContent({ timeout: TIMEOUTS.ACTION });
    } catch (error) {
      logger.warn(`Failed to get text from element`, error);
      return null;
    }
  }

  /**
   * Safe element interaction with logging
   */
  protected async fillText(locator: Locator, text: string, label: string = 'field'): Promise<void> {
    try {
      logger.debug(`Filling ${label} with text`);
      await locator.fill(text);
    } catch (error) {
      logger.error(`Failed to fill ${label}`, error);
      throw error;
    }
  }

  /**
   * Safe element click with logging
   */
  protected async clickElement(locator: Locator, label: string = 'element'): Promise<void> {
    try {
      logger.debug(`Clicking ${label}`);
      await locator.click();
    } catch (error) {
      logger.error(`Failed to click ${label}`, error);
      throw error;
    }
  }

  /**
   * Clear element text
   */
  protected async clearElement(locator: Locator, label: string = 'field'): Promise<void> {
    try {
      logger.debug(`Clearing ${label}`);
      await locator.clear();
    } catch (error) {
      logger.error(`Failed to clear ${label}`, error);
      throw error;
    }
  }

  /**
   * Wait for element to be ready
   */
  protected async waitForElement(locator: Locator, timeout: number = TIMEOUTS.WAIT_FOR_ELEMENT): Promise<void> {
    try {
      await locator.waitFor({ timeout });
    } catch (error) {
      logger.error(`Element did not appear within ${timeout}ms`, error);
      throw error;
    }
  }
}
