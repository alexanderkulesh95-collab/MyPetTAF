const BasePage = require('./BasePage');

/**
 * Checkout Page Object
 * Represents the checkout page and its interactions
 */
class CheckoutPage extends BasePage {
  /**
   * Constructor
   * @param {Page} page - Playwright page object
   */
  constructor(page) {
    super(page);
    
    // Container locators
    this.checkoutInfoContainer = '[data-test="checkout-info-container"]';
    
    // Header locators
    this.pageTitle = '[data-test="title"]';
    
    // Form field locators
    this.firstNameInput = '[data-test="firstName"]';
    this.lastNameInput = '[data-test="lastName"]';
    this.postalCodeInput = '[data-test="postalCode"]';
    
    // Button locators
    this.cancelButton = '[data-test="cancel"]';
    this.continueButton = '[data-test="continue"]';
  }

  /**
   * Wait for checkout page to load
   */
  async waitForPageLoad() {
    await this.waitForElement(this.checkoutInfoContainer);
  }

  /**
   * Check if checkout page is displayed
   * @returns {Promise<boolean>} True if checkout page is visible
   */
  async isCheckoutPageDisplayed() {
    return await this.isVisible(this.checkoutInfoContainer);
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
   * Check if first name input is visible
   * @returns {Promise<boolean>} True if input is visible
   */
  async isFirstNameInputVisible() {
    return await this.isVisible(this.firstNameInput);
  }

  /**
   * Check if last name input is visible
   * @returns {Promise<boolean>} True if input is visible
   */
  async isLastNameInputVisible() {
    return await this.isVisible(this.lastNameInput);
  }

  /**
   * Check if postal code input is visible
   * @returns {Promise<boolean>} True if input is visible
   */
  async isPostalCodeInputVisible() {
    return await this.isVisible(this.postalCodeInput);
  }

  /**
   * Fill first name field
   * @param {string} firstName - First name value
   */
  async fillFirstName(firstName) {
    await this.fill(this.firstNameInput, firstName);
  }

  /**
   * Fill last name field
   * @param {string} lastName - Last name value
   */
  async fillLastName(lastName) {
    await this.fill(this.lastNameInput, lastName);
  }

  /**
   * Fill postal code field
   * @param {string} postalCode - Postal code value
   */
  async fillPostalCode(postalCode) {
    await this.fill(this.postalCodeInput, postalCode);
  }

  /**
   * Click continue button
   */
  async clickContinue() {
    await this.click(this.continueButton);
  }

  /**
   * Click cancel button
   */
  async clickCancel() {
    await this.click(this.cancelButton);
  }

  /**
   * Fill checkout information form
   * @param {string} firstName - First name
   * @param {string} lastName - Last name
   * @param {string} postalCode - Postal code
   */
  async fillCheckoutForm(firstName, lastName, postalCode) {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillPostalCode(postalCode);
  }
}

module.exports = CheckoutPage;
