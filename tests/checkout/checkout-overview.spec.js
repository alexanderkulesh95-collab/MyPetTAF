const { test } = require('../../fixtures/pageFixtures');
const { expect } = require('@playwright/test');
const { getEnvironmentConfig } = require('../../config/environments');
const logger = require('../../utils/logger');

// Get environment configuration
const env = process.env.ENV || 'demo';
const config = getEnvironmentConfig(env);

test.describe('Checkout - Checkout Overview Page Tests', () => {
    
    let productDetails;
    
    test.beforeEach(async ({ authenticatedPage, inventoryPage, cartPage, checkoutPage, checkoutOverviewPage }) => {
        logger.testStart('Checkout Overview Page Test');
        // User is already authenticated via authenticatedPage fixture
        
        // Get product details before adding to cart
        const productNames = await inventoryPage.getAllProductNames();
        const productName = productNames[0];
        productDetails = await inventoryPage.getProductDetailsByName(productName);
        logger.info(`Selected product: ${productDetails.name}, Price: ${productDetails.price}`);
        
        // Add a product to cart and navigate to checkout overview
        await inventoryPage.addToCartByIndex(0);
        await inventoryPage.clickCartIcon();
        await cartPage.clickCheckout();
        await checkoutPage.waitForPageLoad();
        
        // Fill checkout form and continue
        await checkoutPage.fillCheckoutForm('John', 'Doe', '12345');
        await checkoutPage.clickContinue();
        await checkoutOverviewPage.waitForPageLoad();
    });

    test.afterEach(async () => {
        logger.testEnd('Checkout Overview Page Test', 'Completed');
    });

    test('TC-001: Verify product details and complete order', async ({ checkoutOverviewPage }) => {
        logger.info('Test Case: TC-001 - Verify product details and complete order');
        
        // Get item count
        const itemCount = await checkoutOverviewPage.getItemCount();
        expect(itemCount).toBe(1);
        logger.assertion('Checkout overview contains 1 item', itemCount === 1);

        // Get item details from overview page
        const overviewItemDetails = await checkoutOverviewPage.getItemDetailsByIndex(0);
        logger.info(`Overview item details - Name: ${overviewItemDetails.name}, Price: ${overviewItemDetails.price}, Quantity: ${overviewItemDetails.quantity}`);

        // Verify product name matches
        expect(overviewItemDetails.name).toBe(productDetails.name);
        logger.assertion(`Product name matches: "${overviewItemDetails.name}"`, overviewItemDetails.name === productDetails.name);

        // Verify product description matches
        expect(overviewItemDetails.description).toBe(productDetails.description);
        logger.assertion('Product description matches', overviewItemDetails.description === productDetails.description);

        // Verify product price matches
        expect(overviewItemDetails.price).toBe(productDetails.price);
        logger.assertion(`Product price matches: ${overviewItemDetails.price}`, overviewItemDetails.price === productDetails.price);

        // Verify quantity is 1
        expect(overviewItemDetails.quantity).toBe('1');
        logger.assertion('Product quantity is 1', overviewItemDetails.quantity === '1');

        // Click finish button to complete order
        await checkoutOverviewPage.clickFinish();
        logger.info('Clicked finish button');

        // Verify navigation to checkout complete page
        await checkoutOverviewPage.page.waitForURL('**/checkout-complete.html', { timeout: 5000 });
        const currentUrl = checkoutOverviewPage.page.url();
        expect(currentUrl).toContain('checkout-complete.html');
        logger.assertion('Navigated to checkout complete page', currentUrl.includes('checkout-complete.html'));

        // Verify checkout complete container is displayed
        const checkoutCompleteContainer = '[data-test="checkout-complete-container"]';
        const isCompletePageDisplayed = await checkoutOverviewPage.isVisible(checkoutCompleteContainer);
        expect(isCompletePageDisplayed).toBeTruthy();
        logger.assertion('Checkout complete page is displayed', isCompletePageDisplayed);

        // Verify success message header
        const completeHeader = '[data-test="complete-header"]';
        const isHeaderVisible = await checkoutOverviewPage.isVisible(completeHeader);
        expect(isHeaderVisible).toBeTruthy();
        logger.assertion('Success header is displayed', isHeaderVisible);

        const headerText = await checkoutOverviewPage.getText(completeHeader);
        expect(headerText).toContain('Thank you for your order');
        logger.assertion('Success message contains "Thank you for your order"', headerText.includes('Thank you for your order'));
    });

    test('TC-002: Verify cancel button navigation', async ({ checkoutOverviewPage, inventoryPage }) => {
        logger.info('Test Case: TC-002 - Verify cancel button navigation');
        
        // Click cancel button
        await checkoutOverviewPage.clickCancel();
        logger.info('Clicked cancel button');

        // Verify navigation to inventory page
        await checkoutOverviewPage.page.waitForURL('**/inventory.html', { timeout: 5000 });
        const currentUrl = checkoutOverviewPage.page.url();
        expect(currentUrl).toContain('inventory.html');
        logger.assertion('Navigated to inventory page', currentUrl.includes('inventory.html'));

        // Wait for inventory page to load
        await inventoryPage.waitForPageLoad();

        // Verify inventory page is displayed
        const isInventoryDisplayed = await inventoryPage.isInventoryDisplayed();
        expect(isInventoryDisplayed).toBeTruthy();
        logger.assertion('Inventory page is displayed', isInventoryDisplayed);

    });

});
