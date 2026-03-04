# MyPetTAF
**My Personal Test Automation Framework** - A comprehensive UI Test Automation Framework built with Playwright and JavaScript for testing the Sauce Demo e-commerce application.

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Configuration](#configuration)
- [Writing Your First Test](#writing-your-first-test)
- [Test Reports](#test-reports)
- [Best Practices](#best-practices)

---

## 🎯 About the Project

This test automation framework is designed to test [Sauce Demo](https://www.saucedemo.com/) - an e-commerce web application. The framework follows the Page Object Model (POM) design pattern and implements best practices for maintainable, scalable test automation.

**What is tested:**
- User authentication (login/logout)
- Product inventory browsing and sorting
- Shopping cart functionality
- Checkout process (multi-step)
- End-to-end purchase workflows

For a complete list of test cases, see [test-cases.md](test-cases.md).

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **[Playwright](https://playwright.dev/)** (v1.48.0) | Cross-browser automation framework |
| **JavaScript (Node.js)** | Programming language |
| **Page Object Model** | Design pattern for test structure |
| **Winston** | Logging and test execution tracking |
| **Allure** | Test reporting and visualization |
| **Faker** | Test data generation |
| **MySQL2, PostgreSQL, MongoDB** | Database connectivity (optional) |

---

## 📦 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **npm** (comes with Node.js)

Verify installations:
```powershell
node --version
npm --version
git --version
```

---

## 🚀 Local Setup

Follow these steps to set up the project on your local machine:

### 1. Clone the Repository
```powershell
git clone <repository-url>
cd MyPetTAF
```

### 2. Install Dependencies
```powershell
npm install
```

This will install all required packages including:
- Playwright and its browser drivers
- Test dependencies (Winston, Allure, Faker, etc.)

### 3. Install Playwright Browsers
```powershell
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers.

### 4. Verify Installation
```powershell
npm test
```

If everything is set up correctly, the tests will start running!

---

## 📁 Project Structure

```
MyPetTAF/
├── config/                      # Configuration files
│   └── environments.js          # Environment-specific configs (dev, staging, prod)
├── fixtures/                    # Playwright fixtures
│   ├── pageFixtures.js          # Page object fixtures
│   └── testData.js              # Test data fixtures
├── pages/                       # Page Object Model classes
│   ├── BasePage.js              # Base page with common methods
│   ├── LoginPage.js             # Login page object
│   ├── InventoryPage.js         # Inventory/products page object
│   ├── CartPage.js              # Shopping cart page object
│   ├── CheckoutPage.js          # Checkout form page object
│   └── CheckoutOverviewPage.js  # Checkout overview page object
├── tests/                       # Test specifications
│   ├── auth/                    # Authentication tests
│   ├── cart/                    # Cart functionality tests
│   ├── checkout/                # Checkout process tests
│   └── inventory/               # Inventory tests
├── utils/                       # Utility functions
│   └── logger.js                # Winston logger configuration
├── reports/                     # Test reports (generated)
├── logs/                        # Log files (generated)
├── playwright.config.js         # Playwright configuration
├── package.json                 # Project dependencies
└── README.md                    # This file
```

---

## ▶️ Running Tests

### Basic Commands

```powershell
# Run all tests (headless mode)
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode (Playwright Inspector)
npm run test:ui
```

### Browser-Specific Tests

```powershell
# Run tests on Chromium only
npm run test:chrome

# Run tests on Firefox
npm run test:firefox

# Run tests on WebKit (Safari)
npm run test:webkit
```

### Environment-Specific Tests

```powershell
# Run tests on dev environment
npm run test:dev

# Run tests on staging environment
npm run test:staging

# Run tests on production environment
npm run test:prod
```

### Parallel Execution

```powershell
# Run tests in parallel (4 workers)
npm run test:parallel

# Run tests serially (1 worker)
npm run test:serial
```

### Run Specific Tests

```powershell
# Run tests in a specific file
npx playwright test tests/auth/login.spec.js

# Run tests matching a pattern
npx playwright test tests/cart/

# Run a specific test by title
npx playwright test -g "TC-001"
```

### View Test Reports

```powershell
# Open HTML report
npm run report

# View Allure report (requires Allure installed)
allure serve reports/allure-results
```

---

## ⚙️ Configuration

### Environment Configuration

Update `config/environments.js` to configure different test environments:

```javascript
const environments = {
  dev: {
    baseURL: 'https://www.saucedemo.com',
    username: 'standard_user',
    password: 'secret_sauce',
    timeout: 30000
  },
  staging: { /* ... */ },
  prod: { /* ... */ }
};
```

### Playwright Configuration

Modify `playwright.config.js` to customize:
- Test directory
- Parallel execution workers
- Retries on failure
- Timeout values
- Browser configurations
- Reporter settings
- Screenshots and video capture

---

## ✍️ Writing Your First Test

Quick guide to creating tests using this framework's custom fixtures and utilities.

### Step 1: Set Up Your Test File

Create your test file in the appropriate folder (e.g., `tests/inventory/product-details.spec.js`):

```javascript
const { test } = require('../../fixtures/pageFixtures');
const { expect } = require('@playwright/test');
const { getEnvironmentConfig } = require('../../config/environments');
const logger = require('../../utils/logger');

const env = process.env.ENV || 'dev';
const config = getEnvironmentConfig(env);
```

### Step 2: Structure Your Test Suite

```javascript
test.describe('Product Details Tests', () => {
  
  test.beforeEach(async ({ authenticatedPage }) => {
    logger.testStart('Product Details Test');
    // authenticatedPage fixture handles login automatically
  });

  test.afterEach(async () => {
    logger.testEnd('Product Details Test', 'Completed');
  });

  test('TC-001: Verify product details display', async ({ inventoryPage, productDetailsPage }) => {
    logger.info('Test Case: TC-001');
    
    const productNames = await inventoryPage.getAllProductNames();
    const firstProduct = productNames[0];

    await inventoryPage.clickProductTitle(firstProduct);
    
    const displayedName = await productDetailsPage.getProductName();
    expect(displayedName).toBe(firstProduct);
    logger.assertion(`Product name verified: ${displayedName}`, true);
  });
});
```

### Step 3: Leverage Custom Fixtures

**Available page objects** (auto-injected via fixtures):
- `loginPage`, `inventoryPage`, `cartPage`, `checkoutPage`, `checkoutOverviewPage`

**Authentication fixture**:
- Use `authenticatedPage` to skip login - already authenticated with `standard_user`

```javascript
test('Use pre-authenticated session', async ({ authenticatedPage, inventoryPage }) => {
  // Already logged in, inventory page loaded
  await inventoryPage.addToCartByIndex(0);
});
```

### Step 4: Run Your Test

```powershell
npx playwright test tests/inventory/product-details.spec.js
npx playwright test tests/inventory/product-details.spec.js --ui  # Debug mode
```

### Framework-Specific Conventions

**Test ID format**: Prefix tests with `TC-XXX` for tracking  
**Logging**: Use `logger.info()` and `logger.assertion()` for test traceability  
**Environment config**: Access via `getEnvironmentConfig(env)` for baseURL, credentials, timeouts

---

## 📊 Test Reports

The framework generates multiple types of reports:

### 1. HTML Report (Built-in Playwright Report)
```powershell
npm run report
```
- Located in: `reports/html-report/`
- Shows test results, traces, screenshots, and videos
- Interactive timeline view

### 2. Allure Report
```powershell
# Generate and open Allure report
allure serve reports/allure-results
```
- Advanced reporting with trends and history
- Test categorization and tags
- Detailed step-by-step execution

### 3. JSON Report
- Located in: `reports/test-results.json`
- Machine-readable format for CI/CD integration

### 4. JUnit XML Report
- Located in: `reports/junit-results.xml`
- Compatible with Jenkins and other CI tools

### 5. Console Logs
- Real-time test execution logs
- Saved to: `logs/` directory

---

## 🎯 Best Practices

### 1. **Use Page Object Model**
- Keep page interactions in page classes
- Tests should only call page methods
- Avoid direct `page.locator()` in tests

### 2. **Follow Naming Conventions**
- Test files: `*.spec.js`
- Page objects: `*Page.js`
- Test IDs: `TC-001`, `TC-002`, etc.

### 3. **Use Fixtures**
- Leverage `authenticatedPage` for tests requiring login
- Create custom fixtures for repeated setups

### 4. **Add Proper Logging**
```javascript
logger.info('Step description');
logger.assertion('What is being verified', condition);
logger.testStart('Test Name');
logger.testEnd('Test Name', 'Status');
```

### 5. **Use Meaningful Assertions**
```javascript
// Good
expect(cartCount).toBe(1);
logger.assertion('Cart contains 1 item', cartCount === 1);

// Avoid
expect(cartCount).toBeTruthy();
```

### 6. **Keep Tests Independent**
- Each test should be runnable in isolation
- Don't rely on test execution order
- Clean up test data after each test

### 7. **Use Test Data from Config**
```javascript
const config = getEnvironmentConfig(env);
await loginPage.login(config.username, config.password);
```

### 8. **Handle Waits Properly**
```javascript
// Wait for URL navigation
await page.waitForURL('**/inventory.html');

// Wait for element
await page.waitForSelector('[data-test="product-name"]');
```

---

For questions or issues:
1. Check existing test examples in `tests/` directory
2. Review [Playwright documentation](https://playwright.dev/)
3. Check logs in `logs/` directory

---
