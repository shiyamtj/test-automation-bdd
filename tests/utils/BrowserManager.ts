import {
  chromium,
  firefox,
  webkit,
  BrowserType,
  Browser,
  Page,
} from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { getBrowserConfig } from "../config/browser.config";
import { logger } from "./Logger";

// Load environment variables from .env file
dotenv.config();

let browser: Browser | null = null;
let page: Page | null = null;

/**
 * Get the appropriate browser type based on environment variable
 */
const getBrowserTypeByName = (): BrowserType => {
  const browserName = process.env.BROWSER || "chromium";
  switch (browserName.toLowerCase()) {
    case "firefox":
      logger.debug("Using Firefox browser");
      return firefox;
    case "webkit":
      logger.debug("Using WebKit browser");
      return webkit;
    default:
      logger.debug("Using Chromium browser");
      return chromium;
  }
};

/**
 * Launch browser with configuration
 * @throws Error if browser launch fails
 */
export const launchBrowser = async (): Promise<void> => {
  try {
    const config = getBrowserConfig();
    logger.info(`Launching browser: ${config.name.toUpperCase()}`);

    const browserType = getBrowserTypeByName();

    browser = await browserType.launch({
      headless: config.headless,
      slowMo: config.slowMo,
      args: config.args,
    });

    logger.info("Browser launched successfully", {
      browser: config.name.toUpperCase(),
      headless: config.headless,
      slowMo: config.slowMo,
      timeout: `${config.timeout}ms`,
    });
  } catch (error) {
    logger.error("Failed to launch browser", error);
    throw error;
  }
};

/**
 * Create a new page with configured timeouts and viewport
 * @returns New Page instance
 * @throws Error if browser is not launched
 */
export const createNewPage = async (): Promise<Page> => {
  try {
    if (!browser) {
      throw new Error("Browser is not launched. Call launchBrowser() first.");
    }

    logger.info("Creating new page...");
    const config = getBrowserConfig();
    page = await browser.newPage({
      viewport: config.viewport,
    });

    page.setDefaultNavigationTimeout(config.timeout);
    page.setDefaultTimeout(config.timeout);

    // Start tracing if enabled
    if (config.enableTracing) {
      await startTracing();
    }

    logger.info("Page created successfully", {
      viewport: {
        width: `${config.viewport?.width}px`,
        height: `${config.viewport?.height}px`,
      },
      navigationTimeout: `${config.timeout}ms`,
      tracingEnabled: config.enableTracing,
    });

    return page;
  } catch (error) {
    logger.error("Failed to create page", error);
    throw error;
  }
};

/**
 * Start Playwright tracing
 * @param traceName Optional name for the trace file
 */
export const startTracing = async (
  traceName: string = "trace",
): Promise<void> => {
  try {
    if (!page) {
      logger.warn("Cannot start tracing: Page not initialized");
      return;
    }

    await page.context().tracing.start({
      screenshots: true,
      snapshots: true,
    });

    logger.info(`Tracing started for scenario: ${traceName}`);
  } catch (error) {
    logger.error("Failed to start tracing", error);
  }
};

/**
 * Stop Playwright tracing and save it to a file
 * @param traceName Name of the trace file (without extension)
 */
export const stopTracing = async (
  traceName: string = "trace",
): Promise<void> => {
  try {
    if (!page) {
      logger.warn("Cannot stop tracing: Page not initialized");
      return;
    }

    const traceDir = "./test-results/traces";
    const tracePath = path.join(traceDir, `${traceName}.zip`);

    // Create traces directory if it doesn't exist
    const fs = require("fs");
    if (!fs.existsSync(traceDir)) {
      fs.mkdirSync(traceDir, { recursive: true });
    }

    await page.context().tracing.stop({ path: tracePath });
    logger.info(`Trace saved to: ${tracePath}`);
  } catch (error) {
    logger.error("Failed to stop tracing", error);
  }
};

/**
 * Get the current page instance
 * @returns Current Page instance
 * @throws Error if page is not initialized
 */
export const getPage = (): Page => {
  if (!page) {
    const errorMsg = "Page is not initialized. Call createNewPage() first.";
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
  return page;
};

/**
 * Close the current page
 */
export const closePage = async (): Promise<void> => {
  try {
    if (page) {
      logger.info("Closing page...");
      await page.close();
      page = null;
      logger.info("Page closed");
    }
  } catch (error) {
    logger.error("Error closing page", error);
  }
};

/**
 * Close the browser
 */
export const closeBrowser = async (): Promise<void> => {
  try {
    if (browser) {
      logger.info("Closing browser...");
      await browser.close();
      browser = null;
      logger.info("Browser closed");
    }
  } catch (error) {
    logger.error("Error closing browser", error);
  }
};
