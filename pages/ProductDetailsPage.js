const BasePage = require('./BasePage');

/**
 * Product Details Page Object
 * Represents the product details page and its interactions
 */
class ProductDetailsPage extends BasePage {
  /**
   * Constructor
   * @param {Page} page
   */
  constructor(page) {
    super(page);
    
    // Container locators
    this.inventoryItemContainer = '[data-test="inventory-container"]';
    this.inventoryDetailsContainer = '[data-test="inventory-item"]';
    
    // Product detail locators
    this.productImage = '.inventory_details_img';
    this.productName = '[data-test="inventory-item-name"]';
    this.productDescription = '[data-test="inventory-item-desc"]';
    this.productPrice = '[data-test="inventory-item-price"]';
    
    // Action buttons
    this.addToCartButton = '[data-test="add-to-cart"]';
    this.removeButton = '[data-test="remove"]';
    this.backToProductsButton = '[data-test="back-to-products"]';
    
    // Product-specific image locators (by product name)
    this.productImages = {
      'Sauce Labs Backpack': '[data-test="item-sauce-labs-backpack-img"]',
      'Sauce Labs Bike Light': '[data-test="item-sauce-labs-bike-light-img"]',
      'Sauce Labs Bolt T-Shirt': '[data-test="item-sauce-labs-bolt-t-shirt-img"]',
      'Sauce Labs Fleece Jacket': '[data-test="item-sauce-labs-fleece-jacket-img"]',
      'Sauce Labs Onesie': '[data-test="item-sauce-labs-onesie-img"]',
      'Test.allTheThings() T-Shirt (Red)': '[data-test="item-test.allthethings()-t-shirt-(red)-img"]'
    };
    
    // Product mapping for navigation (product name to item ID)
    this.productIds = {
      'Sauce Labs Backpack': 4,
      'Sauce Labs Bike Light': 0,
      'Sauce Labs Bolt T-Shirt': 1,
      'Sauce Labs Fleece Jacket': 5,
      'Sauce Labs Onesie': 2,
      'Test.allTheThings() T-Shirt (Red)': 3
    };
  }

  /**
   * Navigate to product details page by product name
   * @param {string} baseURL - Base URL from config
   * @param {string} productName - Name of the product
   */
  async navigateToProductDetails(baseURL, productName) {
    const productId = this.productIds[productName];
    if (productId === undefined) {
      throw new Error(`Product "${productName}" not found in product mapping`);
    }
    await this.navigate(`${baseURL}/inventory-item.html?id=${productId}`);
  }

  /**
   * Wait for product details page to load
   */
  async waitForPageLoad() {
    await this.waitForElement(this.inventoryItemContainer);
    await this.waitForElement(this.inventoryDetailsContainer);
  }

  /**
   * Check if product details page is displayed
   * @returns {Promise<boolean>} True if product details page is visible
   */
  async isProductDetailsDisplayed() {
    return await this.isVisible(this.inventoryDetailsContainer);
  }

  /**
   * Check if product name is displayed
   * @returns {Promise<boolean>} True if product name is visible
   */
  async isProductNameDisplayed() {
    return await this.isVisible(this.productName);
  }

  /**
   * Get product name
   * @returns {Promise<string>} Product name
   */
  async getProductName() {
    return await this.getText(this.productName);
  }

  /**
   * Get product description
   * @returns {Promise<string>} Product description
   */
  async getProductDescription() {
    return await this.getText(this.productDescription);
  }

  /**
   * Get product price
   * @returns {Promise<string>} Product price
   */
  async getProductPrice() {
    return await this.getText(this.productPrice);
  }

  /**
   * Check if product image is displayed
   * @returns {Promise<boolean>} True if image is visible
   */
  async isProductImageDisplayed() {
    return await this.isVisible(this.productImage);
  }

  /**
   * Get product image for specific product by name
   * @param {string} productName - Name of the product
   * @returns {Promise<boolean>} True if specific product image is visible
   */
  async isSpecificProductImageDisplayed(productName) {
    const imageSelector = this.productImages[productName];
    if (!imageSelector) {
      throw new Error(`Product image selector for "${productName}" not found`);
    }
    return await this.isVisible(imageSelector);
  }

  /**
   * Check if Add to Cart button is visible
   * @returns {Promise<boolean>} True if button is visible
   */
  async isAddToCartButtonVisible() {
    return await this.isVisible(this.addToCartButton);
  }

  /**
   * Check if Remove button is visible
   * @returns {Promise<boolean>} True if button is visible
   */
  async isRemoveButtonVisible() {
    return await this.isVisible(this.removeButton);
  }

  /**
   * Add product to cart
   */
  async addToCart() {
    await this.click(this.addToCartButton);
  }

  /**
   * Navigate back to products page
   */
  async navigateBackToProducts() {
    await this.click(this.backToProductsButton);
  }

  /**
   * Get all product details
   * @returns {Promise<Object>} Object containing name, description, and price
   */
  async getProductDetails() {
    return {
      name: await this.getProductName(),
      description: await this.getProductDescription(),
      price: await this.getProductPrice()
    };
  }

  /**
   * Verify product details match expected values
   * @param {string} expectedName - Expected product name
   * @param {string} expectedDescription - Expected product description
   * @param {string} expectedPrice - Expected product price
   * @returns {Promise<boolean>} True if all details match
   */
  async verifyProductDetails(expectedName, expectedDescription, expectedPrice) {
    const actualName = await this.getProductName();
    const actualDescription = await this.getProductDescription();
    const actualPrice = await this.getProductPrice();
    
    return actualName === expectedName && 
           actualDescription === expectedDescription && 
           actualPrice === expectedPrice;
  }

  /**
   * Add product to cart by product name
   * Complete flow: navigate to product details and add to cart
   * @param {string} baseURL - Base URL from config
   * @param {string} productName - Name of the product
   */
  async addProductToCartByName(baseURL, productName) {
    await this.navigateToProductDetails(baseURL, productName);
    await this.waitForPageLoad();
    await this.addToCart();
  }

  /**
   * Check if back to products button is visible
   * @returns {Promise<boolean>} True if button is visible
   */
  async isBackButtonVisible() {
    return await this.isVisible(this.backToProductsButton);
  }
}

module.exports = ProductDetailsPage;
