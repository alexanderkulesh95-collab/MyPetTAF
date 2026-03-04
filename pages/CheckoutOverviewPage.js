const BasePage = require('./BasePage');

/**
 * Checkout Overview Page Object
 * Represents the checkout overview/summary page and its interactions
 */
class CheckoutOverviewPage extends BasePage {
  /**
   * Constructor
   * @param {Page} page - Playwright page object
   */
  constructor(page) {
    super(page);
    
    // Container locators
    this.checkoutSummaryContainer = '[data-test="checkout-summary-container"]';
    this.cartList = '[data-test="cart-list"]';
    
    // Header locators
    this.pageTitle = '[data-test="title"]';
    
    // Cart item locators
    this.cartItems = '[data-test="inventory-item"]';
    this.cartQuantityLabel = '[data-test="cart-quantity-label"]';
    this.cartDescLabel = '[data-test="cart-desc-label"]';
    this.itemQuantity = '[data-test="item-quantity"]';
    this.itemName = '[data-test="inventory-item-name"]';
    this.itemDesc = '[data-test="inventory-item-desc"]';
    this.itemPrice = '[data-test="inventory-item-price"]';
    
    // Summary info locators
    this.paymentInfoLabel = '[data-test="payment-info-label"]';
    this.paymentInfoValue = '[data-test="payment-info-value"]';
    this.shippingInfoLabel = '[data-test="shipping-info-label"]';
    this.shippingInfoValue = '[data-test="shipping-info-value"]';
    this.totalInfoLabel = '[data-test="total-info-label"]';
    this.subtotalLabel = '[data-test="subtotal-label"]';
    this.taxLabel = '[data-test="tax-label"]';
    this.totalLabel = '[data-test="total-label"]';
    
    // Button locators
    this.cancelButton = '[data-test="cancel"]';
    this.finishButton = '[data-test="finish"]';
  }

  /**
   * Wait for checkout overview page to load
   */
  async waitForPageLoad() {
    await this.waitForElement(this.checkoutSummaryContainer);
  }

  /**
   * Check if checkout overview page is displayed
   * @returns {Promise<boolean>} True if checkout overview page is visible
   */
  async isCheckoutOverviewPageDisplayed() {
    return await this.isVisible(this.checkoutSummaryContainer);
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
   * Check if cart quantity label is displayed
   * @returns {Promise<boolean>} True if label is visible
   */
  async isQuantityLabelDisplayed() {
    return await this.isVisible(this.cartQuantityLabel);
  }

  /**
   * Check if cart description label is displayed
   * @returns {Promise<boolean>} True if label is visible
   */
  async isDescriptionLabelDisplayed() {
    return await this.isVisible(this.cartDescLabel);
  }

  /**
   * Get count of items in checkout overview
   * @returns {Promise<number>} Number of items
   */
  async getItemCount() {
    return await this.getElementCount(this.cartItems);
  }

  /**
   * Get item details by index
   * @param {number} index - Item index (0-based)
   * @returns {Promise<Object>} Object containing name, description, price, quantity
   */
  async getItemDetailsByIndex(index) {
    const items = await this.page.$$(this.cartItems);
    if (index >= items.length) {
      throw new Error(`Item index ${index} out of range. Total items: ${items.length}`);
    }
    
    const item = items[index];
    const name = await item.$eval(this.itemName, el => el.textContent.trim());
    const description = await item.$eval(this.itemDesc, el => el.textContent.trim());
    const price = await item.$eval(this.itemPrice, el => el.textContent.trim());
    const quantity = await item.$eval(this.itemQuantity, el => el.textContent.trim());
    
    return { name, description, price, quantity };
  }

  /**
   * Check if payment info is displayed
   * @returns {Promise<boolean>} True if payment info is visible
   */
  async isPaymentInfoDisplayed() {
    return await this.isVisible(this.paymentInfoLabel);
  }

  /**
   * Get payment info value
   * @returns {Promise<string>} Payment info text
   */
  async getPaymentInfoValue() {
    return await this.getText(this.paymentInfoValue);
  }

  /**
   * Check if shipping info is displayed
   * @returns {Promise<boolean>} True if shipping info is visible
   */
  async isShippingInfoDisplayed() {
    return await this.isVisible(this.shippingInfoLabel);
  }

  /**
   * Get shipping info value
   * @returns {Promise<string>} Shipping info text
   */
  async getShippingInfoValue() {
    return await this.getText(this.shippingInfoValue);
  }

  /**
   * Check if price total info is displayed
   * @returns {Promise<boolean>} True if total info is visible
   */
  async isTotalInfoDisplayed() {
    return await this.isVisible(this.totalInfoLabel);
  }

  /**
   * Get subtotal value
   * @returns {Promise<string>} Subtotal text (e.g., "Item total: $29.99")
   */
  async getSubtotal() {
    return await this.getText(this.subtotalLabel);
  }

  /**
   * Get subtotal amount as number
   * @returns {Promise<number>} Subtotal amount
   */
  async getSubtotalAmount() {
    const subtotalText = await this.getSubtotal();
    const match = subtotalText.match(/\$(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get tax value
   * @returns {Promise<string>} Tax text (e.g., "Tax: $2.40")
   */
  async getTax() {
    return await this.getText(this.taxLabel);
  }

  /**
   * Get tax amount as number
   * @returns {Promise<number>} Tax amount
   */
  async getTaxAmount() {
    const taxText = await this.getTax();
    const match = taxText.match(/\$(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get total value
   * @returns {Promise<string>} Total text (e.g., "Total: $32.39")
   */
  async getTotal() {
    return await this.getText(this.totalLabel);
  }

  /**
   * Get total amount as number
   * @returns {Promise<number>} Total amount
   */
  async getTotalAmount() {
    const totalText = await this.getTotal();
    const match = totalText.match(/\$(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Check if cancel button is visible
   * @returns {Promise<boolean>} True if cancel button is visible
   */
  async isCancelButtonVisible() {
    return await this.isVisible(this.cancelButton);
  }

  /**
   * Check if finish button is visible
   * @returns {Promise<boolean>} True if finish button is visible
   */
  async isFinishButtonVisible() {
    return await this.isVisible(this.finishButton);
  }

  /**
   * Click cancel button
   */
  async clickCancel() {
    await this.click(this.cancelButton);
  }

  /**
   * Click finish button
   */
  async clickFinish() {
    await this.click(this.finishButton);
  }

  /**
   * Verify price calculation (subtotal + tax = total)
   * @returns {Promise<boolean>} True if calculation is correct
   */
  async verifyPriceCalculation() {
    const subtotal = await this.getSubtotalAmount();
    const tax = await this.getTaxAmount();
    const total = await this.getTotalAmount();
    
    const calculatedTotal = Math.round((subtotal + tax) * 100) / 100;
    return calculatedTotal === total;
  }
}

module.exports = CheckoutOverviewPage;
