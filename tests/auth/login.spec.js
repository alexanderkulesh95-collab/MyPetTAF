const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const DashboardPage = require('../../pages/DashboardPage');
const { getEnvironmentConfig } = require('../../config/environments');
const { testUsers } = require('../../fixtures/testData');
const logger = require('../../utils/logger');

// Get environment configuration
const env = process.env.ENV || 'demo';
const config = getEnvironmentConfig(env);

test.describe('Authentication - Login Tests', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    logger.testStart('Login Test');
    await loginPage.navigateToLogin(config.baseURL);
  });

  test.afterEach(async () => {
    logger.testEnd('Login Test', 'Completed');
  });

  test('TC-001: Verify successful login with valid credentials', async () => {
    logger.info('Test Case: TC-001 - Successful login');
    
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
    
  });

//   test('TC-002: Verify login fails with invalid username', async () => {
//     logger.info('Test Case: TC-002 - Login with invalid username');
    
//     // Arrange
//     const invalidUsername = 'invalid_user';
//     const password = config.password;

//     // Act
//     await loginPage.login(invalidUsername, password);
//     await loginPage.wait(1000);

//     // Assert
//     const isErrorDisplayed = await loginPage.isErrorDisplayed();
//     expect(isErrorDisplayed).toBeTruthy();
    
//     const errorMessage = await loginPage.getErrorMessage();
//     expect(errorMessage).toContain('Username and password do not match');
//     logger.assertion('Error message displayed for invalid username', true);
//   });

//   test('TC-003: Verify login fails with invalid password', async () => {
//     logger.info('Test Case: TC-003 - Login with invalid password');
    
//     // Arrange
//     const username = config.username;
//     const invalidPassword = 'wrong_password';

//     // Act
//     await loginPage.login(username, invalidPassword);
//     await loginPage.wait(1000);

//     // Assert
//     const isErrorDisplayed = await loginPage.isErrorDisplayed();
//     expect(isErrorDisplayed).toBeTruthy();
    
//     const errorMessage = await loginPage.getErrorMessage();
//     expect(errorMessage).toContain('Username and password do not match');
//     logger.assertion('Error message displayed for invalid password', true);
//   });

//   test('TC-004: Verify login fails with empty username', async () => {
//     logger.info('Test Case: TC-004 - Login with empty username');
    
//     // Act
//     await loginPage.enterPassword(config.password);
//     await loginPage.clickLogin();
//     await loginPage.wait(1000);

//     // Assert
//     const isErrorDisplayed = await loginPage.isErrorDisplayed();
//     expect(isErrorDisplayed).toBeTruthy();
    
//     const errorMessage = await loginPage.getErrorMessage();
//     expect(errorMessage).toContain('Username is required');
//     logger.assertion('Error message displayed for empty username', true);
//   });

//   test('TC-005: Verify login fails with empty password', async () => {
//     logger.info('Test Case: TC-005 - Login with empty password');
    
//     // Act
//     await loginPage.enterUsername(config.username);
//     await loginPage.clickLogin();
//     await loginPage.wait(1000);

//     // Assert
//     const isErrorDisplayed = await loginPage.isErrorDisplayed();
//     expect(isErrorDisplayed).toBeTruthy();
    
//     const errorMessage = await loginPage.getErrorMessage();
//     expect(errorMessage).toContain('Password is required');
//     logger.assertion('Error message displayed for empty password', true);
//   });

//   test('TC-006: Verify login form is displayed correctly', async () => {
//     logger.info('Test Case: TC-006 - Verify login form display');
    
//     // Assert
//     const isFormDisplayed = await loginPage.isLoginFormDisplayed();
//     expect(isFormDisplayed).toBeTruthy();
//     logger.assertion('Login form is displayed', isFormDisplayed);

//     const pageTitle = await loginPage.getTitle();
//     expect(pageTitle).toBeTruthy();
//     logger.assertion('Page title is present', true);
//   });

//   test('TC-007: Verify successful logout', async () => {
//     logger.info('Test Case: TC-007 - Successful logout');
    
//     // Arrange - Login first
//     const username = config.username;
//     const password = config.password;
//     await loginPage.login(username, password);
//     await loginPage.page.waitForURL('**/inventory.html', { timeout: 10000 });

//     // Act - Logout
//     await loginPage.logout();
//     await loginPage.page.waitForURL('**/', { timeout: 5000 });

//     // Assert
//     const currentUrl = await loginPage.getCurrentUrl();
//     expect(currentUrl).not.toContain('inventory.html');
    
//     const isLoginFormDisplayed = await loginPage.isLoginFormDisplayed();
//     expect(isLoginFormDisplayed).toBeTruthy();
//     logger.assertion('User successfully logged out', isLoginFormDisplayed);
//   });

//   test('TC-008: Verify login input field functionality', async () => {
//     logger.info('Test Case: TC-008 - Input field functionality');
    
//     // Act
//     const testUsername = 'testuser@test.com';
//     await loginPage.enterUsername(testUsername);

//     // Assert
//     const usernameValue = await loginPage.getUsernameValue();
//     expect(usernameValue).toBe(testUsername);
//     logger.assertion('Username field accepts input correctly', usernameValue === testUsername);
//   });

//   test('TC-011: Verify locked out user cannot login', async () => {
//     logger.info('Test Case: TC-011 - Locked out user login attempt');
    
//     // Arrange
//     const lockedUsername = testUsers.lockedUser.username;
//     const password = testUsers.lockedUser.password;

//     // Act
//     await loginPage.login(lockedUsername, password);
//     await loginPage.wait(1000);

//     // Assert
//     const isErrorDisplayed = await loginPage.isErrorDisplayed();
//     expect(isErrorDisplayed).toBeTruthy();
    
//     const errorMessage = await loginPage.getErrorMessage();
//     expect(errorMessage).toContain('locked out');
//     logger.assertion('Locked out user error message displayed', true);
//   });
// });

// test.describe('Authentication - Session Management', () => {
//   let loginPage;

//   test.beforeEach(async ({ page }) => {
//     loginPage = new LoginPage(page);
//     await loginPage.navigateToLogin(config.baseURL);
//   });

//   test('TC-009: Verify user remains logged in after page refresh', async ({ page }) => {
//     logger.info('Test Case: TC-009 - Session persistence after refresh');
    
//     // Arrange - Login
//     await loginPage.login(config.username, config.password);
//     await loginPage.page.waitForURL('**/inventory.html', { timeout: 10000 });

//     // Act - Refresh page
//     await page.reload();
//     await page.waitForLoadState('networkidle');

//     // Assert
//     const isLoggedIn = await loginPage.isLoggedIn();
//     expect(isLoggedIn).toBeTruthy();
//     logger.assertion('User session maintained after refresh', isLoggedIn);
//   });

//   test('TC-010: Verify clearing login form fields', async () => {
//     logger.info('Test Case: TC-010 - Clear form fields');
    
//     // Act
//     await loginPage.enterUsername('testuser');
//     await loginPage.enterPassword('testpassword');
//     await loginPage.clearLoginFields();

//     // Assert
//     const usernameValue = await loginPage.getUsernameValue();
//     expect(usernameValue).toBe('');
//     logger.assertion('Form fields cleared successfully', usernameValue === '');
//   });
});
