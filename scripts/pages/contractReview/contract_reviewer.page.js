const { expect } = require('@playwright/test');


class ReviewerPage {
    constructor(page) {
        this.page = page;
        this.contractNavigationLink = '[data-testid="nav-contracts-group"]';
        this.contractNavigationTab = '[data-testid="nav-contracts"]';
        this.draftTab = '[data-testid="tab-draft-contracts"]';
        this.searchContract = '[data-testid="input-search-drafts"]';
        this.contractPreviewTab = '[data-testid="button-view-toggle"]';
        this.clausesTab = '[data-testid="tab-clauses"]';
        this.saveChanges = '[data-testid="button-save-clauses"]';
        this.reviewActions = '[data-testid="button-review-actions"]';
        this.confirm = '[data-testid="button-confirm-accept-review"]';
    }

    async submitReview(testdata) {
        await this.page.click(this.contractNavigationLink);
        await this.page.click(this.contractNavigationTab);
        await this.page.click(this.draftTab);
        await this.page.fill(this.searchContract, testdata.contractNumber);

        const contractNumber = this.page.getByText(
            testdata.contractNumber,
            { exact: true }
        );

        await contractNumber.waitFor({ state: 'visible' });
        await contractNumber.click();

        await this.page.click(this.contractPreviewTab);

        const tabClauses = this.page.locator(this.clausesTab);

        await tabClauses.waitFor({ state: 'visible' });
        await tabClauses.scrollIntoViewIfNeeded();
        await tabClauses.click();

        const descriptionField = this.page
            .locator('[contenteditable="true"][data-placeholder="Click here to start editing..."]')
            .last();

        await descriptionField.waitFor({ state: 'visible' });
        await descriptionField.click();

        await this.page.keyboard.press('Control+End');

        await descriptionField.fill(
            testdata.updateClauses.editdescription
        );

        // Wait for Save Changes to appear/become enabled
        const saveChangesButton = this.page.locator(this.saveChanges);

        await saveChangesButton.waitFor({ state: 'visible' });
        await expect(saveChangesButton).toBeEnabled();

        await saveChangesButton.click();

        // Wait for save operation to complete before continuing
        await this.page.waitForLoadState('networkidle');

        await this.page.click(this.reviewActions);

        await this.page.getByTestId('menuitem-accept-review').click();

        await this.page.click(this.confirm);
    }


} module.exports = ReviewerPage;