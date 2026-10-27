const { test, expect } = require('@playwright/test');
const Create_Bid_RFP = require('../../pages/PR_BID/bidsRFP.page');
const { LoginPage, loadCredentials } = require('../../pages/Login/login.page');
const testData = require('../../testdata.json');

test.describe('RFP Regression Tests', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const credentials = loadCredentials();

        await page.goto(credentials.loginUrl);

        await loginPage.login(
            credentials.buyer.email,
            credentials.buyer.password
        );
    });

    test('RFP-REG-001 - should add RFP line items', async ({ page }) => {
        const rfpPage = new Create_Bid_RFP(page);

        await rfpPage.addRFPLineItems(testData);

        console.log('RFP line items added successfully');
    });

    test('RFP-REG-002 - should add suppliers', async ({ page }) => {
        const rfpPage = new Create_Bid_RFP(page);

        await rfpPage.addRFPLineItems(testData);
        await rfpPage.addSuppliers(testData);

        console.log('Suppliers added successfully');
    });

    test('RFP-REG-003 - should add evaluation criteria', async ({ page }) => {
        const rfpPage = new Create_Bid_RFP(page);

        await rfpPage.addRFPLineItems(testData);
        await rfpPage.addSuppliers(testData);
        await rfpPage.addEvaluationCriteria(testData);

        console.log('Evaluation criteria added successfully');
    });

    test('RFP-REG-004 - should add evaluation team', async ({ page }) => {
        const rfpPage = new Create_Bid_RFP(page);

        await rfpPage.addRFPLineItems(testData);
        await rfpPage.addSuppliers(testData);
        await rfpPage.addEvaluationCriteria(testData);
        await rfpPage.addEvaluationTeam(testData);

        console.log('Evaluation team added successfully');
    });

    test('RFP-REG-005 - should add terms and conditions', async ({ page }) => {
        const rfpPage = new Create_Bid_RFP(page);

        await rfpPage.addRFPLineItems(testData);
        await rfpPage.addSuppliers(testData);
        await rfpPage.addEvaluationCriteria(testData);
        await rfpPage.addEvaluationTeam(testData);
        await rfpPage.addTerms(testData);

        console.log('Terms and conditions added successfully');
    });

    test('RFP-REG-006 - should publish RFP successfully', async ({ page }) => {
        const rfpPage = new Create_Bid_RFP(page);

        await rfpPage.addRFPLineItems(testData);
        await rfpPage.addSuppliers(testData);
        await rfpPage.addEvaluationCriteria(testData);
        await rfpPage.addEvaluationTeam(testData);
        await rfpPage.addTerms(testData);
        await rfpPage.publishRFP();

        console.log('RFP published successfully');
    });

});