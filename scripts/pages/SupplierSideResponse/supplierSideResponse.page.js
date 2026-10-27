class SupplierResponse{
    constructor(page){
        this.page=page;
        this.clickBids='[data-testid="nav-bids"]';
        this.searchBids='[data-testid="input-search-pending"]';
        this.enterAcknowldege='[data-testid="button-acknowledge"]';
        this.selectType='[data-testid="select-ack-type"]';
        this.enterBuyerNotes='[data-testid="textarea-ack-notes"]';
        this.selectTermsAndConditions='[data-testid="checkbox-ack-terms"]';
        this.finalAcknowledge='[data-testid="button-submit-ack"]';
        this.bidResponseNo='[data-testid="input-search-suppbids"]';
    }
    async submitResponse(testData){
        await this.page.click(this.clickBids);
        const bidSearch = this.page.locator(this.searchBids);
        await bidSearch.fill(testData.supplierBid.bidNumber);  
       
        const bidNumber=this.page.getByText(testData.supplierBid.bidNumber,{exact:true});
        await bidNumber.waitFor({state:'visible'});
        await bidNumber.click();

        await this.page.click(this.enterAcknowldege);
        await this.page.click(this.selectType);
        await this.page.getByRole('option',{ name:testData.supplierBid.typeAction,exact:true}).click();
        await this.page.fill(this.enterBuyerNotes,testData.supplierBid.buyerNotes);
        await this.page.click(this.selectTermsAndConditions);
        await this.page.click(this.finalAcknowledge);    
          


    }
}
module.exports = SupplierResponse;