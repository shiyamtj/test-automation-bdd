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
  grey: "\x1b[90m",
};

class Logger {
  private isDev = process.env.NODE_ENV !== "production";
  private isCI =
    process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";

  /**
   * Formats a log message with timestamp, level, and optional data
   * Uses ANSI colors for better readability in both local and CI environments
   */
  private format(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` ${JSON.stringify(data)}` : "";
    let color = COLORS.reset;
    switch (level) {
      case LogLevel.INFO:
        color = COLORS.grey;
        break;
      case LogLevel.WARN:
        color = COLORS.yellow;
        break;
      case LogLevel.ERROR:
        color = COLORS.red;
        break;
      case LogLevel.DEBUG:
        color = COLORS.grey;
        break;
    }
    return `${color}[${timestamp}] [${level}]${COLORS.reset} ${message}${dataStr}`;
  }

  /** Log info level message */
  info(message: string, data?: unknown): void {
    console.log(this.format(LogLevel.INFO, message, data));
  }

  /** Log warning level message */
  warn(message: string, data?: unknown): void {
    console.warn(this.format(LogLevel.WARN, message, data));
  }

  /** Log error level message */
  error(message: string, error?: Error | unknown): void {
    const errorData =
      error instanceof Error
        ? { message: error.message, stack: error.stack }
        : error;
    console.error(this.format(LogLevel.ERROR, message, errorData));
  }

  /** Log debug level message - only in development */
  debug(message: string, data?: unknown): void {
    if (this.isDev) {
      console.debug(this.format(LogLevel.DEBUG, message, data));
    }
  }

  /** Log success message (green) */
  success(message: string, data?: unknown): void {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` ${JSON.stringify(data)}` : "";
    console.log(
      `${COLORS.green}[${timestamp}]${COLORS.reset} ${message}${dataStr}`,
    );
  }

  /** Log data message (yellow) */
  data(message: string, data?: unknown): void {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` ${JSON.stringify(data)}` : "";
    console.log(
      `${COLORS.yellow}[${timestamp}]${COLORS.reset} ${message}${dataStr}`,
    );
  }

  /** Log stats message */
  stat(message: string, data?: unknown): void {
    const dataStr = data ? ` ${JSON.stringify(data)}` : "";
    console.log(`${COLORS.cyan} ${message} ${COLORS.reset}${dataStr}`);
  }

  /** Log a separator line for visual organization */
  separator(): void {
    console.log(`${COLORS.cyan}${"-".repeat(100)}${COLORS.reset}`);
  }
}

export const logger = new Logger();
