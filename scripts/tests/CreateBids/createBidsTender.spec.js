const { test } = require('@playwright/test');
const Create_Bid_Tender=require('../../pages/PR_BID/bidsTender.page');
const {LoginPage,loadCredentials}=require('../../pages/Login/login.page');
const testData=require('../../testdata.json');
test.describe('Create Bid Flow',()=>{
    test.beforeEach(async({page})=>{
        const loginPage=new LoginPage(page); 
        const credentials = loadCredentials();
        await page.goto(credentials.loginUrl);
        await loginPage.login(credentials.buyer.email, credentials.buyer.password);
    });
    
    test('should navigate to create bid and search for the PR number',async({page})=>{
        const create_bid_page=new Create_Bid_Tender(page);
        await create_bid_page.createBidTender(testData);
        console.log(`Searching for PR Number: ${testData.addLine.prNumber}`);
    });
})

