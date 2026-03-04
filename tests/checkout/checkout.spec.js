const { test } = require('../../fixtures/pageFixtures');
const { expect } = require('@playwright/test');
const { getEnvironmentConfig } = require('../../config/environments');
const logger = require('../../utils/logger');

// Get environment configuration
const env = process.env.ENV || 'demo';
const config = getEnvironmentConfig(env);

test.describe('Checkout - Checkout Page Tests', () => {
    
    test.beforeEach(async ({ authenticatedPage, inventoryPage, cartPage, checkoutPage }) => {
        logger.testStart('Checkout Page Test');
        // User is already authenticated via authenticatedPage fixture
        // Add a product to cart and navigate to checkout
        await inventoryPage.addToCartByIndex(0);
        await inventoryPage.clickCartIcon();
        await cartPage.clickCheckout();
        await checkoutPage.waitForPageLoad();
    });

    test.afterEach(async () => {
        logger.testEnd('Checkout Page Test', 'Completed');
    });

    test('TC-001: Verify filling checkout form with valid data and continue to checkout overview', async ({ checkoutPage }) => {
        logger.info('Test Case: TC-001 - Verify filling checkout form with valid data and continue to checkout overview');
        
        const testData = {
            firstName: 'John',
            lastName: 'Doe',
            postalCode: '12345'
        };

        // Fill checkout form
        await checkoutPage.fillCheckoutForm(testData.firstName, testData.lastName, testData.postalCode);
        logger.info(`Filled checkout form with: ${testData.firstName} ${testData.lastName}, ${testData.postalCode}`);

        // Verify form was filled (fields contain values)
        const firstNameValue = await checkoutPage.page.inputValue(checkoutPage.firstNameInput);
        expect(firstNameValue).toBe(testData.firstName);
        logger.assertion('First name field contains correct value', firstNameValue === testData.firstName);

        const lastNameValue = await checkoutPage.page.inputValue(checkoutPage.lastNameInput);
        expect(lastNameValue).toBe(testData.lastName);
        logger.assertion('Last name field contains correct value', lastNameValue === testData.lastName);

        const postalCodeValue = await checkoutPage.page.inputValue(checkoutPage.postalCodeInput);
        expect(postalCodeValue).toBe(testData.postalCode);
        logger.assertion('Postal code field contains correct value', postalCodeValue === testData.postalCode);

        // Click continue button
        await checkoutPage.clickContinue();
        logger.info('Clicked continue button');

        // Verify navigation to checkout overview page
        await checkoutPage.page.waitForURL('**/checkout-step-two.html', { timeout: 5000 });
        const currentUrl = checkoutPage.page.url();
        expect(currentUrl).toContain('checkout-step-two.html');
        logger.assertion('Navigated to checkout overview page', currentUrl.includes('checkout-step-two.html'));
    });

    test('TC-002: Verify cancel button returns to cart page', async ({ checkoutPage, cartPage }) => {
        logger.info('Test Case: TC-002 - Verify cancel button returns to cart page');
        
        // Click cancel button
        await checkoutPage.clickCancel();
        logger.info('Clicked cancel button');

        // Verify navigation back to cart page
        await checkoutPage.page.waitForURL('**/cart.html', { timeout: 5000 });
        const currentUrl = checkoutPage.page.url();
        expect(currentUrl).toContain('cart.html');
        logger.assertion('Navigated back to cart page', currentUrl.includes('cart.html'));

        // Verify cart page is displayed
        const isCartPageDisplayed = await cartPage.isCartPageDisplayed();
        expect(isCartPageDisplayed).toBeTruthy();
        logger.assertion('Cart page is displayed', isCartPageDisplayed);

        // Verify cart still contains the item (item added in beforeEach)
        const cartItemsCount = await cartPage.getCartItemsCount();
        expect(cartItemsCount).toBe(1);
        logger.assertion('Cart still contains 1 item', cartItemsCount === 1);
    });

    test('TC-003: Verify error messages for empty required fields', async ({ checkoutPage }) => {
        logger.info('Test Case: TC-003 - Verify error messages for empty required fields');
        
        const errorLocator = '[data-test="error"]';

        // Test 1: Empty first name
        logger.info('Testing validation for empty first name');
        await checkoutPage.fillLastName('Doe');
        await checkoutPage.fillPostalCode('12345');
        await checkoutPage.clickContinue();
        logger.info('Clicked continue button with empty first name');

        let isErrorVisible = await checkoutPage.isVisible(errorLocator);
        expect(isErrorVisible).toBeTruthy();
        logger.assertion('Error message is displayed for empty first name', isErrorVisible);

        let errorText = await checkoutPage.getText(errorLocator);
        expect(errorText).toContain('First Name is required');
        logger.assertion('Error message contains "First Name is required"', errorText.includes('First Name is required'));

        // Clear fields for next test
        await checkoutPage.page.reload();
        await checkoutPage.waitForPageLoad();

        // Test 2: Empty last name
        logger.info('Testing validation for empty last name');
        await checkoutPage.fillFirstName('John');
        await checkoutPage.fillPostalCode('12345');
        await checkoutPage.clickContinue();
        logger.info('Clicked continue button with empty last name');

        isErrorVisible = await checkoutPage.isVisible(errorLocator);
        expect(isErrorVisible).toBeTruthy();
        logger.assertion('Error message is displayed for empty last name', isErrorVisible);

        errorText = await checkoutPage.getText(errorLocator);
        expect(errorText).toContain('Last Name is required');
        logger.assertion('Error message contains "Last Name is required"', errorText.includes('Last Name is required'));

        // Clear fields for next test
        await checkoutPage.page.reload();
        await checkoutPage.waitForPageLoad();

        // Test 3: Empty postal code
        logger.info('Testing validation for empty postal code');
        await checkoutPage.fillFirstName('John');
        await checkoutPage.fillLastName('Doe');
        await checkoutPage.clickContinue();
        logger.info('Clicked continue button with empty postal code');

        isErrorVisible = await checkoutPage.isVisible(errorLocator);
        expect(isErrorVisible).toBeTruthy();
        logger.assertion('Error message is displayed for empty postal code', isErrorVisible);

        errorText = await checkoutPage.getText(errorLocator);
        expect(errorText).toContain('Postal Code is required');
        logger.assertion('Error message contains "Postal Code is required"', errorText.includes('Postal Code is required'));
    });

});
