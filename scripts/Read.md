# Playwright Practice with JavaScript

This repository is a Playwright-based test automation project built with JavaScript. It is designed to automate browser-based user workflows and validate critical application features such as login, auctions, bids, approvals, and purchase requisition processes.

## What is Playwright?

Playwright is a modern end-to-end testing framework developed by Microsoft. It allows developers and QA engineers to automate web applications across Chromium, Firefox, and WebKit using a single, consistent API. In this project, Playwright is used with JavaScript to create reliable, maintainable, and scalable UI tests.

## Project Purpose

The main goal of this project is to:

- automate repetitive UI validation tasks
- reduce manual testing effort
- improve regression coverage for business-critical workflows
- generate clear test reports for debugging and analysis

## Project Overview

This automation suite is structured to:

- test end-to-end user journeys through the application
- follow the Page Object Model (POM) for cleaner and reusable test code
- manage shared test data through fixtures and utility modules
- produce detailed HTML, Allure, and custom metric reports after execution

## Current Project Structure

- `package.json` - project metadata, dependencies, and npm scripts
- `playwright.config.js` - Playwright configuration for browser setup, retries, reporters, and artifacts
- `tests/` - test suites grouped by feature area
  - `tests/Login/login.spec.js`
  - `tests/auctions.spec.js`
  - `tests/CreateBids/createBidsRFP.spec.js`
  - `tests/CreateBids/createbidsRFQ.spec.js`
  - `tests/CreateBids/createDirectBid.spec.js`
  - `tests/ApprovalFlow/approval.spec.js`
  - `tests/PurchaseRequisition/createPR.spec.js`
  - `tests/EndtoEnd_test/PR-Bid.spec.js`
- `pages/` - page object classes that encapsulate locators and UI actions
  - `pages/Login/login.page.js`
  - `pages/auctions.page.js`
  - `pages/Bids/`
  - `pages/Approvals/`
  - `pages/PurchaseRequisition/`
- `fixtures/` - JSON files containing reusable test data such as credentials and auction settings
- `utils/` - helper modules such as `JsonWriter.js` and `TestDataGenerator1.js`
- `reporter/` - custom reporting logic for metrics
- `test-results/` - generated artifacts including screenshots, videos, and traces
- `playwright-report/` - HTML report output for test execution

## Setup

1. Install project dependencies:

```bash
npm install
```

2. Install Playwright browser binaries:

```bash
npx playwright install
```

## Running Tests

Run the complete suite:

```bash
npm test
```

Run tests in headed mode:

```bash
npm run test:headed
```

Run tests in debug mode:

```bash
npm run test:debug
```

Open the generated HTML report:

```bash
npm run test:report
```

## Project Conventions

- Tests are written under the `tests/` folder using Playwright's JavaScript `test` API.
- UI interactions and selectors are abstracted in page object files located under `pages/`.
- Shared data is stored in `fixtures/` and reused through utility helpers in `utils/`.
- Chromium is used as the default browser project, and screenshots, videos, and traces are captured for failed or retried tests.

## Important Notes

- The main Playwright configuration is defined in `playwright.config.js`.
- Custom reporting is implemented through `reporter/MetricReporter.js`.
- Test reports and artifacts are generated in `playwright-report/` and `test-results/` respectively.

## Troubleshooting

- If browser binaries are missing, run `npx playwright install`.
- If you want to review execution details, open the HTML report from `playwright-report/`.
- If a test fails, inspect the captured artifacts under `test-results/` for screenshots, traces, and videos.
