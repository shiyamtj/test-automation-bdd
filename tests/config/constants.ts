/**
 * Application Constants
 * Global constants used throughout the test suite
 */

export const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com';

// Timeouts (in milliseconds)
export const TIMEOUTS = {
  NAVIGATION: parseInt(process.env.NAVIGATION_TIMEOUT || '30000', 10),
  ACTION: parseInt(process.env.ACTION_TIMEOUT || '10000', 10),
  WAIT_FOR_ELEMENT: 5000,
  WAIT_FOR_TEXT: 3000,
  IMPLICIT_WAIT: 10000,
};

// Retry configurations
export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  DELAY_MS: 500,
};

// Test data
export const TEST_USERS = {
  VALID: {
    username: process.env.VALID_USERNAME || 'standard_user',
    password: process.env.VALID_PASSWORD || 'secret_sauce',
  },
  INVALID: {
    username: process.env.INVALID_USERNAME || 'invalid_user',
    password: process.env.INVALID_PASSWORD || 'wrong_password',
  },
};

// Page URLs
export const ENDPOINTS = {
  LOGIN: '/',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT: '/checkout-step-one.html',
};

// Common error messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  EMPTY_USERNAME: 'Epic sadface: Username is required',
  EMPTY_PASSWORD: 'Epic sadface: Password is required',
};
