const BasePage = require('./BasePage');

/**
 * Login Page Object
 * Represents the login page and its interactions
 */
class LoginPage extends BasePage {
  /**
   * Constructor
   * @param {Page} page - Playwright page object
   */
  constructor(page) {
    super(page);
    
    // Locators - using data-test attributes for reliability
    this.usernameInput = '[data-test="username"]';
    this.passwordInput = '[data-test="password"]';
    this.loginButton = '[data-test="login-button"]';
    this.errorMessage = '.error-message-container';
    this.loginForm = 'form';
    this.loginContainer = '#login_button_container';
    this.loginBox = '.login-box';
  }

  /**
   * Navigate to login page
   * @param {string} baseURL - Base URL from config
   */
  async navigateToLogin(baseURL) {
    await this.navigate(baseURL);
  }

  /**
   * Enter username
   * @param {string} username - Username to enter
   */
  async enterUsername(username) {
    await this.fill(this.usernameInput, username);
  }

  /**
   * Enter password
   * @param {string} password - Password to enter
   */
  async enterPassword(password) {
    await this.fill(this.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLogin() {
    await this.click(this.loginButton);
  }

  /**
   * Complete login process
   * @param {string} username - Username
   * @param {string} password - Password
   */
  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  /**
   * Get error message text
   * @returns {Promise<string>} Error message
   */
  async getErrorMessage() {
    await this.waitForElement(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if login form is displayed
   * @returns {Promise<boolean>} True if displayed
   */
  async isLoginFormDisplayed() {
    return await this.isVisible(this.loginForm);
  }

  /**
   * Check if user is logged in by verifying URL change
   * @returns {Promise<boolean>} True if logged in
   */
  async isLoggedIn() {
    const currentUrl = await this.getCurrentUrl();
    return currentUrl.includes('inventory.html');
  }

  /**
   * Click logout button
   */
  async logout() {
    // Open menu first
    await this.click('#react-burger-menu-btn');
    await this.wait(500);
    await this.click('#logout_sidebar_link');
  }

  /**
   * Check if error message is displayed
   * @returns {Promise<boolean>} True if error is visible
   */
  async isErrorDisplayed() {
    try {
      await this.waitForElement(this.errorMessage, 3000);
      const errorText = await this.getText(this.errorMessage);
      return errorText.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Verify login page loaded
   * @returns {Promise<boolean>} True if loaded
   */
  async verifyPageLoaded() {
    await this.waitForElement(this.loginForm);
    return await this.isVisible(this.loginForm);
  }

  /**
   * Get username field value
   * @returns {Promise<string>} Username value
   */
  async getUsernameValue() {
    return await this.getAttribute(this.usernameInput, 'value');
  }

  /**
   * Clear login fields
   */
  async clearLoginFields() {
    await this.clear(this.usernameInput);
    await this.clear(this.passwordInput);
  }
}

module.exports = LoginPage;
