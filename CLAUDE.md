# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyPetTAF is a Playwright + JavaScript UI test automation framework testing [Sauce Demo](https://www.saucedemo.com/), a demo e-commerce site. It follows the Page Object Model (POM) pattern.

## Commands

```powershell
npm test                          # Run all tests headless
npm run test:headed               # Run with visible browser
npm run test:debug                # Playwright inspector/debug mode
npm run test:ui                   # Playwright UI mode

npm run test:chrome               # Chromium only (only enabled project currently)
npm run test:dev                  # ENV=dev playwright test
npm run test:staging / test:prod  # ENV=staging|prod (see "Environment gotcha" below)

npm run test:parallel             # --workers=4
npm run test:serial               # --workers=1

npm run report                    # Open Playwright HTML report
npm run lint                      # eslint

# Run one file, one folder, or one test by title/ID:
npx playwright test tests/auth/login.spec.js
npx playwright test tests/cart/
npx playwright test -g "TC-001"
```

There is no `npm run start`; `webServer` in `playwright.config.js` only activates when `START_LOCAL_SERVER` is set, so it's inert for this project (tests hit the live saucedemo.com site).

## Architecture

**Fixture-driven POM.** `fixtures/pageFixtures.js` extends Playwright's `test` with one fixture per page object (`loginPage`, `inventoryPage`, `productDetailsPage`, `cartPage`, `checkoutPage`, `checkoutOverviewPage`) plus an `authenticatedPage` fixture that performs login (via `standard_user`/`secret_sauce` from the active environment config) and waits for `**/inventory.html` before yielding the already-logged-in `page`. Tests should destructure the fixtures they need rather than instantiating page objects directly.

**Page objects** (`pages/`) all extend `BasePage` (`pages/BasePage.js`), which wraps ~30 common Playwright actions (`click`, `fill`, `waitForElement`, `dragAndDrop`, `handleDialog`, etc.) and logs each step via the Winston logger. Concrete pages (`LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`, `CheckoutOverviewPage`, `ProductDetailsPage`) store their locators as instance properties in the constructor (prefer `data-test` attribute selectors, matching Sauce Demo's DOM) and expose intention-revealing methods (e.g. `login()`, `isLoggedIn()`, `getErrorMessage()`). Tests should only call page-object methods, never `page.locator()` directly.

**Environment config** (`config/environments.js`) exports `getEnvironmentConfig(env)` / `getCurrentEnvironment()`. Only `dev` and `demo` keys currently exist; `demo` (baseURL `https://www.saucedemo.com`) is the effective default everywhere — `playwright.config.js` and `pageFixtures.js` both fall back to `process.env.ENV || 'demo'`. **Gotcha:** the `dev` entry points at a non-existent placeholder domain (`dev.example.com`), and the `npm run test:staging` / `test:prod` scripts set `ENV=staging`/`ENV=prod`, which don't exist in `environments.js` — `getEnvironmentConfig` logs a warning and silently falls back to `demo`. If you add a real environment, add its entry to `environments.js` first.

**Test structure**: specs live under `tests/<feature>/*.spec.js` (auth, cart, checkout, inventory), each wrapped in `test.describe`, with tests titled `TC-XXX: <description>` for traceability against `test-cases.md` (kept in sync manually — update it when adding/removing test cases). Each spec resolves `env`/`config` at module scope from `getEnvironmentConfig(process.env.ENV || 'demo')` and imports `logger` from `utils/logger.js`, calling `logger.testStart`/`testEnd`/`step`/`assertion` around actions for traceability in `logs/`.

**Reporters**: configured in `playwright.config.js` — html (`reports/html-report`), json (`reports/test-results.json`), junit (`reports/junit-results.xml`), list, and `allure-playwright` (output to `allure-results/`, viewed via `allure serve allure-results`).

**Unused scaffolding**: `utils/databaseHelper.js` (Postgres/MySQL/MongoDB helpers) and `utils/dataGenerator.js` (Faker-based generators), plus most of `fixtures/testData.js` (only `testUsers` is referenced by specs), are present as reusable infrastructure but not currently wired into any test — the Sauce Demo target has no backing database or API. Don't assume they're exercised by the existing suite.

## Conventions

- Test IDs: `TC-001`, `TC-002`, … per describe block, referenced in `test-cases.md`.
- Selectors: prefer `[data-test="..."]` attributes over CSS classes/text where the site provides them.
- Logging: call `logger.step()`/`logger.assertion()`/`logger.testStart()`/`logger.testEnd()` around key actions and expects, following the existing specs' style.
- Changelog: `CHANGELOG.md` (Keep a Changelog format) is kept in sync manually, like `test-cases.md` — add an entry under `[Unreleased]` for any framework-level change (page objects, fixtures, config, CI/tooling, dependencies) or test-case change (additions/removals/modifications of `TC-XXX` cases).
