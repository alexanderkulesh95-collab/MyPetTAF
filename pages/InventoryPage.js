const BasePage = require('./BasePage');

/**
 * Inventory Page Object
 * Represents the inventory/products page and its interactions
 */
class InventoryPage extends BasePage {
  /**
   * Constructor
   * @param {Page} page - Playwright page object
   */
  constructor(page) {
    super(page);
    
    // Container locators
    this.inventoryContainer = '[data-test="inventory-container"]';
    this.inventoryList = '[data-test="inventory-list"]';
    
    // Item locators
    this.inventoryItems = '[data-test="inventory-item"]';
    this.inventoryItemName = '[data-test="inventory-item-name"]';
    this.inventoryItemDesc = '[data-test="inventory-item-desc"]';
    this.inventoryItemPrice = '[data-test="inventory-item-price"]';
    this.inventoryItemImg = '.inventory_item_img';
    
    // Product-specific locators (by item ID)
    this.productLinks = {
      backpack: {
        img: '[data-test="item-4-img-link"]',
        title: '[data-test="item-4-title-link"]',
        addToCart: '[data-test="add-to-cart-sauce-labs-backpack"]'
      },
      bikeLight: {
        img: '[data-test="item-0-img-link"]',
        title: '[data-test="item-0-title-link"]',
        addToCart: '[data-test="add-to-cart-sauce-labs-bike-light"]'
      },
      boltTShirt: {
        img: '[data-test="item-1-img-link"]',
        title: '[data-test="item-1-title-link"]',
        addToCart: '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]'
      },
      fleeceJacket: {
        img: '[data-test="item-5-img-link"]',
        title: '[data-test="item-5-title-link"]',
        addToCart: '[data-test="add-to-cart-sauce-labs-fleece-jacket"]'
      },
      onesie: {
        img: '[data-test="item-2-img-link"]',
        title: '[data-test="item-2-title-link"]',
        addToCart: '[data-test="add-to-cart-sauce-labs-onesie"]'
      },
      redTShirt: {
        img: '[data-test="item-3-img-link"]',
        title: '[data-test="item-3-title-link"]',
        addToCart: '[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]'
      }
    };
  }

  /**
   * Wait for inventory page to load
   */
  async waitForPageLoad() {
    await this.waitForElement(this.inventoryContainer);
  }

  /**
   * Check if inventory page is displayed
   * @returns {Promise<boolean>} True if inventory page is visible
   */
  async isInventoryDisplayed() {
    return await this.isVisible(this.inventoryContainer);
  }

  /**
   * Get all inventory items count
   * @returns {Promise<number>} Number of inventory items
   */
  async getInventoryItemsCount() {
    const items = await this.page.locator(this.inventoryItems).all();
    return items.length;
  }

  /**
   * Get all product names
   * @returns {Promise<string[]>} Array of product names
   */
  async getAllProductNames() {
    const names = await this.page.locator(this.inventoryItemName).allTextContents();
    return names;
  }

  /**
   * Get all product prices
   * @returns {Promise<string[]>} Array of product prices
   */
  async getAllProductPrices() {
    const prices = await this.page.locator(this.inventoryItemPrice).allTextContents();
    return prices;
  }

  /**
   * Get product name by index
   * @param {number} index - Index of the product (0-based)
   * @returns {Promise<string>} Product name
   */
  async getProductNameByIndex(index) {
    const items = await this.page.locator(this.inventoryItemName).all();
    return await items[index].textContent();
  }

  /**
   * Get product price by index
   * @param {number} index - Index of the product (0-based)
   * @returns {Promise<string>} Product price
   */
  async getProductPriceByIndex(index) {
    const items = await this.page.locator(this.inventoryItemPrice).all();
    return await items[index].textContent();
  }

  /**
   * Get product description by index
   * @param {number} index - Index of the product (0-based)
   * @returns {Promise<string>} Product description
   */
  async getProductDescriptionByIndex(index) {
    const items = await this.page.locator(this.inventoryItemDesc).all();
    return await items[index].textContent();
  }

  /**
   * Add product to cart by data-test attribute
   * @param {string} productDataTest - Product data-test identifier (e.g., 'sauce-labs-backpack')
   */
  async addToCartByDataTest(productDataTest) {
    const addButton = `[data-test="add-to-cart-${productDataTest}"]`;
    await this.click(addButton);
  }

  /**
   * Add product to cart by index
   * @param {number} index - Index of the product (0-based)
   */
  async addToCartByIndex(index) {
    const addButtons = await this.page.locator('button[data-test^="add-to-cart"]').all();
    await addButtons[index].click();
  }

  /**
   * Add Sauce Labs Backpack to cart
   */
  async addBackpackToCart() {
    await this.click(this.productLinks.backpack.addToCart);
  }

  /**
   * Add Sauce Labs Bike Light to cart
   */
  async addBikeLightToCart() {
    await this.click(this.productLinks.bikeLight.addToCart);
  }

  /**
   * Add Sauce Labs Bolt T-Shirt to cart
   */
  async addBoltTShirtToCart() {
    await this.click(this.productLinks.boltTShirt.addToCart);
  }

  /**
   * Add Sauce Labs Fleece Jacket to cart
   */
  async addFleeceJacketToCart() {
    await this.click(this.productLinks.fleeceJacket.addToCart);
  }

  /**
   * Add Sauce Labs Onesie to cart
   */
  async addOnesieToCart() {
    await this.click(this.productLinks.onesie.addToCart);
  }

  /**
   * Add Test.allTheThings() T-Shirt (Red) to cart
   */
  async addRedTShirtToCart() {
    await this.click(this.productLinks.redTShirt.addToCart);
  }

  /**
   * Click on product title by data-test attribute
   * @param {string} productDataTest - Product data-test identifier (e.g., 'item-4-title-link')
   */
  async clickProductTitle(productDataTest) {
    await this.click(`[data-test="${productDataTest}"]`);
  }

  /**
   * Click on product image by data-test attribute
   * @param {string} productDataTest - Product data-test identifier (e.g., 'item-4-img-link')
   */
  async clickProductImage(productDataTest) {
    await this.click(`[data-test="${productDataTest}"]`);
  }

  /**
   * Click on Backpack product title
   */
  async clickBackpackTitle() {
    await this.click(this.productLinks.backpack.title);
  }

  /**
   * Check if add to cart button is visible for a product
   * @param {string} productDataTest - Product data-test identifier (e.g., 'sauce-labs-backpack')
   * @returns {Promise<boolean>} True if button is visible
   */
  async isAddToCartButtonVisible(productDataTest) {
    const addButton = `[data-test="add-to-cart-${productDataTest}"]`;
    return await this.isVisible(addButton);
  }

  /**
   * Check if remove button is visible for a product (after adding to cart)
   * @param {string} productDataTest - Product data-test identifier (e.g., 'sauce-labs-backpack')
   * @returns {Promise<boolean>} True if button is visible
   */
  async isRemoveButtonVisible(productDataTest) {
    const removeButton = `[data-test="remove-${productDataTest}"]`;
    return await this.isVisible(removeButton);
  }

  /**
   * Get product details by name
   * @param {string} productName - Name of the product
   * @returns {Promise<{name: string, description: string, price: string}>} Product details
   */
  async getProductDetailsByName(productName) {
    const items = await this.page.locator(this.inventoryItems).all();
    
    for (const item of items) {
      const name = await item.locator(this.inventoryItemName).textContent();
      if (name === productName) {
        const description = await item.locator(this.inventoryItemDesc).textContent();
        const price = await item.locator(this.inventoryItemPrice).textContent();
        return { name, description, price };
      }
    }
    
    throw new Error(`Product with name "${productName}" not found`);
  }

  /**
   * Verify product exists by name
   * @param {string} productName - Name of the product
   * @returns {Promise<boolean>} True if product exists
   */
  async isProductDisplayed(productName) {
    const names = await this.getAllProductNames();
    return names.includes(productName);
  }
}

module.exports = InventoryPage;
