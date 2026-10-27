const { expect } = require('@playwright/test');

class AddRFPLine {
    constructor(page) {
        this.page = page;
        this.clickAddLine = page.getByRole("button", { name: "Add Line" });
        this.selectItem = '[data-testid="select-line-item"]';
        this.selectLineType = '[data-testid="select-linetype"]';
        this.enterQuantity = '[data-testid="input-line-quantity"]';
        this.selectUOM = '[data-testid="select-line-uom"]';
        this.enterUnitPrice = '[data-testid="input-line-price"]';
        this.clickAdd = '[data-testid="button-submit-line"]';

        // Locators for the suppliers tab
        this.tabSuppliers = '[data-testid="tab-suppliers"]';
        this.clickSupplier = '[data-testid="button-add-supplier"]';
        this.searchSupplier = '[data-testid="input-search-supplier"]';
        this.finalInvite = '[data-testid="button-invite-suppliers"]';

        // Criteria locators
        this.evaluationCriteriaTab = '[data-testid="tab-criteria"]';
        this.addCriteria = '[data-testid="button-add-criteria"]';
        this.selectCategory = '[data-testid="select-criteria-category"]';
        this.enterCriteriaDescription = '[data-testid="input-criteria-question"]';
        this.selectCriteriaValue = '[data-testid="select-criteria-option"]';
        this.selectValueType = '[data-testid="select-criteria-valuetype"]';
        this.enterCriteriaValue = '[data-testid="input-criteria-weight"]';
        this.submitCriteria = '[data-testid="button-submit-criteria"]';

        // Evaluation team locators
        this.selectEvaluationTeam = '[data-testid="tab-team"]';
        this.selectTechnicalTeam = '[data-testid="button-select-member-technical-review-team"]';
        this.searchTechnicalTeam = '[data-testid="input-search-member-technical-review-team"]';
        this.selectCommercialTeam = '[data-testid="button-select-member-commercial-review-team"]';
        this.searchCommercialTeam = '[data-testid="input-search-member-commercial-review-team"]';

        // Terms and publish locators
        this.clickTerms = '[data-testid="tab-terms"]';
        this.clickAddTerms = '[data-testid="button-add-clause"]';
        this.selectTermsType = '[data-testid="select-clause-type"]';
        this.enterTermsDesciption = '[data-testid="input-clause-desc"]';
        this.clauseSubmit = '[data-testid="button-submit-clause"]';
        this.publishBid = '[data-testid="button-publish-bid"]';
        this.finalBid = '[data-testid="button-publish-confirm"]';
    }

    async selectRandomProduct() {
        const itemElement = this.page.locator(this.selectItem);
        await expect(itemElement).toBeVisible();
        await itemElement.click();

        const options = this.page.locator('[role="option"]');
        await expect(options.first()).toBeVisible();

        const count = await options.count();
        const randomIndex = Math.floor(Math.random() * count);
        await options.nth(randomIndex).click();
    }

    async selectDropdown() {
        const uomElement = this.page.locator(this.selectUOM);
        await expect(uomElement).toBeVisible();
        await uomElement.click();

        const options = this.page.locator('[role="option"]');
        await expect(options.first()).toBeVisible();

        const count = await options.count();
        const randomIndex = Math.floor(Math.random() * count);
        await options.nth(randomIndex).click();
    }

    async addBidRFPLine(testdata) {
        for (let i = 0; i <= 3; i++) {
            // await expect(this.clickAddLine).toBeVisible();
            // await expect(this.clickAddLine).toBeEnabled();
            await this.clickAddLine.click();

            // Fill form
            await this.selectRandomProduct();

            // Fixed: Removed invalid 2nd argument in page.click()
            const lineTypeDropdown = this.page.locator(this.selectLineType);
            await expect(lineTypeDropdown).toBeVisible();
            await lineTypeDropdown.click();

            const lineTypeOption = this.page.getByRole('option', { name: testdata.addLine.lineType }).first();
            await expect(lineTypeOption).toBeVisible();
            await lineTypeOption.click();

            const quantityInput = this.page.locator(this.enterQuantity);
            await expect(quantityInput).toBeVisible();
            await quantityInput.fill(String(testdata.addLine.quantity));

            await this.selectDropdown();

            const priceInput = this.page.locator(this.enterUnitPrice);
            await expect(priceInput).toBeVisible();
            await priceInput.fill(String(testdata.addLine.price));

            const addButton = this.page.locator(this.clickAdd);
            await expect(addButton).toBeVisible();
            await expect(addButton).toBeEnabled();
            await addButton.click();
        }

        // Suppliers section
        const suppliersTab = this.page.locator(this.tabSuppliers);
        await expect(suppliersTab).toBeVisible();
        await suppliersTab.click();

        const addSupplierBtn = this.page.locator(this.clickSupplier);
        await expect(addSupplierBtn).toBeVisible();
        await addSupplierBtn.click();

        const suppliers = testdata.createBidRFP.supplier.name;

        for (const supplier of suppliers) {
            const searchBox = this.page.locator(this.searchSupplier);
            await expect(searchBox).toBeVisible();
            await searchBox.fill('');
            await searchBox.fill(supplier);

            // Fixed: Scoped locator ensures the exact supplier row is loaded before checking
            const supplierRow = this.page.locator('tr, li, div').filter({ hasText: supplier }).first();
            await expect(supplierRow).toBeVisible();
            await supplierRow.getByRole('checkbox').first().check();
        }

        const inviteBtn = this.page.locator(this.finalInvite);
        await expect(inviteBtn).toBeVisible();
        await expect(inviteBtn).toBeEnabled();
        await inviteBtn.click();

        // Evaluation criteria section
        const criteriaTab = this.page.locator(this.evaluationCriteriaTab);
        await expect(criteriaTab).toBeVisible();
        await criteriaTab.click();

        for (const category of testdata.createBidRFP.criteriaCategory.name) {
            const addCriteriaButton = this.page.locator(this.addCriteria);
            await expect(addCriteriaButton).toBeVisible();
            await expect(addCriteriaButton).toBeEnabled();
            await addCriteriaButton.click();

            const categorySelect = this.page.locator(this.selectCategory);
            await expect(categorySelect).toBeVisible();
            await expect(categorySelect).toBeEnabled();
            await categorySelect.click();

            const categoryOption = this.page.getByRole('option', {
                name: category,
                exact: true
            });
            await expect(categoryOption).toBeVisible();
            await categoryOption.click();

            const description = this.page.locator(this.enterCriteriaDescription);
            await expect(description).toBeVisible();
            await description.fill(testdata.createBidRFP.criteriaDescription);

            const criteriaValueSelect = this.page.locator(this.selectCriteriaValue);
            await expect(criteriaValueSelect).toBeVisible();
            await criteriaValueSelect.click();

            const criteriaOption = this.page.getByRole('option', {
                name: testdata.createBidRFP.criteriaOption,
                exact: true
            });
            await expect(criteriaOption).toBeVisible();
            await criteriaOption.click();

            const valueTypeSelect = this.page.locator(this.selectValueType);
            await expect(valueTypeSelect).toBeVisible();
            await valueTypeSelect.click();

            const valueTypeOption = this.page.getByRole('option', {
                name: testdata.createBidRFP.criteriaValueType,
                exact: true
            });
            await expect(valueTypeOption).toBeVisible();
            await valueTypeOption.click();

            const criteriaValue = this.page.locator(this.enterCriteriaValue);
            await expect(criteriaValue).toBeVisible();
            await criteriaValue.fill(String(testdata.createBidRFP.criteriaWeight));

            const submitCriteriaBtn = this.page.locator(this.submitCriteria);
            await expect(submitCriteriaBtn).toBeVisible();
            await expect(submitCriteriaBtn).toBeEnabled();
            await submitCriteriaBtn.click();

            await expect(submitCriteriaBtn).toBeHidden();
        }
        // Evaluation team section
        const evalTeamTab = this.page.locator(this.selectEvaluationTeam);
        await expect(evalTeamTab).toBeVisible();
        await evalTeamTab.click();

        const techTeamBtn = this.page.locator(this.selectTechnicalTeam);
        await expect(techTeamBtn).toBeVisible();
        await techTeamBtn.click();

        const searchTechInput = this.page.locator(this.searchTechnicalTeam);
        await expect(searchTechInput).toBeVisible();
        await searchTechInput.fill(testdata.createBidRFP.technicalTeam.name);

        const techOption = this.page.getByRole('option', { name: testdata.createBidRFP.technicalTeam.name }).first();
        await expect(techOption).toBeVisible();
        await techOption.click();


        const commTeamBtn = this.page.locator(this.selectCommercialTeam);
        await expect(commTeamBtn).toBeVisible();
        await commTeamBtn.click();

        const searchCommInput = this.page.locator(this.searchCommercialTeam);
        await expect(searchCommInput).toBeVisible();
        await searchCommInput.fill('');
        await searchCommInput.fill(testdata.createBidRFP.commercialTeam.name);

        const commOption = this.page
            .locator('[role="option"]')
            .filter({ hasText: testdata.createBidRFP.commercialTeam.name })
            .first();

        await expect(commOption).toBeVisible();

        await commOption.click({ force: true });

        // Terms and publish section
        const termsTab = this.page.locator(this.clickTerms);
        await expect(termsTab).toBeVisible();
        await termsTab.click();

        const addTermsBtn = this.page.locator(this.clickAddTerms);
        await expect(addTermsBtn).toBeVisible();
        await addTermsBtn.click();

        const termsTypeSelect = this.page.locator(this.selectTermsType);
        await expect(termsTypeSelect).toBeVisible();
        await termsTypeSelect.click();

        const termsOption = this.page.getByRole('option', { name: testdata.createBidRFP.termsType }).first();
        await expect(termsOption).toBeVisible();
        await termsOption.click();

        const termsDescInput = this.page.locator(this.enterTermsDesciption);
        await expect(termsDescInput).toBeVisible();
        await termsDescInput.fill(testdata.createBidRFP.termsDescription);

        const submitClauseBtn = this.page.locator(this.clauseSubmit);
        await expect(submitClauseBtn).toBeVisible();
        await submitClauseBtn.click();

        const publishBidBtn = this.page.locator(this.publishBid);
        await expect(publishBidBtn).toBeVisible();
        await publishBidBtn.click();

        const finalBidBtn = this.page.locator(this.finalBid);
        await expect(finalBidBtn).toBeVisible();
        await expect(finalBidBtn).toBeEnabled();
        await finalBidBtn.click();
    }

}

module.exports = AddRFPLine;