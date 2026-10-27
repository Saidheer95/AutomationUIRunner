const { test, expect } = require('@playwright/test');
const Create_Contract_PR = require('../../pages/PR_BID/contract.page');
const { LoginPage, loadCredentials } = require('../../pages/Login/login.page');
const testdata = require('../../testdata.json');

test.describe('Create Contract Flow', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const credentials = loadCredentials();
        console.log(`Opening login URL: ${credentials.loginUrl}`);
        await page.goto(credentials.loginUrl);
        await loginPage.login(
            credentials.buyer.email,
            credentials.buyer.password
        );
        console.log('Buyer login successful.');
    });
    test(
        'should navigate to create contract and search for the PR number',
        async ({ page }) => {
            const createContractPage =
                new Create_Contract_PR(page);
            await createContractPage.createContractPR(
                testdata
            );
            const contractNumber =
                await createContractPage.getContractNumber();

            console.log(
                `Contract Number Saved: ${contractNumber}`
            );
            // Optional assertion
            expect(contractNumber).toBeTruthy();
        }
    );
});