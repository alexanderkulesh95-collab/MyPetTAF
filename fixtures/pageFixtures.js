const playwright = require('@playwright/test');
const base = playwright.test;
const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');
const ProductDetailsPage = require('../pages/ProductDetailsPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const CheckoutOverviewPage = require('../pages/CheckoutOverviewPage');
const { getEnvironmentConfig } = require('../config/environments');

/**
 * Custom Playwright fixtures for page objects
 * Extends the base test with custom fixtures for easier test setup
 */
const test = base.extend({
  /**
   * Login Page fixture
   * Automatically creates a LoginPage instance for each test
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  
  /**
   * Inventory Page fixture
   * Automatically creates an InventoryPage instance for each test
   */
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },
  
  /**
   * Product Details Page fixture
   * Automatically creates a ProductDetailsPage instance for each test
   */
  productDetailsPage: async ({ page }, use) => {
    const productDetailsPage = new ProductDetailsPage(page);
    await use(productDetailsPage);
  },
  
  /**
   * Cart Page fixture
   * Automatically creates a CartPage instance for each test
   */
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  
  /**
   * Checkout Page fixture
   * Automatically creates a CheckoutPage instance for each test
   */
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
  
  /**
   * Checkout Overview Page fixture
   * Automatically creates a CheckoutOverviewPage instance for each test
   */
  checkoutOverviewPage: async ({ page }, use) => {
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    await use(checkoutOverviewPage);
  },
  
  /**
   * Authenticated Page fixture
   * Automatically logs in the user before the test starts
   * Use this fixture when you need a logged-in state
   */
  authenticatedPage: async ({ page }, use) => {
    const env = process.env.ENV || 'demo';
    const config = getEnvironmentConfig(env);
    const loginPage = new LoginPage(page);
    
    // Navigate to login page and authenticate
    await loginPage.navigateToLogin(config.baseURL);
    await loginPage.login(config.username, config.password);
    
    // Wait for successful login
    await page.waitForURL('**/inventory.html', { timeout: 10000 });
    
    await use(page);
  }
});

module.exports = { test };
