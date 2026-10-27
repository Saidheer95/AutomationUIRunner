const { test } = require('@playwright/test');
const Auctions  = require('../pages/auctions.page');
const { LoginPage, loadCredentials } = require('../pages/Login/login.page');

const testData = require('../testdata.json');


test.describe('Auction Page', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const { loginUrl, email, password } = loadCredentials();
        await page.goto(loginUrl);
        await loginPage.login(email, password);
    });

    test('should create a new auction', async ({ page }) => {
        const auction_page = new Auctions(page);
        await auction_page.createAuctionPage(testData);
        // Add assertions to verify that the auction was created successfully.
    });
})
