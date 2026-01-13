const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const InventoryPage = require('../../pages/InventoryPage');
const { getEnvironmentConfig } = require('../../config/environments');
const { testUsers } = require('../../fixtures/testData');
const logger = require('../../utils/logger');

// Get environment configuration
const env = process.env.ENV || 'demo';
const config = getEnvironmentConfig(env);

test.describe('Inventory - Inventory Tests', () => {
    let loginPage;
    let inventoryPage;
    
    test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    
    logger.testStart('Inventory Test');
    await loginPage.navigateToLogin(config.baseURL);
    });

    test.afterEach(async () => {
        logger.testEnd('Inventory Test', 'Completed');
    });

    test('TC-001: Verify all items are present in inventory page', async () => {
        logger.info('Test Case: TC-001 - All items are present in inventory page');
        
        // Arrange
        const username = config.username; // standard_user
        const password = config.password; // secret_sauce
    
        // Act
        await loginPage.login(username, password);
        await loginPage.page.waitForURL('**/inventory.html', { timeout: 10000 });
    
        // Assert
        const isLoggedIn = await loginPage.isLoggedIn();
        expect(isLoggedIn).toBeTruthy();
        logger.assertion('User successfully logged in', isLoggedIn);
        
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

    
});