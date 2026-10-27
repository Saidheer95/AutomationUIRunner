const { test } = require('@playwright/test');
const Purchase_Requisitions = require('../../pages/PurchaseRequisition/purchaserequisition.page');
const Add_Pr_Line = require('../../pages/PurchaseRequisition/addPrLine.page');
const Submit_Approval = require('../../pages/PurchaseRequisition/purchasesubmit_approval.page');
const { LoginPage, loadCredentials } = require('../../pages/Login/login.page');
const testData = require('../../testdata.json');

test.describe('Purchase Requisition Page', () => {

    test('Create PROne', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const credentials = loadCredentials();

        console.log('========================================');
        console.log('        PR CREATION STARTED');
        console.log('========================================');

        await page.goto(credentials.loginUrl);

        await loginPage.login(
            credentials.requestor.email,
            credentials.requestor.password
        );

        console.log('Requestor login successful.');

        const purchaseRequisitionPage =
            new Purchase_Requisitions(page);

        const addPrLinePage =
            new Add_Pr_Line(page);

        const submitApprovalPage =
            new Submit_Approval(page);

        await purchaseRequisitionPage.createPurchaseRequisitionPage(testData);

        for (let i = 0; i < 3; i++) {
            console.log(`Adding line ${i + 1}...`);

            await addPrLinePage.addPurchaseRequisitionLine(testData);
        }

        await submitApprovalPage.submitForApproval();

        const prNumber =
            await purchaseRequisitionPage.getPRNumber();

        console.log(`PR Number confirmed: ${prNumber}`);

        console.log('========================================');
        console.log(`PR CREATION COMPLETED: ${prNumber}`);
        console.log('========================================');

        await loginPage.logout();

        console.log('Requestor logged out successfully.');
    });
});