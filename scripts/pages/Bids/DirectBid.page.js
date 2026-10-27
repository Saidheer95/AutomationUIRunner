const { expect } = require('@playwright/test');
const { assertVisible } = require('../../utils/assertions');
const { generateBidTestData } = require('../../utils/dataGenerator');

class DirectBid {
    constructor(page) {
        this.page = page;

        this.clickBid = '[data-testid="nav-bids"]';
        this.clickCreate = '[data-testid="button-create-bid"]';
        this.enterBidDescription = '[data-testid="input-bid-title"]';
        this.selectBidType = '[data-testid="select-bid-type"]';
        this.selectBusinessEntity = '[data-testid="select-pr-business-entity"]';
        this.selectBuyer = '[data-testid="select-bid-buyer"]';
        this.selectCurrency = '[data-testid="select-bid-currency"]';
        this.selectBidOpenDate = '[data-testid="input-bid-start-date"]';
        this.selectBidCloseDate = '[data-testid="input-bid-end-date"]';
        this.selectBidEnvelopeDate = '[data-testid="input-bid-env-open-date"]';
        this.selectPaymentTerms = '[data-testid="select-bid-payment-terms"]';

        this.selectDeliveryLocation =
            '[data-testid="select-bid-delivery-location"]';
        this.clickSave = '[data-testid="button-save-bid"]';
    }

    async selectDropdown(dropdownLocator, optionText) {

        const dropdown =
            typeof dropdownLocator === 'string'
                ? this.page.locator(dropdownLocator)
                : dropdownLocator;

        await dropdown.waitFor({ state: 'visible' });
        await dropdown.scrollIntoViewIfNeeded();
        await dropdown.click();

        const option = this.page.getByRole('option', {
            name: optionText.trim(),
            exact: true
        });

        await option.waitFor({ state: 'visible' });
        await option.scrollIntoViewIfNeeded();
        await option.click();
    }

    async bidDirectPage(testdata) {

        await this.page.pause();


        const dynamicData = generateBidTestData('Tender');


        // await this.page.pause();

        await this.page.click(this.clickBid);

        await assertVisible(
            this.page.locator(this.clickCreate)
        );

        await this.page.click(this.clickCreate);

        const descriptionInput = this.page.locator(
            this.enterBidDescription
        );

        await assertVisible(descriptionInput);

        await descriptionInput.fill(
            testdata.directBid.bidDescription
        );

        // Bid Type
        await this.selectDropdown(
            this.selectBidType,
            testdata.directBid.bidType
        );

        // Business Entity
        await this.selectDropdown(
            this.selectBusinessEntity,
            testdata.directBid.businessEntity
        );

        // Buyer
        await this.selectDropdown(
            this.selectBuyer,
            testdata.directBid.buyer
        );

        // Currency
        await this.selectDropdown(
            this.selectCurrency,
            testdata.directBid.currency
        );

        // // Current date & time
        // const dateTime = new Date();

        // // Add 5 minutes
        // dateTime.setMinutes(dateTime.getMinutes() + 5);

        // // Format to YYYY-MM-DDTHH:mm
        // const formattedDateTime =
        //     dateTime.toISOString().slice(0, 16);

        // const bidOpenDate = this.page.locator(
        //     this.selectBidOpenDate
        // );

        // await bidOpenDate.waitFor({
        //     state: 'visible'
        // });

        // await bidOpenDate.fill(formattedDateTime);

        // console.log(`Bid Open Date Time : ${formattedDateTime}`);

        await this.page.click(this.selectBidOpenDate);
        await this.page.fill(this.selectBidOpenDate, dynamicData.openDate);


        await this.page.click(this.selectBidCloseDate);
        await this.page.fill(this.selectBidCloseDate, dynamicData.closeDate);


        const envelopeOpenDate = this.page.locator(this.selectBidEnvelopeDate);
        await expect(envelopeOpenDate).toBeEnabled();


        console.log('Envelope Open Date:', dynamicData.envelopeOpenDate);

        await envelopeOpenDate.fill(dynamicData.envelopeOpenDate);

        await expect(envelopeOpenDate).toHaveValue(
            dynamicData.envelopeOpenDate
        );




        // Payment Terms
        await this.selectDropdown(
            this.selectPaymentTerms,
            testdata.directBid.paymentTerms
        );

        // Delivery Location
        await this.selectDropdown(
            this.selectDeliveryLocation,
            testdata.directBid.deliveryLocation
        );

        await this.page.click(this.clickSave);

    }
}

module.exports = DirectBid;