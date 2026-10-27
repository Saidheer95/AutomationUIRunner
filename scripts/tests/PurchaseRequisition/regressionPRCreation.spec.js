const { test, expect } = require('@playwright/test');
const Purchase_Requisitions = require('../../pages/PurchaseRequisition/purchaserequisition.page');
const { LoginPage, loadCredentials } = require('../../pages/Login/login.page');
const testData = require('../../testdata.json');

test.describe('Purchase Requisition - Header Level Regression', () => {

    let credentials;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        credentials = loadCredentials();

        await page.goto(credentials.loginUrl);

        await loginPage.login(
            credentials.requestor.email,
            credentials.requestor.password
        );
    });  

    test('PR-HDR-001 - Navigate to Create PR page', async ({ page }) => {
        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        await purchaseRequisitionPage.navigateToCreatePR();

        await expect(
            page.locator(
                purchaseRequisitionPage.enterPrDescription
            )
        ).toBeVisible();
    });

    test('PR-HDR-002 - Enter PR description', async ({ page }) => {
        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        await purchaseRequisitionPage.navigateToCreatePR();

        const description = `Regression PR ${Date.now()}`;

        await purchaseRequisitionPage.enterDescription(
            description
        );

        await expect(
            page.locator(
                purchaseRequisitionPage.enterPrDescription
            )
        ).toHaveValue(description);
    });

    test('PR-HDR-003 - Select Business Entity', async ({ page }) => {
        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        await purchaseRequisitionPage.navigateToCreatePR();

        await purchaseRequisitionPage.selectBusinessEntity(
            testData.createPurchaseRequisition.businessEntity
        );
    });

    test('PR-HDR-004 - Enter Need By Date', async ({ page }) => {
        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        await purchaseRequisitionPage.navigateToCreatePR();

        const date =
            purchaseRequisitionPage.getTomorrowDate();

        await purchaseRequisitionPage.enterNeedByDate(date);

        await expect(
            page.locator(
                purchaseRequisitionPage.needByDate
            )
        ).toHaveValue(date);
    });

    test('PR-HDR-005 - Select Delivery Location', async ({ page }) => {
        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        await purchaseRequisitionPage.navigateToCreatePR();

        await purchaseRequisitionPage.selectDeliveryLocation(
            testData.createPurchaseRequisition.deliveryLocation
        );
    });

    test('PR-HDR-006 - Select Buyer', async ({ page }) => {
        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        await purchaseRequisitionPage.navigateToCreatePR();

        await purchaseRequisitionPage.selectBuyer(
            testData.createPurchaseRequisition.buyer
        );
    });

    test('PR-HDR-007 - Select Currency', async ({ page }) => {
        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        await purchaseRequisitionPage.navigateToCreatePR();

        await purchaseRequisitionPage.selectCurrency(
            testData.createPurchaseRequisition.currency
        );
    });

    test('PR-HDR-008 - Select Budget', async ({ page }) => {
        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        await purchaseRequisitionPage.navigateToCreatePR();

        await purchaseRequisitionPage.selectBudget(
            testData.createPurchaseRequisition.budget
        );
    });

    test('PR-HDR-009 - Create PR with valid header fields', async ({ page }) => {
        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        await purchaseRequisitionPage.navigateToCreatePR();

        await purchaseRequisitionPage.fillHeaderFields(
            testData
        );

        await purchaseRequisitionPage.submitPR();

        const prNumber =
            await purchaseRequisitionPage.getPRNumber();

        expect(prNumber).toBeTruthy();

        console.log(`Created PR: ${prNumber}`);
    });
});