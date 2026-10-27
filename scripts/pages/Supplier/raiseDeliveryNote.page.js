const { TestDataGenerator1 } = require('../../utils/TestDataGenerator1');
class DeliveryNotes {
    constructor(page) {
        this.page = page;
        this.clickPurchaseOrder = page.getByRole('link', { name: 'Purchase Orders' });
        this.seachPurhcaseOrder = '[data-testid="input-search"]';
        this.clickAction = '[data-testid="button-supplier-po-response"]';
        this.clickAcceptReject = '[data-testid^="menu-item-supplier-"]';
        this.clickRaiseDN = '[data-testid="button-raise-dn"]';
        this.enterDN = '[data-testid="input-dn-asn"]';
        this.selectCarrier = '[data-testid="select-dn-carrier"]';
        this.selectShipdate = '[data-testid="input-dn-ship-date"]';
        this.selectArrivalDate = '[data-testid="input-dn-arrival-date"]';
        this.enterQuantity = '[data-testid="input-dn-qty-0"]';
        this.createDeliveryNote = '[data-testid="button-dn-submit"]'

    }

    async selectPOResponse(response) {
        await this.page.pause();
        await this.page.click(this.clickAction);
        const responseOption = this.page.getByTestId(`menu-item-supplier-${response.toLowerCase()}-po`);
        await responseOption.click();
    }
    async enterQuantities(quantities) {
        for (let i = 0; i < quantities.length; i++) {
            const quantityInput = this.page.getByTestId(
                `input-dn-qty-${i}`
            );

            await quantityInput.fill(String(quantities[i]));
        }
    }


    async CreateDeliveryNote(testData) {
        await this.clickPurchaseOrder.click();
        const poSearch = this.page.locator(this.seachPurhcaseOrder);
        await poSearch.fill(testData.purchaseOrder.poNumber);

        const poNumber = this.page.getByText(testData.purchaseOrder.poNumber, { exact: true });
        await poNumber.waitFor({ state: 'visible' });
        await poNumber.click();
        await this.selectPOResponse(testData.deliveryNote.response);
        await this.page.click(this.clickRaiseDN);
        // await this.page.locator(this.enterDN).fill(testData.deliveryNote.asn);
        // Enter DN / ASN
        await this.page
            .locator(this.enterDN)
            .fill(TestDataGenerator1.randomDNNumber());
        await this.page.click(this.selectCarrier);
        await this.page.getByText(testData.deliveryNote.carrier, { exact: true }).click();
        await this.page.locator(this.selectShipdate).fill(testData.deliveryNote.shipDate);
        await this.page.locator(this.selectArrivalDate).fill(testData.deliveryNote.arrivalDate);
        
        await this.enterQuantities(
            testData.deliveryNote.quantity
        );
        await this.page.click(this.createDeliveryNote);



    }
}
module.exports = DeliveryNotes;