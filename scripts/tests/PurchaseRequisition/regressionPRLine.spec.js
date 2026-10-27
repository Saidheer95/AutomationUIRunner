const { test, expect } = require('@playwright/test');

const Purchase_Requisitions =
    require('../../pages/PurchaseRequisition/purchaserequisition.page');

const Add_Pr_Line =
    require('../../pages/PurchaseRequisition/addPrLine.page');

const { LoginPage, loadCredentials } =
    require('../../pages/Login/login.page');

const testData =
    require('../../testdata.json');

test.describe('Purchase Requisition - Add Line Regression', () => {

    let credentials;

    test.beforeEach(async ({ page }) => {

        const loginPage =
            new LoginPage(page);

        credentials =
            loadCredentials();

        await page.goto(credentials.loginUrl);

        await loginPage.login(
            credentials.requestor.email,
            credentials.requestor.password
        );
    });

    test.afterEach(async ({ page }) => {
        const addPrLinePage =
            new Add_Pr_Line(page);

        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        const loginPage =
            new LoginPage(page);

        await addPrLinePage.closeAddLine();

        await purchaseRequisitionPage.closeCreatePR();

        await loginPage.logout();
    });

    test('PR-LINE-001 - Open Add Line', async ({ page }) => {

        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        const addPrLinePage =
            new Add_Pr_Line(page);

        await purchaseRequisitionPage
            .createPurchaseRequisitionPage(testData);

        await addPrLinePage.openAddLine();

        await expect(
            page.locator(addPrLinePage.saveLineButton)
        ).toBeVisible();
    });

    test('PR-LINE-002 - Select Product', async ({ page }) => {

        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        const addPrLinePage =
            new Add_Pr_Line(page);

        await purchaseRequisitionPage
            .createPurchaseRequisitionPage(testData);

        await addPrLinePage.openAddLine();

        await addPrLinePage.selectRandomProduct();
    });

    test('PR-LINE-003 - Enter Quantity', async ({ page }) => {
        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        const addPrLinePage =
            new Add_Pr_Line(page);

        await purchaseRequisitionPage
            .createPurchaseRequisitionPage(testData);

        await addPrLinePage.openAddLine();

        await addPrLinePage.selectRandomProduct();

        await addPrLinePage.enterQuantity(
            testData.addLine.quantity
        );

        await expect(
            page.locator(addPrLinePage.quantityInput)
        ).toHaveValue(
            String(testData.addLine.quantity)
        );
    });

    test('PR-LINE-004 - Select UOM', async ({ page }) => {
        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        const addPrLinePage =
            new Add_Pr_Line(page);

        await purchaseRequisitionPage
            .createPurchaseRequisitionPage(testData);

        await addPrLinePage.openAddLine();

        await addPrLinePage.selectRandomProduct();

        await addPrLinePage.selectRandomUOM();

        await expect(
            page.locator(addPrLinePage.uomSelect)
        ).toBeVisible();
    });

    test('PR-LINE-005 - Enter Unit Price', async ({ page }) => {

        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        const addPrLinePage =
            new Add_Pr_Line(page);

        await purchaseRequisitionPage
            .createPurchaseRequisitionPage(testData);

        await addPrLinePage.openAddLine();

        await addPrLinePage.selectRandomProduct();

        await addPrLinePage.enterQuantity(
            testData.addLine.quantity
        );

        await addPrLinePage.selectRandomUOM();

        await addPrLinePage.enterPrice(
            testData.addLine.price
        );

        await expect(
            page.locator(addPrLinePage.priceInput)
        ).toHaveValue(
            String(testData.addLine.price)
        );
    });

    test('PR-LINE-006 - Add valid line item', async ({ page }) => {

        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        const addPrLinePage =
            new Add_Pr_Line(page);

        await purchaseRequisitionPage
            .createPurchaseRequisitionPage(testData);

        await addPrLinePage.addPurchaseRequisitionLine(
            testData
        );

        await expect(
            page.locator(addPrLinePage.addLineButton)
        ).toBeVisible();
    });

    test('PR-LINE-007 - Add multiple line items', async ({ page }) => {

        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        const addPrLinePage =
            new Add_Pr_Line(page);

        await purchaseRequisitionPage
            .createPurchaseRequisitionPage(testData);

        for (let i = 0; i < 3; i++) {

            await addPrLinePage
                .addPurchaseRequisitionLine(testData);
        }

        await expect(
            page.locator(addPrLinePage.addLineButton)
        ).toBeVisible();
    });
});