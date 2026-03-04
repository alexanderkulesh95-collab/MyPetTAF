const BasePage = require('./BasePage');

/**
 * Cart Page Object
 * Represents the shopping cart page and its interactions
 */
class CartPage extends BasePage {
  /**
   * Constructor
   * @param {Page} page - Playwright page object
   */
  constructor(page) {
    super(page);
    
    // Container locators
    this.cartContentsContainer = '[data-test="cart-contents-container"]';
    this.cartList = '[data-test="cart-list"]';
    
    // Header locators
    this.pageTitle = '[data-test="title"]';
    
    // Cart item locators
    this.cartItems = '[data-test="inventory-item"]';
    this.cartQuantityLabel = '[data-test="cart-quantity-label"]';
    this.cartDescLabel = '[data-test="cart-desc-label"]';
    this.cartItemName = '[data-test="inventory-item-name"]';
    this.cartItemDesc = '[data-test="inventory-item-desc"]';
    this.cartItemPrice = '[data-test="inventory-item-price"]';
    this.cartQuantity = '.cart_quantity';
    
    // Button locators
    this.continueShoppingButton = '[data-test="continue-shopping"]';
    this.checkoutButton = '[data-test="checkout"]';
  }

  /**
   * Wait for cart page to load
   */
  async waitForPageLoad() {
    await this.waitForElement(this.cartContentsContainer);
  }

  /**
   * Check if cart page is displayed
   * @returns {Promise<boolean>} True if cart page is visible
   */
  async isCartPageDisplayed() {
    return await this.isVisible(this.cartContentsContainer);
  }

  /**
   * Get page title text
   * @returns {Promise<string>} Page title text
   */
  async getPageTitle() {
    return await this.getText(this.pageTitle);
  }

  /**
   * Check if page title is displayed
   * @returns {Promise<boolean>} True if title is visible
   */
  async isPageTitleDisplayed() {
    return await this.isVisible(this.pageTitle);
  }

  /**
   * Verify page title is "Your Cart"
   * @returns {Promise<boolean>} True if title matches
   */
  async isYourCartTitleDisplayed() {
    const title = await this.getPageTitle();
    return title === 'Your Cart';
  }

  /**
   * Click continue shopping button
   */
  async clickContinueShopping() {
    await this.click(this.continueShoppingButton);
  }

  /**
   * Check if continue shopping button is visible
   * @returns {Promise<boolean>} True if button is visible
   */
  async isContinueShoppingButtonVisible() {
    return await this.isVisible(this.continueShoppingButton);
  }

  /**
   * Check if checkout button is visible
   * @returns {Promise<boolean>} True if button is visible
   */
  async isCheckoutButtonVisible() {
    return await this.isVisible(this.checkoutButton);
  }

  /**
   * Click checkout button
   */
  async clickCheckout() {
    await this.click(this.checkoutButton);
  }

  /**
   * Get cart items count
   * @returns {Promise<number>} Number of items in cart
   */
  async getCartItemsCount() {
    const items = await this.page.locator(this.cartItems).all();
    return items.length;
  }

  /**
   * Check if cart is empty
   * @returns {Promise<boolean>} True if cart has no items
   */
  async isCartEmpty() {
    const count = await this.getCartItemsCount();
    return count === 0;
  }

  /**
   * Navigate back to inventory/products page
   */
  async navigateBackToProducts() {
    await this.clickContinueShopping();
  }

  /**
   * Get product details from cart by index
   * @param {number} index - Index of the product in cart (0-based)
   * @returns {Promise<{name: string, description: string, price: string, quantity: string}>} Product details
   */
  async getCartProductDetailsByIndex(index) {
    const items = await this.page.locator(this.cartItems).all();
    if (index >= items.length) {
      throw new Error(`Product at index ${index} not found in cart`);
    }
    
    const item = items[index];
    const name = await item.locator(this.cartItemName).textContent();
    const description = await item.locator(this.cartItemDesc).textContent();
    const price = await item.locator(this.cartItemPrice).textContent();
    const quantity = await item.locator(this.cartQuantity).textContent();
    
    return { name, description, price, quantity };
  }

  /**
   * Get product details from cart by product name
   * @param {string} productName - Name of the product
   * @returns {Promise<{name: string, description: string, price: string, quantity: string}>} Product details
   */
  async getCartProductDetailsByName(productName) {
    const items = await this.page.locator(this.cartItems).all();
    
    for (const item of items) {
      const name = await item.locator(this.cartItemName).textContent();
      if (name === productName) {
        const description = await item.locator(this.cartItemDesc).textContent();
        const price = await item.locator(this.cartItemPrice).textContent();
        const quantity = await item.locator(this.cartQuantity).textContent();
        return { name, description, price, quantity };
      }
    }
    
    throw new Error(`Product "${productName}" not found in cart`);
  }

  /**
   * Get all product names in cart
   * @returns {Promise<string[]>} Array of product names
   */
  async getAllCartProductNames() {
    const names = await this.page.locator(this.cartItems).locator(this.cartItemName).allTextContents();
    return names;
  }

  /**
   * Verify product exists in cart
   * @param {string} productName - Name of the product
   * @returns {Promise<boolean>} True if product is in cart
   */
  async isProductInCart(productName) {
    const names = await this.getAllCartProductNames();
    return names.includes(productName);
  }

  /**
   * Check if quantity label is displayed
   * @returns {Promise<boolean>} True if quantity label is visible
   */
  async isQuantityLabelDisplayed() {
    return await this.isVisible(this.cartQuantityLabel);
  }

  /**
   * Check if description label is displayed
   * @returns {Promise<boolean>} True if description label is visible
   */
  async isDescriptionLabelDisplayed() {
    return await this.isVisible(this.cartDescLabel);
  }

  /**
   * Remove product from cart by product name
   * @param {string} productName - Name of the product to remove
   */
  async removeProductFromCart(productName) {
    const items = await this.page.locator(this.cartItems).all();
    
    for (const item of items) {
      const name = await item.locator(this.cartItemName).textContent();
      if (name === productName) {
        const removeButton = item.locator('button[data-test^="remove"]');
        await removeButton.click();
        return;
      }
    }
    
    throw new Error(`Product "${productName}" not found in cart`);
  }

  /**
   * Remove product from cart by index
   * @param {number} index - Index of the product in cart (0-based)
   */
  async removeProductFromCartByIndex(index) {
    const items = await this.page.locator(this.cartItems).all();
    if (index >= items.length) {
      throw new Error(`Product at index ${index} not found in cart`);
    }
    
    const removeButton = items[index].locator('button[data-test^="remove"]');
    await removeButton.click();
  }
}

module.exports = CartPage;
