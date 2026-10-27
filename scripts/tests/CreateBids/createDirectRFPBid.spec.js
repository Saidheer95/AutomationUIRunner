const { test } = require('@playwright/test');
const Create_Direct_Bid_RFP = require('../../pages/Bids/DirectBid.page');
const Add_RFP_Line = require('../../pages/Bids/AddBidRFP.page');
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

    test('Direct Bid Creation', async ({ page }) => {
        const create_direct_RFP_page = new Create_Direct_Bid_RFP(page);

        console.time('bidDirectPage');
        await create_direct_RFP_page.bidDirectPage(testdata);
        console.timeEnd('bidDirectPage');

        const add_bid_line_page = new Add_RFP_Line(page);  
        console.time('addBidRFPLine');
        await add_bid_line_page.addBidRFPLine(testdata);
        console.timeEnd('addBidRFPLine');
        console.log("Bid Line added successfully");
       
    });

    // test.afterEach(async({page})=>{
    //     const loginPage = new LoginPage(page);
    //     console.time('logout');

    //     loginPage.logout();

    //     console.timeEnd('logout');

    // });
})