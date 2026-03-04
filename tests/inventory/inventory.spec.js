const { test } = require('../../fixtures/pageFixtures');
const { expect } = require('@playwright/test');
const { getEnvironmentConfig } = require('../../config/environments');
const { testUsers } = require('../../fixtures/testData');
const logger = require('../../utils/logger');

// Get environment configuration
const env = process.env.ENV || 'demo';
const config = getEnvironmentConfig(env);

test.describe('Inventory - Inventory Tests', () => {
    
    test.beforeEach(async ({ authenticatedPage }) => {
    logger.testStart('Inventory Test');
    // User is already authenticated via authenticatedPage fixture
    });

    test.afterEach(async () => {
        logger.testEnd('Inventory Test', 'Completed');
    });

    test('TC-001: Verify all items are present in inventory page', async ({ inventoryPage, productDetailsPage }) => {
        logger.info('Test Case: TC-001 - All items are present in inventory page');
        
        // User is already authenticated via authenticatedPage fixture
        // Assert
        
        const isInventoryDisplayed = await inventoryPage.isInventoryDisplayed();
        expect(isInventoryDisplayed).toBeTruthy();
        logger.assertion('Inventory container is visible', isInventoryDisplayed);

        // Validate all expected products are present by name
        const expectedProducts = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)'
        ];
        const productNames = await inventoryPage.getAllProductNames();
        for (const product of expectedProducts) {
            const isPresent = productNames.includes(product);
            expect(isPresent).toBeTruthy();
            logger.assertion(`${product} is displayed`, isPresent);
        }
    });

    test('TC-002: Verify all navigation in inventory page', async ({ inventoryPage, productDetailsPage }) => {
        logger.info('Test Case: TC-002 - All navigation in inventory page');
        
        // User is already authenticated via authenticatedPage fixture
        // Assert
        const isInventoryDisplayed = await inventoryPage.isInventoryDisplayed();
        expect(isInventoryDisplayed).toBeTruthy();
        logger.assertion('Inventory container is visible', isInventoryDisplayed);

        // Validate all products navigation elements lead to correct product details page

        await inventoryPage.clickProductTitle('Sauce Labs Backpack');
        const isSauseLabsBackpackNamePresent = await productDetailsPage.isProductNameDisplayed();
        expect(isSauseLabsBackpackNamePresent).toBeTruthy();
        logger.assertion('Sauce Labs Backpack name is displayed on product details page', isSauseLabsBackpackNamePresent);

        await productDetailsPage.navigateBackToProducts();

        await inventoryPage.clickProductTitle('Sauce Labs Bike Light');
        const isSauseLabsBikeLightNamePresent = await productDetailsPage.isProductNameDisplayed();
        expect(isSauseLabsBikeLightNamePresent).toBeTruthy();
        logger.assertion('Sauce Labs Bike Light name is displayed on product details page', isSauseLabsBikeLightNamePresent);

        await productDetailsPage.navigateBackToProducts();

        await inventoryPage.clickProductTitle('Sauce Labs Bolt T-Shirt');
        const isSauseLabsBoltTShirtNamePresent = await productDetailsPage.isProductNameDisplayed();
        expect(isSauseLabsBoltTShirtNamePresent).toBeTruthy();
        logger.assertion('Sauce Labs Bolt T-Shirt name is displayed on product details page', isSauseLabsBoltTShirtNamePresent);

        await productDetailsPage.navigateBackToProducts();

        await inventoryPage.clickProductTitle('Sauce Labs Fleece Jacket');
        const isSauseLabsFleeceJacketNamePresent = await productDetailsPage.isProductNameDisplayed();
        expect(isSauseLabsFleeceJacketNamePresent).toBeTruthy();
        logger.assertion('Sauce Labs Fleece Jacket name is displayed on product details page', isSauseLabsFleeceJacketNamePresent);

        await productDetailsPage.navigateBackToProducts();

        await inventoryPage.clickProductTitle('Sauce Labs Onesie');
        const isSauseLabsOnesieNamePresent = await productDetailsPage.isProductNameDisplayed();
        expect(isSauseLabsOnesieNamePresent).toBeTruthy();
        logger.assertion('Sauce Labs Onesie name is displayed on product details page', isSauseLabsOnesieNamePresent);

        await productDetailsPage.navigateBackToProducts();

        await inventoryPage.clickProductTitle('Test.allTheThings() T-Shirt (Red)');
        const isTestAllTheThingsTShirtNamePresent = await productDetailsPage.isProductNameDisplayed();
        expect(isTestAllTheThingsTShirtNamePresent).toBeTruthy();
        logger.assertion('Test.allTheThings() T-Shirt (Red) name is displayed on product details page', isTestAllTheThingsTShirtNamePresent);

        await productDetailsPage.navigateBackToProducts();
    });

    test('TC-003: Verify sorting products by Name (A to Z)', async ({ inventoryPage }) => {
        logger.info('Test Case: TC-003 - Verify sorting products by Name (A to Z)');
        
        // User is already authenticated via authenticatedPage fixture
        // Assert inventory page is displayed
        const isInventoryDisplayed = await inventoryPage.isInventoryDisplayed();
        expect(isInventoryDisplayed).toBeTruthy();
        logger.assertion('Inventory container is visible', isInventoryDisplayed);

        // Verify default sorting is A to Z
        const defaultActiveOption = await inventoryPage.getActiveSortOption();
        expect(defaultActiveOption).toBe('Name (A to Z)');
        logger.assertion('Default active sort option is "Name (A to Z)"', defaultActiveOption === 'Name (A to Z)');

        // Get product names before sorting (should already be sorted A-Z by default)
        const productNamesBeforeSort = await inventoryPage.getAllProductNames();
        logger.info(`Products before sort: ${productNamesBeforeSort.join(', ')}`);

        // Verify products are sorted by name A to Z by default
        const isSortedByDefault = await inventoryPage.isSortedByNameAtoZ();
        expect(isSortedByDefault).toBeTruthy();
        logger.assertion('Products are sorted by name A to Z by default', isSortedByDefault);

        // Select sort option Name (A to Z) again to test the sorting action
        await inventoryPage.sortByNameAtoZ();

        // Verify active option displays correct text
        const activeOption = await inventoryPage.getActiveSortOption();
        expect(activeOption).toBe('Name (A to Z)');
        logger.assertion('Active sort option displays "Name (A to Z)"', activeOption === 'Name (A to Z)');

        // Get product names after sorting
        const productNamesAfterSort = await inventoryPage.getAllProductNames();
        logger.info(`Products after sort: ${productNamesAfterSort.join(', ')}`);

        // Verify products are sorted correctly
        const isSorted = await inventoryPage.isSortedByNameAtoZ();
        expect(isSorted).toBeTruthy();
        logger.assertion('Products are sorted by name A to Z', isSorted);
    });

    test('TC-004: Verify sorting products by Name (Z to A)', async ({ inventoryPage }) => {
        logger.info('Test Case: TC-004 - Verify sorting products by Name (Z to A)');
        
        // User is already authenticated via authenticatedPage fixture
        // Assert inventory page is displayed
        const isInventoryDisplayed = await inventoryPage.isInventoryDisplayed();
        expect(isInventoryDisplayed).toBeTruthy();
        logger.assertion('Inventory container is visible', isInventoryDisplayed);

        // Get product names before sorting
        const productNamesBeforeSort = await inventoryPage.getAllProductNames();
        logger.info(`Products before sort: ${productNamesBeforeSort.join(', ')}`);

        // Sort by Name (Z to A)
        await inventoryPage.sortByNameZtoA();

        // Verify active option displays correct text
        const activeOption = await inventoryPage.getActiveSortOption();
        expect(activeOption).toBe('Name (Z to A)');
        logger.assertion('Active sort option displays "Name (Z to A)"', activeOption === 'Name (Z to A)');

        // Get product names after sorting
        const productNamesAfterSort = await inventoryPage.getAllProductNames();
        logger.info(`Products after sort: ${productNamesAfterSort.join(', ')}`);

        // Verify products are sorted correctly
        const isSorted = await inventoryPage.isSortedByNameZtoA();
        expect(isSorted).toBeTruthy();
        logger.assertion('Products are sorted by name Z to A', isSorted);
    });

    test('TC-005: Verify sorting products by Price (low to high)', async ({ inventoryPage }) => {
        logger.info('Test Case: TC-005 - Verify sorting products by Price (low to high)');
        
        // User is already authenticated via authenticatedPage fixture
        // Assert inventory page is displayed
        const isInventoryDisplayed = await inventoryPage.isInventoryDisplayed();
        expect(isInventoryDisplayed).toBeTruthy();
        logger.assertion('Inventory container is visible', isInventoryDisplayed);

        // Get product prices before sorting
        const productPricesBeforeSort = await inventoryPage.getAllProductPrices();
        logger.info(`Product prices before sort: ${productPricesBeforeSort.join(', ')}`);

        // Sort by Price (low to high)
        await inventoryPage.sortByPriceLowToHigh();

        // Verify active option displays correct text
        const activeOption = await inventoryPage.getActiveSortOption();
        expect(activeOption).toBe('Price (low to high)');
        logger.assertion('Active sort option displays "Price (low to high)"', activeOption === 'Price (low to high)');

        // Get product prices after sorting
        const productPricesAfterSort = await inventoryPage.getAllProductPrices();
        logger.info(`Product prices after sort: ${productPricesAfterSort.join(', ')}`);

        // Verify products are sorted correctly
        const isSorted = await inventoryPage.isSortedByPriceLowToHigh();
        expect(isSorted).toBeTruthy();
        logger.assertion('Products are sorted by price low to high', isSorted);
    });

    test('TC-006: Verify sorting products by Price (high to low)', async ({ inventoryPage }) => {
        logger.info('Test Case: TC-006 - Verify sorting products by Price (high to low)');
        
        // User is already authenticated via authenticatedPage fixture
        // Assert inventory page is displayed
        const isInventoryDisplayed = await inventoryPage.isInventoryDisplayed();
        expect(isInventoryDisplayed).toBeTruthy();
        logger.assertion('Inventory container is visible', isInventoryDisplayed);

        // Get product prices before sorting
        const productPricesBeforeSort = await inventoryPage.getAllProductPrices();
        logger.info(`Product prices before sort: ${productPricesBeforeSort.join(', ')}`);

        // Sort by Price (high to low)
        await inventoryPage.sortByPriceHighToLow();

        // Verify active option displays correct text
        const activeOption = await inventoryPage.getActiveSortOption();
        expect(activeOption).toBe('Price (high to low)');
        logger.assertion('Active sort option displays "Price (high to low)"', activeOption === 'Price (high to low)');

        // Get product prices after sorting
        const productPricesAfterSort = await inventoryPage.getAllProductPrices();
        logger.info(`Product prices after sort: ${productPricesAfterSort.join(', ')}`);

        // Verify products are sorted correctly
        const isSorted = await inventoryPage.isSortedByPriceHighToLow();
        expect(isSorted).toBeTruthy();
        logger.assertion('Products are sorted by price high to low', isSorted);
    });
    
    test('TC-007: Verify "Add to cart" button changes to "Remove" and cart badge updates', async ({ inventoryPage }) => {
        logger.info('Test Case: TC-007 - Verify "Add to cart" button changes to "Remove" and cart badge updates');
        
        // User is already authenticated via authenticatedPage fixture
        // Assert inventory page is displayed
        const isInventoryDisplayed = await inventoryPage.isInventoryDisplayed();
        expect(isInventoryDisplayed).toBeTruthy();
        logger.assertion('Inventory container is visible', isInventoryDisplayed);

        // Verify initial cart badge count is 0
        const initialCartCount = await inventoryPage.getCartBadgeCount();
        expect(initialCartCount).toBe(0);
        logger.assertion('Initial cart badge count is 0', initialCartCount === 0);

        // Get all product names and select a random product
        const productNames = await inventoryPage.getAllProductNames();
        const randomIndex = Math.floor(Math.random() * productNames.length);
        const randomProduct = productNames[randomIndex];
        logger.info(`Selected random product: ${randomProduct} (index: ${randomIndex})`);

        // Get initial button text (should be "Add to cart")
        const initialButtonText = await inventoryPage.getProductButtonText(randomProduct);
        expect(initialButtonText).toBe('Add to cart');
        logger.assertion(`Initial button text is "Add to cart" for ${randomProduct}`, initialButtonText === 'Add to cart');

        // Add product to cart by index
        await inventoryPage.addToCartByIndex(randomIndex);
        logger.info(`Added ${randomProduct} to cart`);

        // Verify button text changed to "Remove"
        const updatedButtonText = await inventoryPage.getProductButtonText(randomProduct);
        expect(updatedButtonText).toBe('Remove');
        logger.assertion(`Button text changed to "Remove" for ${randomProduct}`, updatedButtonText === 'Remove');

        // Verify cart badge count is now 1
        const updatedCartCount = await inventoryPage.getCartBadgeCount();
        expect(updatedCartCount).toBe(1);
        logger.assertion('Cart badge count updated to 1', updatedCartCount === 1);

    });

    test('TC-008: Verify removing product from inventory page decreases cart count', async ({ inventoryPage }) => {
        logger.info('Test Case: TC-008 - Verify removing product from inventory page decreases cart count');
        
        // User is already authenticated via authenticatedPage fixture
        // Assert inventory page is displayed
        const isInventoryDisplayed = await inventoryPage.isInventoryDisplayed();
        expect(isInventoryDisplayed).toBeTruthy();
        logger.assertion('Inventory container is visible', isInventoryDisplayed);

        // Verify initial cart badge count is 0
        const initialCartCount = await inventoryPage.getCartBadgeCount();
        expect(initialCartCount).toBe(0);
        logger.assertion('Initial cart badge count is 0', initialCartCount === 0);

        // Get all product names and select a random product
        const productNames = await inventoryPage.getAllProductNames();
        const randomIndex = Math.floor(Math.random() * productNames.length);
        const randomProduct = productNames[randomIndex];
        logger.info(`Selected random product: ${randomProduct} (index: ${randomIndex})`);

        // Add product to cart
        await inventoryPage.addToCartByIndex(randomIndex);
        logger.info(`Added ${randomProduct} to cart`);

        // Verify cart badge count is 1 after adding
        const cartCountAfterAdd = await inventoryPage.getCartBadgeCount();
        expect(cartCountAfterAdd).toBe(1);
        logger.assertion('Cart badge count is 1 after adding product', cartCountAfterAdd === 1);

        // Verify button text is "Remove"
        const buttonTextAfterAdd = await inventoryPage.getProductButtonText(randomProduct);
        expect(buttonTextAfterAdd).toBe('Remove');
        logger.assertion(`Button text is "Remove" for ${randomProduct}`, buttonTextAfterAdd === 'Remove');

        // Remove product from cart
        await inventoryPage.removeFromCartByName(randomProduct);
        logger.info(`Removed ${randomProduct} from cart`);

        // Verify button text changed back to "Add to cart"
        const buttonTextAfterRemove = await inventoryPage.getProductButtonText(randomProduct);
        expect(buttonTextAfterRemove).toBe('Add to cart');
        logger.assertion(`Button text changed back to "Add to cart" for ${randomProduct}`, buttonTextAfterRemove === 'Add to cart');

        // Verify cart badge count decreased to 0
        const cartCountAfterRemove = await inventoryPage.getCartBadgeCount();
        expect(cartCountAfterRemove).toBe(0);
        logger.assertion('Cart badge count decreased to 0', cartCountAfterRemove === 0);

    });

});
