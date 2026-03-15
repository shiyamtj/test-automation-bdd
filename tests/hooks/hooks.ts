import { Before, After, ITestCaseHookParameter } from "@cucumber/cucumber";
import { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import {
  launchBrowser,
  createNewPage,
  closePage,
  closeBrowser,
  getPage,
  stopTracing,
} from "../utils/BrowserManager";
import { logger } from "../utils/Logger";

/**
 * Hooks Context - Global state for page objects accessible in step definitions
 */
export const hooksContext = {
  page: null as Page | null,
  loginPage: null as LoginPage | null,
  inventoryPage: null as InventoryPage | null,
};

/**
 * Before Hook - Runs before each scenario
 * Initializes browser, creates a page, and sets up page objects
 */
Before(async function (scenario: ITestCaseHookParameter) {
  logger.info(
    "═══════════════════════════════════════════════════════════════",
  );
  logger.info(`Starting scenario: ${scenario.pickle.name}`);
  logger.info(
    "═══════════════════════════════════════════════════════════════",
  );

  try {
    await launchBrowser();
    const page: Page = await createNewPage();

    // Store in global context for use in step definitions
    hooksContext.page = page;
    hooksContext.loginPage = new LoginPage(page);
    hooksContext.inventoryPage = new InventoryPage(page);

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
After(async function (scenario: ITestCaseHookParameter) {
  logger.info(`Tearing down test scenario: ${scenario.pickle.name}`, {
    status: scenario.result?.status,
  });
  try {
    // Check if page exists before trying to get it
    if (hooksContext.page && !hooksContext.page.isClosed()) {
      try {
        // Stop tracing if enabled (before closing page)
        const scenarioName = scenario.pickle.name
          .replace(/\s+/g, "_")
          .toLowerCase();
        await stopTracing(scenarioName);

        // Capture screenshot in memory without saving to disk
        const screenshotBuffer = await hooksContext.page.screenshot();

        // Attach screenshot directly to Cucumber report as base64 in JSON
        await this.attach(screenshotBuffer, "image/png");

        logger.info("Screenshot captured and embedded in report");
      } catch (screenshotError) {
        logger.warn("Failed to capture screenshot", screenshotError);
      }
    }

    await closePage();
    await closeBrowser();

    // Reset context
    hooksContext.page = null;
    hooksContext.loginPage = null;
    hooksContext.inventoryPage = null;

    logger.info("Test scenario teardown completed");
  } catch (error) {
    logger.error("Failed to teardown test scenario", error);
    throw error;
  }
});
