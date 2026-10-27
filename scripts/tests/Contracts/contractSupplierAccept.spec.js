const { test } = require('@playwright/test');
const Contract_Supplier_tes=require('../../pages/contractReview/contract_supplier.page');
const {LoginPage,loadCredentials}=require('../../pages/Login/login.page');
const testdata=require('../../testdata.json');
const JsonWriter = require('../../utils/JsonWriter');

test.describe('Create Contract Flow',()=>{
    test.beforeEach(async({page})=>{
        const loginPage=new LoginPage(page); 
        const credentials = loadCredentials();
        await page.goto(credentials.loginUrl);
        await loginPage.login(credentials.supplier.email, credentials.supplier.password);
    });
    
    test('should navigate to create contract and search for the PR number',async({page})=>{
        const contract_reviewer_page=new Contract_Supplier_tes(page);
        await contract_reviewer_page.submitSupplier(testdata);
        console.log(`Searching for Contract Number: ${testdata.contractNumber}`);

        
    });
})

