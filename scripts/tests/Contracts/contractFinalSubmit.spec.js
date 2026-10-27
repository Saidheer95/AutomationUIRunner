const { test } = require('@playwright/test');
const Contract_submit=require('../../pages/contractReview/contract_publish_approval.page');
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
        const contract_final_sunmit_page=new Contract_submit(page);
        await contract_final_sunmit_page.submitContract(testdata);
        console.log(`Searchincontract_final_sunmit_pageg for Contract Number: ${testdata.contractNumber}`);

        
    });
})