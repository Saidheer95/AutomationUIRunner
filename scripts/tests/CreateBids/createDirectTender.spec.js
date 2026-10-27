const { test } = require('@playwright/test');
const Create_Direct_Tender = require('../../pages/Bids/DirectBid.page');
const Add_Tender_Line = require('../../pages/Bids/AddBidTender.page');
const { LoginPage, loadCredentials } = require('../../pages/Login/login.page');
const testdata = require('../../testdata.json');
test.describe('Create Bid Flow', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const credentials = loadCredentials();
        console.time('login');
        await page.goto(credentials.loginUrl);
        await loginPage.login(credentials.buyer.email, credentials.buyer.password);
        console.timeEnd('login');

    });

    test('Direct Tender Creation', async ({ page }) => {
        const create_direct_tender_page = new Create_Direct_Tender(page);

        console.time('bidDirectTenderPage');
        await create_direct_tender_page.bidDirectPage(testdata);
        console.timeEnd('bidDirectTenderPage');

        const add_bid_line_page = new Add_Tender_Line(page);  
        console.time('createBidTender');
        await add_bid_line_page.createBidTender(testdata);
        console.timeEnd('createBidTender');
        console.log("Bid Line added successfully");
       
    });
})