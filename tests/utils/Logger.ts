/**
 * Logger Utility with Colors and Icons
 * Centralized logging for better debugging and monitoring
 * Works in both local development and CI/CD pipelines (GitHub Actions, etc.)
 */

export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

// ANSI Color codes - works in GitHub Actions and most terminals
const COLORS = {
  reset: "\x1b[0m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  gray: "\x1b[90m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
};

// Icons that work in GitHub Actions and most terminals
const ICONS = {
  info: "ℹ️ ",
  warn: "⚠️ ",
  error: "❌",
  debug: "🐛",
  success: "✅",
  arrow: "→",
};

class Logger {
  private isDev = process.env.NODE_ENV !== "production";
  private isCI =
    process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";

  /**
   * Formats a log message with timestamp, level, icon, and optional data
   * Uses ANSI colors for better readability in both local and CI environments
   */
  private format(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` ${ICONS.arrow} ${JSON.stringify(data)}` : "";

    let icon = "";
    let color = COLORS.reset;

    switch (level) {
      case LogLevel.INFO:
        icon = ICONS.info;
        color = COLORS.blue;
        break;
      case LogLevel.WARN:
        icon = ICONS.warn;
        color = COLORS.yellow;
        break;
      case LogLevel.ERROR:
        icon = ICONS.error;
        color = COLORS.red;
        break;
      case LogLevel.DEBUG:
        icon = ICONS.debug;
        color = COLORS.cyan;
        break;
    }

    return `${color}${icon} [${timestamp}] [${level}]${COLORS.reset} ${message}${dataStr}`;
  }

  /**
   * Log info level message (blue)
   */
  info(message: string, data?: unknown): void {
    console.log(this.format(LogLevel.INFO, message, data));
  }

  /**
   * Log warning level message (yellow)
   */
  warn(message: string, data?: unknown): void {
    console.warn(this.format(LogLevel.WARN, message, data));
  }

  /**
   * Log error level message (red)
   */
  error(message: string, error?: Error | unknown): void {
    const errorData =
      error instanceof Error
        ? { message: error.message, stack: error.stack }
        : error;
    console.error(this.format(LogLevel.ERROR, message, errorData));
  }

  /**
   * Log debug level message (cyan) - only in development
   */
  debug(message: string, data?: unknown): void {
    if (this.isDev) {
      console.debug(this.format(LogLevel.DEBUG, message, data));
    }
  }

  /**
   * Log success message (green icon)
   */
  success(message: string, data?: unknown): void {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` ${ICONS.arrow} ${JSON.stringify(data)}` : "";
    console.log(
      `${COLORS.green}${ICONS.success} [${timestamp}]${COLORS.reset} ${message}${dataStr}`,
    );
  }

  /**
   * Log a separator line for visual organization
   */
  separator(): void {
    console.log(
      "═══════════════════════════════════════════════════════════════",
    );
  }
}

export const logger = new Logger();
