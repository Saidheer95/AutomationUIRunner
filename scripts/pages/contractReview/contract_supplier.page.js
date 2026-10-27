class SupplierAcceptPage {
    constructor(page) {
        this.page = page;
        this.contractNavigationTab = '[data-testid="nav-contracts"]';
        this.searchContract = '[data-testid="input-search-open"]';
        this.confirm = '[data-testid="button-submit-acceptance"]';
        this.finalConfirm='[data-testid="button-confirm-submit-acceptance"]'
    }

    async submitSupplier(testdata) {
        await this.page.pause();
        await this.page.click(this.contractNavigationTab);
        await this.page.fill(this.searchContract, testdata.contractNumber);

        const contractNumber = this.page.getByText(testdata.contractNumber);
        await contractNumber.waitFor({ state: 'visible' });
        await contractNumber.click();

        await this.page.click(this.confirm);

        await this.page.click(this.finalConfirm);
    }

} module.exports = SupplierAcceptPage;