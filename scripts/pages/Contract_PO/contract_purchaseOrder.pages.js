class FinalContractSubmitPage {
    constructor(page) {
        this.page = page;
        this.contractNavigationLink = '[data-testid="nav-contracts-group"]';
        this.contractNavigationTab = '[data-testid="nav-contracts"]';
        this.publishedTab = '[data-testid="tab-published-contracts"]';
        this.searchContract = '[data-testid="input-search-contracts"]';
        this.selectLines='[data-testid^="contract-to-po-line-test"]';
        this.selectAdvance='[data-testid="checkbox-advance-flag-po"]';
        this.enterAdvancePercentage='[data-testid="input-advance-percentage-po"]';
        this.clickCreatePO='[data-testid="button-create-po-from-contract-submit"]';
        this.submitFinalPO='[data-testid="button-submit-approval"]';


    }

    async submitContract(testdata) {
        await this.page.click(this.contractNavigationLink);
        await this.page.click(this.contractNavigationTab);
        await this.page.click(this.publishedTab);
        await this.page.fill(this.searchContract, testdata.contractNumber);
        const clickButton = await this.page.getByRole('button', { name: testdata.createBidRFP.type });
        await clickButton.click();

        const checkboxes = this.page.locator(this.selectLines);
        const lineCount = await checkboxes.count();
        for (let i = 0; i < lineCount; i++) {
            const checkbox = checkboxes.nth(i);
            if (!(await checkbox.isChecked())) {
                await checkbox.check();
            }
        }

        await this.page.click(this.selectAdvance);

        await this.page.fill(this.enterAdvancePercentage);

        await this.page.click(this.clickCreatePO);    
       
    }


} module.exports = FinalContractSubmitPage;