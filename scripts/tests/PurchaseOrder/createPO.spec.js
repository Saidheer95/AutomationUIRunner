const { test } = require('@playwright/test');
const {LoginPage,loadCredentials}=require('../../pages/Login/login.page');
const Create_Purchase_Order=require('../../pages/PR_PO/purchaseOrder.page');
const JsonWriter = require('../../utils/JsonWriter');

const testData=require('../../testdata.json');

test.describe('Create Purchase Order Flow',()=>{
    test.beforeEach(async({page})=>{
        const loginPage=new LoginPage(page); 
        const credentials = loadCredentials();
        await page.goto(credentials.loginUrl);
        await loginPage.login(credentials.buyer.email, credentials.buyer.password);
    });


    test("Should Create Purchase Order from PR",async({page})=>{
        const create_purchase_order_page=new Create_Purchase_Order(page);
        await create_purchase_order_page.createPurchaseOrder(testData);
        console.log(`Creating Purchase Order for PR Number: ${testData.addLine.prNumber}`);
        console.log(`Supplier Name: ${testData.createPurchaseOrder.supplierName}`);
        console.log(`Payment Terms: ${testData.createPurchaseOrder.paymentTerms}`);
        console.log(`Advance Payment: ${testData.createPurchaseOrder.advancePayment}`);

        // Read PR Number and save to JSON
        const poNumber = await create_purchase_order_page.getPONumber();

        console.log(`PO Number Saved: ${poNumber}`);


    })
});