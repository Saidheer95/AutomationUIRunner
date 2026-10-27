const { test } = require('@playwright/test');
const Create_Direct_Bid = require('../../pages/Bids/DirectBid.page');
const Add_Line = require('../../pages/Bids/AddBidRFQ.page');
const { LoginPage, loadCredentials } = require('../../pages/Login/login.page');
const testdata = require('../../testdata.json');
test.describe('Create Bid Flow', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const credentials = loadCredentials();
        await page.goto(credentials.loginUrl);
        await loginPage.login(credentials.buyer.email, credentials.buyer.password);
    });

    test('Direct Bid Creation', async ({ page }) => {
        const create_direct_bid_page = new Create_Direct_Bid(page);
        await create_direct_bid_page.bidDirectPage(testdata);
        const add_bid_line_page = new Add_Line(page);     
        await add_bid_line_page.addBidLine(testdata);
        console.log("Bid Line added successfully");
        // console.log(`Quantity: ${testdata.addLine.quantity}`);
        // console.log(`Price: ${testdata.addLine.price}`);

    });

    test.afterEach(async({page})=>{
        const loginPage = new LoginPage(page);
        loginPage.logout();
    });
})