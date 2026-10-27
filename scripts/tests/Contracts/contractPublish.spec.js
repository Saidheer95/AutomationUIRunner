const { test } = require('@playwright/test');
const Contract_publish=require('../../pages/contractReview/contract_publish.page');
const {LoginPage,loadCredentials}=require('../../pages/Login/login.page');
const testdata=require('../../testdata.json');

test.describe('Create Contract Flow',()=>{
    test.beforeEach(async({page})=>{
        const loginPage=new LoginPage(page); 
        const credentials = loadCredentials();
        await page.goto(credentials.loginUrl);
        await loginPage.login(credentials.buyer.email, credentials.buyer.password);
    });
    
    test('should navigate to create contract and search for the PR number',async({page})=>{
        const contract_publish_page=new Contract_publish(page);
        await contract_publish_page.supplierPublish(testdata);
        console.log(`Searching for Contract Number: ${testdata.contractNumber}`);

        
    });
})