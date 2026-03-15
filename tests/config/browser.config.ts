/**
 * Browser Configuration
 * Settings for Playwright browser behavior and testing environment
 */

export interface BrowserConfig {
  name: string;
  headless: boolean;
  slowMo: number;
  timeout: number;
  viewport?: {
    width: number;
    height: number;
  };
  args?: string[];
}

/**
 * Get browser configuration based on environment variables
 */
export const getBrowserConfig = (): BrowserConfig => {
  const browserName = process.env.BROWSER || "chromium";
  const isHeadless = process.env.HEADLESS !== "false";
  const slowMo = parseInt(process.env.SLOW_MO || "0", 10);
  const viewportWidth = parseInt(process.env.VIEWPORT_WIDTH || "1280", 10);
  const viewportHeight = parseInt(process.env.VIEWPORT_HEIGHT || "720", 10);

  return {
    name: browserName,
    headless: isHeadless,
    slowMo: slowMo,
    timeout: parseInt(process.env.NAVIGATION_TIMEOUT || "30000", 10),
    viewport: {
      width: viewportWidth,
      height: viewportHeight,
    },
    args: process.env.BROWSER_ARGS ? process.env.BROWSER_ARGS.split(",") : [],
  };
};

/**
 * Screenshot options for test reports
 */
export const SCREENSHOT_CONFIG = {
  onFailure: true,
  onSuccess: false,
  path: "./test-results/screenshots",
};

/**
 * Video recording options
 */
export const VIDEO_CONFIG = {
  recordVideo: process.env.RECORD_VIDEO === "true",
  videoPath: "./test-results/videos",
};
