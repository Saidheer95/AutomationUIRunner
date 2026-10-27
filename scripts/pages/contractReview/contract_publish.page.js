class ContractPublishPage {
    constructor(page){
        this.page=page;
        this.contractNavigationLink='[data-testid="nav-contracts-group"]';
        this.contractNavigationTab='[data-testid="nav-contracts"]';
        this.draftTab='[data-testid="tab-draft-contracts"]';
        this.searchContract='[data-testid="input-search-drafts"]';
        this.clausesTab='[data-testid="tab-clauses"]';
        this.clickAccept='[data-testid="button-accept-all-changes"]';
        this.publishSupplier='[data-testid="button-publish-contract"]';
        this.finalPublish='[data-testid="button-confirm-publish"]';
    }

async supplierPublish(testdata){
    await this.page.click(this.contractNavigationLink);
    await this.page.click(this.contractNavigationTab);
    await this.page.click(this.draftTab);
    await this.page.fill(this.searchContract, testdata.contractNumber);
    
    const contractNumber=this.page.getByText(testdata.contractNumber);
    await contractNumber.waitFor({state:'visible'});
    await contractNumber.click();

    const tabClauses = this.page.locator(this.clausesTab);

        // Wait for the tab to exist
        await tabClauses.waitFor({ state: 'visible' });

        // Scroll the Clauses tab into the viewport
        await tabClauses.scrollIntoViewIfNeeded();

        // Click Clauses tab
        await tabClauses.click();

    await this.page.click(this.clickAccept);

    await this.page.click(this.publishSupplier);

    await this.page.click(this.finalPublish);
    }

}module.exports=ContractPublishPage;