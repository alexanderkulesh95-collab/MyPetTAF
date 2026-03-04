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
    
    // Sorting locators
    this.sortDropdown = '[data-test="product-sort-container"]';
    this.activeOption = '[data-test="active-option"]';
    
    // Cart locators
    this.shoppingCartBadge = '.shopping_cart_badge';
    this.shoppingCartLink = '[data-test="shopping-cart-link"]';
    
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
   * Remove product from cart by index
   * @param {number} index - Index of the product (0-based)
   */
  async removeFromCartByIndex(index) {
    const removeButtons = await this.page.locator('button[data-test^="remove"]').all();
    await removeButtons[index].click();
  }

  /**
   * Remove product from cart by product name
   * @param {string} productName - Name of the product
   */
  async removeFromCartByName(productName) {
    const items = await this.page.locator(this.inventoryItems).all();
    
    for (const item of items) {
      const name = await item.locator(this.inventoryItemName).textContent();
      if (name === productName) {
        const removeButton = item.locator('button[data-test^="remove"]');
        await removeButton.click();
        return;
      }
    }
    
    throw new Error(`Product with name "${productName}" not found or not in cart`);
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
   * @param {string} productName - Product name (e.g., 'Sauce Labs Backpack')
   */
  async clickProductTitle(productName) {
    const items = await this.page.locator(this.inventoryItems).all();
    
    for (const item of items) {
      const name = await item.locator(this.inventoryItemName).textContent();
      if (name === productName) {
        await item.locator(this.inventoryItemName).click();
        return;
      }
    }
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

  /**
   * Get the currently active sort option text
   * @returns {Promise<string>} Currently active sort option
   */
  async getActiveSortOption() {
    return await this.getText(this.activeOption);
  }

  /**
   * Select a sort option from the dropdown
   * @param {string} sortValue - Sort value ('az', 'za', 'lohi', 'hilo')
   */
  async selectSortOption(sortValue) {
    await this.page.locator(this.sortDropdown).selectOption(sortValue);
  }

  /**
   * Sort products by Name (A to Z)
   */
  async sortByNameAtoZ() {
    await this.selectSortOption('az');
  }

  /**
   * Sort products by Name (Z to A)
   */
  async sortByNameZtoA() {
    await this.selectSortOption('za');
  }

  /**
   * Sort products by Price (low to high)
   */
  async sortByPriceLowToHigh() {
    await this.selectSortOption('lohi');
  }

  /**
   * Sort products by Price (high to low)
   */
  async sortByPriceHighToLow() {
    await this.selectSortOption('hilo');
  }

  /**
   * Verify if products are sorted by name A to Z
   * @returns {Promise<boolean>} True if sorted correctly
   */
  async isSortedByNameAtoZ() {
    const names = await this.getAllProductNames();
    const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
    return JSON.stringify(names) === JSON.stringify(sortedNames);
  }

  /**
   * Verify if products are sorted by name Z to A
   * @returns {Promise<boolean>} True if sorted correctly
   */
  async isSortedByNameZtoA() {
    const names = await this.getAllProductNames();
    const sortedNames = [...names].sort((a, b) => b.localeCompare(a));
    return JSON.stringify(names) === JSON.stringify(sortedNames);
  }

  /**
   * Verify if products are sorted by price low to high
   * @returns {Promise<boolean>} True if sorted correctly
   */
  async isSortedByPriceLowToHigh() {
    const prices = await this.getAllProductPrices();
    const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
    const sortedPrices = [...numericPrices].sort((a, b) => a - b);
    return JSON.stringify(numericPrices) === JSON.stringify(sortedPrices);
  }

  /**
   * Verify if products are sorted by price high to low
   * @returns {Promise<boolean>} True if sorted correctly
   */
  async isSortedByPriceHighToLow() {
    const prices = await this.getAllProductPrices();
    const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
    const sortedPrices = [...numericPrices].sort((a, b) => b - a);
    return JSON.stringify(numericPrices) === JSON.stringify(sortedPrices);
  }

  /**
   * Check if sort dropdown is visible
   * @returns {Promise<boolean>} True if dropdown is visible
   */
  async isSortDropdownVisible() {
    return await this.isVisible(this.sortDropdown);
  }

  /**
   * Get shopping cart badge count
   * @returns {Promise<number>} Cart item count (0 if badge not visible)
   */
  async getCartBadgeCount() {
    const isBadgeVisible = await this.isVisible(this.shoppingCartBadge);
    if (!isBadgeVisible) {
      return 0;
    }
    const badgeText = await this.getText(this.shoppingCartBadge);
    return parseInt(badgeText, 10);
  }

  /**
   * Check if cart badge is visible
   * @returns {Promise<boolean>} True if badge is visible
   */
  async isCartBadgeVisible() {
    return await this.isVisible(this.shoppingCartBadge);
  }

  /**
   * Get button text for a product by index
   * @param {number} index - Index of the product (0-based)
   * @returns {Promise<string>} Button text
   */
  async getProductButtonTextByIndex(index) {
    const buttons = await this.page.locator('button[data-test^="add-to-cart"], button[data-test^="remove"]').all();
    return await buttons[index].textContent();
  }

  /**
   * Get button text for a specific product
   * @param {string} productName - Name of the product
   * @returns {Promise<string>} Button text ('Add to cart' or 'Remove')
   */
  async getProductButtonText(productName) {
    const items = await this.page.locator(this.inventoryItems).all();
    
    for (const item of items) {
      const name = await item.locator(this.inventoryItemName).textContent();
      if (name === productName) {
        const button = item.locator('button[data-test^="add-to-cart"], button[data-test^="remove"]');
        return await button.textContent();
      }
    }
    
    throw new Error(`Product with name "${productName}" not found`);
  }

  /**
   * Click shopping cart icon to navigate to cart page
   */
  async clickCartIcon() {
    await this.click(this.shoppingCartLink);
  }
}

module.exports = InventoryPage;
