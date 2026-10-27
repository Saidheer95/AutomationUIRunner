const { test } = require('@playwright/test');
const {LoginPage,loadCredentials}=require('../../pages/Login/login.page');
const Create_Delivery_Note=require('../../pages/Supplier/raiseDeliveryNote.page');

const testData=require('../../testdata.json');

test.describe('Raise Delivery Note',()=>{
    test.beforeEach(async({page})=>{
        const loginPage=new LoginPage(page); 
        const credentials = loadCredentials();
        await page.goto(credentials.loginUrl);
        await loginPage.login(credentials.supplier.email, credentials.supplier.password);
    });


    test("Should Raise the Delivery Note",async({page})=>{
        const create_delivery_note_page=new Create_Delivery_Note(page);
        await create_delivery_note_page.CreateDeliveryNote(testData);
        
    
    })
});