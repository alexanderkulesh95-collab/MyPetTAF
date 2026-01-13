const logger = require('../utils/logger');

/**
 * Base Page Object class
 * All page objects should extend this class
 */
class BasePage {
  /**
   * Constructor
   * @param {Page} page - Playwright page object
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a URL
   * @param {string} url - URL to navigate to
   */
  async navigate(url) {
    logger.step(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Get page title
   * @returns {Promise<string>} Page title
   */
  async getTitle() {
    const title = await this.page.title();
    logger.info(`Page title: ${title}`);
    return title;
  }

  /**
   * Get current URL
   * @returns {Promise<string>} Current URL
   */
  async getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Click element
   * @param {string} selector - Element selector
   */
  async click(selector) {
    logger.step(`Clicking element: ${selector}`);
    await this.page.click(selector);
  }

  /**
   * Fill input field
   * @param {string} selector - Element selector
   * @param {string} text - Text to fill
   */
  async fill(selector, text) {
    logger.step(`Filling element ${selector} with: ${text}`);
    await this.page.fill(selector, text);
  }

  /**
   * Type text with delay
   * @param {string} selector - Element selector
   * @param {string} text - Text to type
   * @param {number} delay - Delay between keystrokes in ms
   */
  async type(selector, text, delay = 50) {
    logger.step(`Typing into element ${selector}: ${text}`);
    await this.page.type(selector, text, { delay });
  }

  /**
   * Get element text
   * @param {string} selector - Element selector
   * @returns {Promise<string>} Element text content
   */
  async getText(selector) {
    const text = await this.page.textContent(selector);
    logger.info(`Text from ${selector}: ${text}`);
    return text;
  }

  /**
   * Get element attribute
   * @param {string} selector - Element selector
   * @param {string} attribute - Attribute name
   * @returns {Promise<string>} Attribute value
   */
  async getAttribute(selector, attribute) {
    return await this.page.getAttribute(selector, attribute);
  }

  /**
   * Check if element is visible
   * @param {string} selector - Element selector
   * @returns {Promise<boolean>} True if visible
   */
  async isVisible(selector) {
    return await this.page.isVisible(selector);
  }

  /**
   * Check if element is enabled
   * @param {string} selector - Element selector
   * @returns {Promise<boolean>} True if enabled
   */
  async isEnabled(selector) {
    return await this.page.isEnabled(selector);
  }

  /**
   * Check if element is checked
   * @param {string} selector - Element selector
   * @returns {Promise<boolean>} True if checked
   */
  async isChecked(selector) {
    return await this.page.isChecked(selector);
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElement(selector, timeout = 30000) {
    logger.step(`Waiting for element: ${selector}`);
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElementHidden(selector, timeout = 30000) {
    logger.step(`Waiting for element to be hidden: ${selector}`);
    await this.page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation() {
    logger.step('Waiting for navigation');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Select option from dropdown
   * @param {string} selector - Dropdown selector
   * @param {string} value - Option value to select
   */
  async selectOption(selector, value) {
    logger.step(`Selecting option ${value} from ${selector}`);
    await this.page.selectOption(selector, value);
  }

  /**
   * Check checkbox or radio button
   * @param {string} selector - Element selector
   */
  async check(selector) {
    logger.step(`Checking element: ${selector}`);
    await this.page.check(selector);
  }

  /**
   * Uncheck checkbox
   * @param {string} selector - Element selector
   */
  async uncheck(selector) {
    logger.step(`Unchecking element: ${selector}`);
    await this.page.uncheck(selector);
  }

  /**
   * Hover over element
   * @param {string} selector - Element selector
   */
  async hover(selector) {
    logger.step(`Hovering over element: ${selector}`);
    await this.page.hover(selector);
  }

  /**
   * Take screenshot
   * @param {string} filename - Screenshot filename
   */
  async takeScreenshot(filename) {
    logger.info(`Taking screenshot: ${filename}`);
    await this.page.screenshot({ path: `screenshots/${filename}`, fullPage: true });
  }

  /**
   * Scroll to element
   * @param {string} selector - Element selector
   */
  async scrollToElement(selector) {
    logger.step(`Scrolling to element: ${selector}`);
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Get element count
   * @param {string} selector - Element selector
   * @returns {Promise<number>} Number of matching elements
   */
  async getElementCount(selector) {
    return await this.page.locator(selector).count();
  }

  /**
   * Press key
   * @param {string} key - Key to press
   */
  async pressKey(key) {
    logger.step(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  /**
   * Reload page
   */
  async reload() {
    logger.step('Reloading page');
    await this.page.reload();
  }

  /**
   * Go back in browser history
   */
  async goBack() {
    logger.step('Going back');
    await this.page.goBack();
  }

  /**
   * Go forward in browser history
   */
  async goForward() {
    logger.step('Going forward');
    await this.page.goForward();
  }

  /**
   * Execute JavaScript in browser context
   * @param {string} script - JavaScript code to execute
   * @returns {Promise<*>} Return value from script
   */
  async executeScript(script) {
    return await this.page.evaluate(script);
  }

  /**
   * Wait for timeout
   * @param {number} milliseconds - Time to wait in ms
   */
  async wait(milliseconds) {
    logger.step(`Waiting for ${milliseconds}ms`);
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Handle dialog (alert, confirm, prompt)
   * @param {boolean} accept - Accept or dismiss dialog
   * @param {string} promptText - Text for prompt dialog
   */
  async handleDialog(accept = true, promptText = '') {
    this.page.on('dialog', async (dialog) => {
      logger.info(`Dialog detected: ${dialog.message()}`);
      if (accept) {
        await dialog.accept(promptText);
      } else {
        await dialog.dismiss();
      }
    });
  }

  /**
   * Get all elements matching selector
   * @param {string} selector - Element selector
   * @returns {Promise<Array>} Array of elements
   */
  async getAllElements(selector) {
    return await this.page.locator(selector).all();
  }

  /**
   * Drag and drop
   * @param {string} sourceSelector - Source element selector
   * @param {string} targetSelector - Target element selector
   */
  async dragAndDrop(sourceSelector, targetSelector) {
    logger.step(`Dragging ${sourceSelector} to ${targetSelector}`);
    await this.page.dragAndDrop(sourceSelector, targetSelector);
  }

  /**
   * Upload file
   * @param {string} selector - File input selector
   * @param {string} filePath - Path to file
   */
  async uploadFile(selector, filePath) {
    logger.step(`Uploading file to ${selector}: ${filePath}`);
    await this.page.setInputFiles(selector, filePath);
  }

  /**
   * Switch to frame
   * @param {string} selector - Frame selector
   * @returns {Promise<Frame>} Frame object
   */
  async switchToFrame(selector) {
    const frame = this.page.frameLocator(selector);
    logger.info(`Switched to frame: ${selector}`);
    return frame;
  }

  /**
   * Get inner HTML
   * @param {string} selector - Element selector
   * @returns {Promise<string>} Inner HTML
   */
  async getInnerHTML(selector) {
    return await this.page.innerHTML(selector);
  }

  /**
   * Clear input field
   * @param {string} selector - Input selector
   */
  async clear(selector) {
    logger.step(`Clearing input: ${selector}`);
    await this.page.fill(selector, '');
  }
}

module.exports = BasePage;
