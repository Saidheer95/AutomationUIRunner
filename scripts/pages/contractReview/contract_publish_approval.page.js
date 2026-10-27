class FinalContractSubmitPage {
    constructor(page) {
        this.page = page;
        this.contractNavigationLink = '[data-testid="nav-contracts-group"]';
        this.contractNavigationTab = '[data-testid="nav-contracts"]';
        this.publishedTab = '[data-testid="tab-published-contracts"]';
        this.searchContract = '[data-testid="input-search-contracts"]';
        this.submitForApproval = '[data-testid="button-submit-for-approval"]';
        this.finalSubmit='[data-testid="button-confirm-submit-for-approval"]';


    }

    async submitContract(testdata) {
        await this.page.click(this.contractNavigationLink);
        await this.page.click(this.contractNavigationTab);
        await this.page.click(this.publishedTab);
        await this.page.fill(this.searchContract, testdata.contractNumber);

        const contractNumber = this.page.getByText(
            testdata.contractNumber
            
        );

        await contractNumber.waitFor({ state: 'visible' });
        await contractNumber.click();

       
        await this.page.click(this.submitForApproval);
        await this.page.click(this.finalSubmit);
    }


} module.exports = FinalContractSubmitPage;