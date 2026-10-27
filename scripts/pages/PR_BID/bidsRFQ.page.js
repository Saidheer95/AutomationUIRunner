const {generateRFQTestData} = require('../../utils/dataGenerator');
const JsonWriter = require('../../utils/JsonWriter');

class Bids{
    constructor(page){
        this.page=page;
        this.requisitionLink='[data-testid="nav-requisitions"]';
        this.searchPR='[data-testid="input-search-pr"]';
        this.selectBid='[data-testid="select-bid-type"]';
        this.selectOpenDate='[data-testid="input-bid-open-date"]';
        this.selectCloseDate='[data-testid="input-bid-close-date"]';
        this.submitBid='[data-testid="button-confirm-create-bid"]';
        this.tabSuppliers='[data-testid="tab-suppliers"]';
        this.clickSupplier='[data-testid="button-add-supplier"]';
        this.searchSupplier='[data-testid="input-search-supplier"]';
        this.finalInvite='[data-testid="button-invite-suppliers"]';
        this.clickTerms='[data-testid="tab-terms"]';
        this.clickAddTerms='[data-testid="button-add-clause"]';
        this.selectTermsType='[data-testid="select-clause-type"]';
        this.enterTermsDesciption='[data-testid="input-clause-desc"]';
        this.clauseSubmit='[data-testid="button-submit-clause"]';
        this.publishBid='[data-testid="button-publish-bid"]';
        this.finalBid='[data-testid="button-publish-confirm"]';
        this.bidNumber='[data-testid="text-bid-number"]';
    }

    async createBid(testData){
         const dynamicData = generateRFQTestData('RFQ');

        console.log('Generated Tender data:', dynamicData);


        await this.page.click(this.requisitionLink);

        await this.page.fill(this.searchPR,testData.addLine.prNumber);

        const clickButton=this.page.getByRole('button',{
            name:testData.createBidRFQ.type
        });

        await clickButton.click();

        await this.page.click(this.selectBid);

        const options=await this.page.locator('[role="option"]').allTextContents();

        console.log(options);

        await this.page.fill(this.selectOpenDate,dynamicData.openDate);
        await this.page.fill(this.selectCloseDate,dynamicData.closeDate);

        await this.page.getByText(testData.createBidRFQ.bidname).click();

        await this.page.click(this.submitBid);

        // Read and save BID Number immediately after BID creation
        const bidNumber=await this.getBIDNumber();

        console.log(`BID Number saved: ${bidNumber}`);

        // Continue with supplier configuration
        await this.page.click(this.tabSuppliers);

        await this.page.click(this.clickSupplier);

        await this.page.click(this.searchSupplier);

        const suppliers=testData.createBidRFQ.supplier.name;

        for(const supplier of suppliers){
            const searchBox=this.page.locator(this.searchSupplier);

            await searchBox.fill('');

            await searchBox.fill(supplier);

            await this.page.getByText(supplier,{
                exact:true
            }).waitFor();

            await this.page.getByRole('checkbox').first().check();
        }

        await this.page.click(this.finalInvite);

        // Continue with terms configuration
        await this.page.click(this.clickTerms);

        await this.page.click(this.clickAddTerms);

        await this.page.click(this.selectTermsType);

        await this.page.getByRole('option',{
            name:testData.createBidRFQ.termsType
        }).click();

        await this.page.fill(
            this.enterTermsDesciption,
            dynamicData.termsDescription
        );

        await this.page.click(this.clauseSubmit);

        // Publish only after BID Number has already been saved
        await this.page.click(this.publishBid);

        await this.page.click(this.finalBid);
    }

    async getBIDNumber(){
        const bidNumberLocator=this.page.locator(this.bidNumber);

        await bidNumberLocator.waitFor({
            state:'visible'
        });

        const bidNumberText=await bidNumberLocator.textContent();

        const bidNumber=bidNumberText?.trim();

        if(!bidNumber){
            throw new Error('BID number was not found on the page.');
        }

        console.log(`BID Number: ${bidNumber}`);

        JsonWriter.saveBIDNumber(bidNumber);

        return bidNumber;
    }
}

module.exports=Bids;