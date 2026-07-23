# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This project does not currently follow semantic version tags — entries are grouped by date.

## [Unreleased]

### Added
- `CLAUDE.md` added with project overview, commands, architecture, and conventions for Claude Code.
- `CHANGELOG.md` added to track notable changes going forward.

## [2026-05-18]

### Changed
- Environment configuration now defaults to `demo` instead of `dev` (`config/environments.js`).
- Allure report generation command updated.

### Added
- ESLint added to the project (`eslint.config.mjs`, `package.json`).

## [2026-03-30]

### Changed
- Allure report paths refactored across the Playwright workflow and `playwright.config.js` for consistency.

## [2026-03-26]

### Changed
- Playwright workflow schedule changed to run every 3 days.
- Allure report generation command simplified and updated to specify an output directory.

## [2026-03-20]

### Added
- Debugging steps for Allure results in the Playwright workflow (existence checks, Windows/PowerShell and Linux/macOS support).

### Changed
- Allure-playwright output folder path changed to `reports`.
- Playwright workflow updated to remove error continuation.

### Fixed
- Indentation fixed for the Allure results debugging step in the Playwright workflow.

## [2026-03-17]

### Added
- Permissions added to the Playwright GitHub Actions workflow.

## [2026-03-12]

### Added
- `package-lock.json` committed to the repository.

### Removed
- Firefox and WebKit test runs removed from the Playwright workflow (Chromium only going forward).

## [2026-03-04]

### Added
- Cart tests (`TC-001`–`TC-004`) covering product details, item removal, "Continue Shopping", and "Checkout" navigation.
- Checkout tests (`TC-001`–`TC-003`) covering the checkout form, cancel navigation, and required-field validation.
- Checkout overview tests (`TC-001`–`TC-002`) covering order completion and cancel navigation.
- New page objects: `CartPage`, `CheckoutPage`, `CheckoutOverviewPage`, `ProductDetailsPage`.
- `pageFixtures.js` fixture-driven Page Object Model setup.
- `test-cases.md` added to track all test cases.

### Changed
- Inventory tests updated; `InventoryPage` extended.
- Login tests updated.
- Playwright configuration modified to support headless mode.

## [2026-01-14]

- Merged initial branch work into `main`.

## [2026-01-13]

### Added
- Initial test automation framework structure: `BasePage`, `LoginPage`, `InventoryPage`, environment config, logger, Playwright config, GitHub Actions workflow, login and inventory specs.
- `README.md`.
