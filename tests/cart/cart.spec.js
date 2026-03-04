const { test } = require('../../fixtures/pageFixtures');
const { expect } = require('@playwright/test');
const { getEnvironmentConfig } = require('../../config/environments');
const logger = require('../../utils/logger');

// Get environment configuration
const env = process.env.ENV || 'demo';
const config = getEnvironmentConfig(env);

test.describe('Cart - Cart Tests', () => {
    
    test.beforeEach(async ({ authenticatedPage }) => {
        logger.testStart('Cart Test');
        // User is already authenticated via authenticatedPage fixture
    });

    test.afterEach(async () => {
        logger.testEnd('Cart Test', 'Completed');
    });

    test('TC-001: Verify cart displays correct product details (name, description, price, quantity)', async ({ inventoryPage, cartPage }) => {
        logger.info('Test Case: TC-001 - Verify cart displays correct product details (name, description, price, quantity)');
        
        // User is already authenticated via authenticatedPage fixture
        // Assert inventory page is displayed
        const isInventoryDisplayed = await inventoryPage.isInventoryDisplayed();
        expect(isInventoryDisplayed).toBeTruthy();
        logger.assertion('Inventory container is visible', isInventoryDisplayed);

        // Get all product names and select a random product
        const productNames = await inventoryPage.getAllProductNames();
        const randomIndex = Math.floor(Math.random() * productNames.length);
        const randomProduct = productNames[randomIndex];
        logger.info(`Selected random product: ${randomProduct} (index: ${randomIndex})`);

        // Get product details from inventory page before adding to cart
        const inventoryProductDetails = await inventoryPage.getProductDetailsByName(randomProduct);
        logger.info(`Product details from inventory - Name: ${inventoryProductDetails.name}, Price: ${inventoryProductDetails.price}`);
        logger.info(`Product description: ${inventoryProductDetails.description}`);

        // Add random product to cart
        await inventoryPage.addToCartByIndex(randomIndex);
        logger.info(`Added ${randomProduct} to cart`);

        // Click cart icon to navigate to cart page
        await inventoryPage.clickCartIcon();
        logger.info('Clicked cart icon');

        // Wait for cart page to load
        await cartPage.waitForPageLoad();

        // Verify cart page is displayed
        const isCartPageDisplayed = await cartPage.isCartPageDisplayed();
        expect(isCartPageDisplayed).toBeTruthy();
        logger.assertion('Cart page is displayed', isCartPageDisplayed);

        // Verify page title is "Your Cart"
        const pageTitle = await cartPage.getPageTitle();
        expect(pageTitle).toBe('Your Cart');
        logger.assertion('Cart page title is "Your Cart"', pageTitle === 'Your Cart');

        // Verify quantity label is displayed
        const isQuantityLabelDisplayed = await cartPage.isQuantityLabelDisplayed();
        expect(isQuantityLabelDisplayed).toBeTruthy();
        logger.assertion('Quantity label (QTY) is displayed', isQuantityLabelDisplayed);

        // Verify description label is displayed
        const isDescLabelDisplayed = await cartPage.isDescriptionLabelDisplayed();
        expect(isDescLabelDisplayed).toBeTruthy();
        logger.assertion('Description label is displayed', isDescLabelDisplayed);

        // Verify cart contains the added product
        const isProductInCart = await cartPage.isProductInCart(randomProduct);
        expect(isProductInCart).toBeTruthy();
        logger.assertion(`Product "${randomProduct}" is present in cart`, isProductInCart);

        // Get product details from cart page
        const cartProductDetails = await cartPage.getCartProductDetailsByName(randomProduct);
        logger.info(`Product details from cart - Name: ${cartProductDetails.name}, Price: ${cartProductDetails.price}, Quantity: ${cartProductDetails.quantity}`);
        logger.info(`Product description in cart: ${cartProductDetails.description}`);

        // Verify product name matches
        expect(cartProductDetails.name).toBe(inventoryProductDetails.name);
        logger.assertion(`Product name matches: "${cartProductDetails.name}"`, cartProductDetails.name === inventoryProductDetails.name);

        // Verify product description matches
        expect(cartProductDetails.description).toBe(inventoryProductDetails.description);
        logger.assertion('Product description matches', cartProductDetails.description === inventoryProductDetails.description);

        // Verify product price matches
        expect(cartProductDetails.price).toBe(inventoryProductDetails.price);
        logger.assertion(`Product price matches: ${cartProductDetails.price}`, cartProductDetails.price === inventoryProductDetails.price);

        // Verify quantity is 1 (since we added one item)
        expect(cartProductDetails.quantity).toBe('1');
        logger.assertion(`Product quantity is 1`, cartProductDetails.quantity === '1');

        // Verify cart items count is 1
        const cartItemsCount = await cartPage.getCartItemsCount();
        expect(cartItemsCount).toBe(1);
        logger.assertion('Cart contains 1 item', cartItemsCount === 1);
    });

    test('TC-002: Verify removing product from cart using "Remove" button', async ({ inventoryPage, cartPage }) => {
        logger.info('Test Case: TC-002 - Verify removing product from cart using "Remove" button');
        
        // User is already authenticated via authenticatedPage fixture
        // Assert inventory page is displayed
        const isInventoryDisplayed = await inventoryPage.isInventoryDisplayed();
        expect(isInventoryDisplayed).toBeTruthy();
        logger.assertion('Inventory container is visible', isInventoryDisplayed);

        // Verify initial cart badge count is 0
        const initialCartCount = await inventoryPage.getCartBadgeCount();
        expect(initialCartCount).toBe(0);
        logger.assertion('Initial cart badge count is 0', initialCartCount === 0);

        // Add specific product to cart (Sauce Labs Backpack)
        const specificProduct = 'Sauce Labs Backpack';
        await inventoryPage.clickProductTitle(specificProduct);
        logger.info(`Clicked on product title: ${specificProduct}`);

        // Wait for product details page and go back to add the product
        await inventoryPage.page.goBack();
        await inventoryPage.waitForPageLoad();

        // Add the product to cart
        await inventoryPage.addBackpackToCart();
        logger.info(`Added ${specificProduct} to cart`);

        // Verify cart badge count is 1
        const cartCountAfterAdd = await inventoryPage.getCartBadgeCount();
        expect(cartCountAfterAdd).toBe(1);
        logger.assertion('Cart badge count is 1 after adding product', cartCountAfterAdd === 1);

        // Navigate to cart page
        await inventoryPage.clickCartIcon();
        logger.info('Clicked cart icon to navigate to cart page');

        // Wait for cart page to load
        await cartPage.waitForPageLoad();

        // Verify cart page is displayed
        const isCartPageDisplayed = await cartPage.isCartPageDisplayed();
        expect(isCartPageDisplayed).toBeTruthy();
        logger.assertion('Cart page is displayed', isCartPageDisplayed);

        // Verify product is in cart before removal
        const isProductInCartBefore = await cartPage.isProductInCart(specificProduct);
        expect(isProductInCartBefore).toBeTruthy();
        logger.assertion(`Product "${specificProduct}" is in cart before removal`, isProductInCartBefore);

        // Verify cart items count is 1 before removal
        const cartItemsCountBefore = await cartPage.getCartItemsCount();
        expect(cartItemsCountBefore).toBe(1);
        logger.assertion('Cart contains 1 item before removal', cartItemsCountBefore === 1);

        // Remove product from cart using Remove button
        await cartPage.removeProductFromCart(specificProduct);
        logger.info(`Clicked Remove button for ${specificProduct}`);

        // Wait a moment for cart to update
        await cartPage.page.waitForTimeout(500);

        // Verify product is removed from cart list
        const isProductInCartAfter = await cartPage.isProductInCart(specificProduct);
        expect(isProductInCartAfter).toBeFalsy();
        logger.assertion(`Product "${specificProduct}" is removed from cart`, !isProductInCartAfter);

        // Verify cart items count is 0 after removal
        const cartItemsCountAfter = await cartPage.getCartItemsCount();
        expect(cartItemsCountAfter).toBe(0);
        logger.assertion('Cart contains 0 items after removal', cartItemsCountAfter === 0);

        // Verify cart is empty
        const isCartEmpty = await cartPage.isCartEmpty();
        expect(isCartEmpty).toBeTruthy();
        logger.assertion('Cart is empty after removing all items', isCartEmpty);

    });

    test('TC-003: Verify "Continue Shopping" button navigates back to inventory page', async ({ inventoryPage, cartPage }) => {
        logger.info('Test Case: TC-003 - Verify "Continue Shopping" button navigates back to inventory page');
        
        // User is already authenticated via authenticatedPage fixture
        // Assert inventory page is displayed
        const isInventoryDisplayed = await inventoryPage.isInventoryDisplayed();
        expect(isInventoryDisplayed).toBeTruthy();
        logger.assertion('Inventory container is visible', isInventoryDisplayed);

        // Verify initial cart badge count is 0 (empty cart)
        const initialCartCount = await inventoryPage.getCartBadgeCount();
        expect(initialCartCount).toBe(0);
        logger.assertion('Initial cart badge count is 0', initialCartCount === 0);

        // Navigate to cart page with empty cart
        await inventoryPage.clickCartIcon();
        logger.info('Clicked cart icon to navigate to cart page (empty cart)');

        // Wait for cart page to load
        await cartPage.waitForPageLoad();

        // Verify cart page is displayed
        const isCartPageDisplayed = await cartPage.isCartPageDisplayed();
        expect(isCartPageDisplayed).toBeTruthy();
        logger.assertion('Cart page is displayed', isCartPageDisplayed);

        // Verify cart is empty
        const isCartEmpty = await cartPage.isCartEmpty();
        expect(isCartEmpty).toBeTruthy();
        logger.assertion('Cart is empty', isCartEmpty);

        // Verify "Continue Shopping" button is visible
        const isContinueShoppingVisible = await cartPage.isContinueShoppingButtonVisible();
        expect(isContinueShoppingVisible).toBeTruthy();
        logger.assertion('Continue Shopping button is visible', isContinueShoppingVisible);

        // Click "Continue Shopping" button
        await cartPage.clickContinueShopping();
        logger.info('Clicked Continue Shopping button');

        // Wait for inventory page to load
        await inventoryPage.waitForPageLoad();

        // Verify URL contains inventory.html
        const currentUrl = await inventoryPage.getCurrentUrl();
        expect(currentUrl).toContain('inventory.html');
        logger.assertion('URL contains inventory.html', currentUrl.includes('inventory.html'));

        // Verify inventory page is displayed
        const isInventoryDisplayedAfter = await inventoryPage.isInventoryDisplayed();
        expect(isInventoryDisplayedAfter).toBeTruthy();
        logger.assertion('Successfully navigated back to inventory page', isInventoryDisplayedAfter);

        // Verify cart badge count remains 0 (cart items persist)
        const cartCountAfter = await inventoryPage.getCartBadgeCount();
        expect(cartCountAfter).toBe(0);
        logger.assertion('Cart badge count is still 0', cartCountAfter === 0);
    });

    test('TC-004: Verify "Checkout" button navigates to checkout page', async ({ inventoryPage, cartPage, checkoutPage }) => {
        logger.info('Test Case: TC-004 - Verify "Checkout" button navigates to checkout page');
        
        // User is already authenticated via authenticatedPage fixture
        // Assert inventory page is displayed
        const isInventoryDisplayed = await inventoryPage.isInventoryDisplayed();
        expect(isInventoryDisplayed).toBeTruthy();
        logger.assertion('Inventory container is visible', isInventoryDisplayed);

        // Add a product to cart
        const productIndex = 0;
        const productNames = await inventoryPage.getAllProductNames();
        const productName = productNames[productIndex];
        logger.info(`Adding product to cart: ${productName}`);
        
        await inventoryPage.addToCartByIndex(productIndex);
        logger.info(`Added ${productName} to cart`);

        // Verify cart badge count is 1
        const cartCountAfterAdd = await inventoryPage.getCartBadgeCount();
        expect(cartCountAfterAdd).toBe(1);
        logger.assertion('Cart badge count is 1 after adding product', cartCountAfterAdd === 1);

        // Navigate to cart page
        await inventoryPage.clickCartIcon();
        logger.info('Clicked cart icon to navigate to cart page');

        // Wait for cart page to load
        await cartPage.waitForPageLoad();

        // Verify cart page is displayed
        const isCartPageDisplayed = await cartPage.isCartPageDisplayed();
        expect(isCartPageDisplayed).toBeTruthy();
        logger.assertion('Cart page is displayed', isCartPageDisplayed);

        // Verify product is in cart
        const isProductInCart = await cartPage.isProductInCart(productName);
        expect(isProductInCart).toBeTruthy();
        logger.assertion(`Product "${productName}" is in cart`, isProductInCart);

        // Verify Checkout button is visible
        const isCheckoutButtonVisible = await cartPage.isCheckoutButtonVisible();
        expect(isCheckoutButtonVisible).toBeTruthy();
        logger.assertion('Checkout button is visible', isCheckoutButtonVisible);

        // Click Checkout button
        await cartPage.clickCheckout();
        logger.info('Clicked Checkout button');

        // Wait for checkout page to load
        await checkoutPage.waitForPageLoad();

        // Verify URL contains checkout
        const currentUrl = await checkoutPage.getCurrentUrl();
        expect(currentUrl).toContain('checkout-step-one.html');
        logger.assertion('URL contains checkout-step-one.html', currentUrl.includes('checkout-step-one.html'));

        // Verify checkout page is displayed
        const isCheckoutPageDisplayed = await checkoutPage.isCheckoutPageDisplayed();
        expect(isCheckoutPageDisplayed).toBeTruthy();
        logger.assertion('Checkout page is displayed', isCheckoutPageDisplayed);
    });

});
