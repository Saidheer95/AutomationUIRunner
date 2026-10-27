class auctionpage{
    constructor(page){
        this.page=page;
        this.auctionLink="span:has-text('Auctions')";
        this.createAuction="button:has-text('New Auction')";
        this.selectAuctionType="label:has-text('Auction Type')";
        this.enterAuctionName="input[placeholder='Enter auction name']";
        this.selectAuctionTemplate="#select-template";
        this.selectAddline="button:has-text('Add row')";
        this.enterQuantity="input[placeholder='Quantity']";
        this.selectUom="span:has-text('UOM')";
        this.selectDelivery="span:has-text('Select')";
        this.selectType="label:has-text('Serial Auction')";
        this.selectAuctionStrategy="input[name='auction-stratergy']";
        this.enterAuctionDuration="input[type='number']";
        this.deliveryDate="input[id='selectedDeliveryDate']";
        this.enterPrice="input[placeholder='Enter price']";
        this.allotmentType="input[name='allotment']";
        this.selectSupplier="button:has-text('suppliers')";
        this.searchSuppliers="input[placeholder='Search...']";
        
        
    }

    async createAuctionPage(testData) {
        await this.page.pause(); // Wait for the dropdown to appear
        await this.page.click(this.auctionLink);
        await this.page.click(this.createAuction);
        await this.page.click(this.selectAuctionType);
        const auctionTypeOption = await this.page.locator(`span:has-text("${testData.auctionType}")`);
        await auctionTypeOption.click();
        console.log(`Selected auction type: ${testData.auctionType}`);
        const printauction=await this.page.fill(this.enterAuctionName, testData.auctionName);
        await this.page.keyboard.press('Tab');
        console.log(`Entered auction name: ${testData.auctionName}`);
        await this.page.click(this.selectAuctionTemplate);
        const templateOption = await this.page.locator(`span:has-text("${testData.templateName}")`);
        await templateOption.click();
        console.log(`Selected auction template: ${testData.templateName}`);
        // await this.page.click(this.selectAddline);
        await this.page.fill(this.enterQuantity, '100');  
        await this.page.click(this.selectUom);
        const uomOption = await this.page.locator(`span:has-text("${testData.UOM}")`);
        console.log(`Selected UOM: ${testData.UOM}`);
        await uomOption.waitFor({ state: 'visible' });
        await uomOption.click();

        await this.page.click(this.selectDelivery);
        const deliveryOption = await this.page.locator(`span:has-text("${testData.delivery}")`);
        await deliveryOption.click();
        console.log(`Selected delivery: ${testData.delivery}`); 
        await this.page.click(this.selectType);
        await this.page.fill(this.selectAuctionStrategy, 'Open Auction');
        await this.page.fill(this.enterAuctionDuration, '60');
        await this.page.fill(this.deliveryDate, '2024-06-30');
        await this.page.click(this.allotmentType);
        await this.page.click(this.selectSupplier);
        await this.page.fill(this.searchSuppliers, 'Supplier Name');  

    }
}module.exports = auctionpage;