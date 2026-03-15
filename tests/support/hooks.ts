import {
  Before,
  After,
  setWorldConstructor,
  ITestCaseHookParameter,
} from "@cucumber/cucumber";
import { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CustomWorld } from "./CustomWorld";
import {
  launchBrowser,
  createNewPage,
  closePage,
  closeBrowser,
  stopTracing,
} from "../utils/BrowserManager";
import { logger } from "../utils/Logger";
import { getBrowserConfig } from "../config/browser.config";

/**
 * Set custom World class for Cucumber
 * This makes CustomWorld available as 'this' in step definitions
 */
setWorldConstructor(CustomWorld);

/**
 * Before Hook - Runs before each scenario
 * Initializes browser, creates a page, and attaches page objects to World fixture
 */
Before(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  logger.separator();
  logger.info(`Starting scenario: ${scenario.pickle.name}`);
  logger.separator();

  try {
    await launchBrowser();
    const page: Page = await createNewPage();

    // Attach to World (this) for use in step definitions
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);

    logger.info("Test scenario setup completed successfully");
  } catch (error) {
    logger.error("Failed to setup test scenario", error);
    throw error;
  }
});

/**
 * After Hook - Runs after each scenario
 * Captures screenshot and embeds directly in Cucumber report (no file storage)
 */
After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  logger.info(`Tearing down test scenario: ${scenario.pickle.name}`, {
    status: scenario.result?.status,
  });
  try {
    // Check if page exists before trying to get it
    if (this.page && !this.page.isClosed()) {
      try {
        const config = getBrowserConfig();

        // Stop tracing only if it was enabled
        if (config.enableTracing) {
          const scenarioName = scenario.pickle.name
            .replace(/\s+/g, "_")
            .toLowerCase();
          await stopTracing(scenarioName);
        }

        // Capture screenshot in memory without saving to disk
        const screenshotBuffer = await this.page.screenshot();

        // Attach screenshot directly to Cucumber report as base64 in JSON
        await this.attach(screenshotBuffer, "image/png");

        logger.info("Screenshot captured and embedded in report");
      } catch (screenshotError) {
        logger.warn("Failed to capture screenshot", screenshotError);
      }
    }

    await closePage();
    await closeBrowser();

    logger.info("Test scenario teardown completed");
  } catch (error) {
    logger.error("Failed to teardown test scenario", error);
    throw error;
  }
});
