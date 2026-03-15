/**
 * Selectors Configuration
 * Centralized UI element selectors for all pages
 * Makes it easy to update selectors when UI changes
 */

export const SELECTORS = {
  LOGIN_PAGE: {
    username: 'input[data-test="username"]',
    password: 'input[data-test="password"]',
    loginBtn: 'input[data-test="login-button"]',
    errorMsg: '[data-test="error"]',
    resetPwdLink: 'a[href*="reset_password"]',
    container: '.login_container',
  },
  
  INVENTORY_PAGE: {
    container: '.inventory_container',
    productList: '.inventory_list',
    productItem: '.inventory_item',
    productName: '.inventory_item_name',
    productPrice: '.inventory_item_price',
    addToCartBtn: 'button[data-test^="add-to-cart"]',
    cartIcon: 'a.shopping_cart_link',
    cartBadge: '.shopping_cart_badge',
    menuBtn: '#react-burger-menu-btn',
    logout: 'a#logout_sidebar_link',
  },
  
  CART_PAGE: {
    container: '.cart_container',
    cartItem: '.cart_item',
    cartQuantity: '.cart_quantity',
    checkoutBtn: '[data-test="checkout"]',
    continueShoppingBtn: '[data-test="continue-shopping"]',
  },
  
  COMMON: {
    header: '.header_secondary_container',
    footer: '.footer',
    logo: '.app_logo',
  },
};

// Export BASE_URL and other constants from constants.ts
export { BASE_URL, TIMEOUTS, TEST_USERS, ENDPOINTS, ERROR_MESSAGES } from './constants';
