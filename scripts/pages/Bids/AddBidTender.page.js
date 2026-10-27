const { expect } = require('@playwright/test');

class BidsTender {
    constructor(page) {
        this.page = page;
        this.clickAddLine = page.getByRole("button", { name: "Add Line" });
        this.selectItem = '[data-testid="select-line-item"]';
        this.selectLineType = '[data-testid="select-linetype"]';
        this.enterQuantity = '[data-testid="input-line-quantity"]';
        this.selectUOM = '[data-testid="select-line-uom"]';
        this.enterUnitPrice = '[data-testid="input-line-price"]';
        this.clickAdd = '[data-testid="button-submit-line"]';

        this.tabSuppliers = '[data-testid="tab-suppliers"]';
        this.clickSupplier = '[data-testid="button-add-supplier"]';
        this.searchSupplier = '[data-testid="input-search-supplier"]';
        this.finalInvite = '[data-testid="button-invite-suppliers"]';
        this.evaluationCriteriaTab = '[data-testid="tab-criteria"]';
        this.addCriteria = '[data-testid="button-add-criteria"]';
        this.selectCategory = '[data-testid="select-criteria-category"]';
        this.enterCriteriaDescription = '[data-testid="input-criteria-question"]';
        this.selectCriteriaValue = '[data-testid="select-criteria-option"]';
        this.selectValueType = '[data-testid="select-criteria-valuetype"]';
        this.enterCriteriaValue = '[data-testid="input-criteria-weight"]';
        this.clickTerms = '[data-testid="tab-terms"]';
        this.submitCriteria = '[data-testid="button-submit-criteria"]';
        this.selectEvaluationTeam = '[data-testid="tab-team"]';
        this.selectTechnicalTeam = '[data-testid="button-select-member-technical-review-team"]';
        this.searchTechnicalTeam = '[data-testid="input-search-member-technical-review-team"]';
        this.selectTechnicalApproveTeam = '[data-testid="button-select-member-technical-approve-team"]'
        this.searchTechnicalApprovelTeam = '[data-testid="input-search-member-technical-approve-team"]';
        this.selectCommercialTeam = '[data-testid="button-select-member-commercial-review-team"]';
        this.searchCommercialTeam = '[data-testid="input-search-member-commercial-review-team"]';
        this.selectCommercialApproveTeam = '[data-testid="button-select-member-commercial-approve-team"]';
        this.searchCommercialApproveTeam = '[data-testid="input-search-member-commercial-approve-team"]';
        this.selectCommitteeTeam = '[data-testid="button-select-member-committee-team"]';
        this.searchCommitteeTeam = '[data-testid="input-search-member-committee-team"]';
        this.clickCommitteeTeam = '[data-testid="button-select-member-committee-team"]';
        this.clickAddTerms = '[data-testid="button-add-clause"]';
        this.selectTermsType = '[data-testid="select-clause-type"]';
        this.enterTermsDesciption='[data-testid="input-clause-desc"]';
        this.clauseSubmit='[data-testid="button-submit-clause"]';
        this.publishBid='[data-testid="button-publish-bid"]';
        this.finalBid='[data-testid="button-publish-confirm"]';

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
    

    async createBidTender(testdata) {
        await this.page.pause();
        for (let i = 0; i <= 3; i++) {
            
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

        await this.page.click(this.tabSuppliers);
        await this.page.click(this.clickSupplier)
        await this.page.click(this.searchSupplier);
        const suppliers = testdata.createBidTender.supplier.name;
        for (const supplier of suppliers) {
            const searchBox = this.page.locator(this.searchSupplier);

            await searchBox.fill('');
            await searchBox.fill(supplier);

            await this.page.getByText(supplier, { exact: true }).waitFor();

            await this.page.getByRole('checkbox').first().check();
        }

        await this.page.click(this.finalInvite);
        await this.page.click(this.evaluationCriteriaTab);

        for (const category of testdata.createBidTender.criteriaCategory.name) {
            await this.page.click(this.addCriteria);
            await this.page.click(this.selectCategory);
            const options1 = await this.page.locator('[role="option"]').allTextContents();
            // Print the available option text values to the console
            console.log(options1);
            await this.page.getByRole('option', { name: category }).click();
            await this.page.fill(this.enterCriteriaDescription, testdata.createBidTender.criteriaDescription);
            await this.page.click(this.selectCriteriaValue);
            await this.page.getByRole('option', { name: testdata.createBidTender.criteriaOption }).click();
            await this.page.click(this.selectValueType);
            await this.page.getByRole('option', { name: testdata.createBidTender.criteriaValueType }).click();
            await this.page.fill(this.enterCriteriaValue, testdata.createBidTender.criteriaWeight);
            await this.page.click(this.submitCriteria);
        }

        await this.page.click(this.selectEvaluationTeam);
        await this.page.click(this.selectTechnicalTeam);
        await this.page.fill(this.searchTechnicalTeam, testdata.createBidTender.technicalTeam.name);
        await this.page.getByRole('option', { name: testdata.createBidTender.technicalTeam.name }).click();
        await this.page.click(this.selectTechnicalApproveTeam);
        await this.page.fill(this.searchTechnicalApprovelTeam, testdata.createBidTender.technicalApproveTeam.name);
        await this.page.getByRole('option', { name: testdata.createBidTender.technicalApproveTeam.name }).click();
        await this.page.click(this.selectCommercialTeam);
        await this.page.fill(this.searchCommercialTeam, testdata.createBidTender.commercialTeam.name);
        await this.page.getByRole('option', { name: testdata.createBidTender.commercialTeam.name }).click();
        await this.page.click(this.selectCommercialApproveTeam);
        await this.page.fill(this.searchCommercialApproveTeam, testdata.createBidTender.commercialApproveTeam.name);
        await this.page.getByRole('option', { name: testdata.createBidTender.commercialApproveTeam.name }).click();
       
        const committeeMembers = testdata.createBidTender.committeeTeam.name;

        for (const member of committeeMembers) {
            console.log("Searching for:", member);

            const selectButton = this.page.locator(this.selectCommitteeTeam);
            const search = this.page.locator(this.searchCommitteeTeam);

            // Open dropdown
            await selectButton.click();

            await search.waitFor({
                state: 'visible'
            });

            // Search user
            await search.fill(member);

            // Wait for search result
            await this.page.waitForTimeout(1000);

            console.log(
                "Search value:",
                await search.inputValue()
            );

            const option = this.page.getByText(member, {});

            console.log(
                `${member} elements found:`,
                await option.count()
            );

          

            // Click user
            await option.first().click();

            // IMPORTANT:
            // Wait until dropdown/search closes before next iteration
            await search.waitFor({
                state: 'hidden'
            });

            console.log(`${member} selected successfully`);
        }

        await this.page.click(this.clickTerms);
        await this.page.click(this.clickAddTerms);
        await this.page.click(this.selectTermsType);
        await this.page.getByRole('option', { name: testdata.createBidTender.termsType }).click();
        await this.page.keyboard.press('Tab');
        await this.page.fill(this.enterTermsDesciption, testdata.createBidTender.termsDescription);
        await this.page.click(this.clauseSubmit);
        await this.page.click(this.publishBid);
        await this.page.click(this.finalBid);
    }
} module.exports = BidsTender;