const { generateTenderTestData } = require('../../utils/dataGenerator');
class BidsTender {
    constructor(page) {
        this.page = page;
        this.requisitionLink = '[data-testid="nav-requisitions"]';
        this.searchPR = '[data-testid="input-search-pr"]';
        this.selectBid = '[data-testid="select-bid-type"]';
        this.selectOpenDate = '[data-testid="input-bid-open-date"]';
        this.selectCloseDate = '[data-testid="input-bid-close-date"]';
        this.selectEnvelopeOpenDate = '[data-testid="input-bid-envelope-open-date"]';
        this.submitBid = '[data-testid="button-confirm-create-bid"]';
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
        this.enterTermsDesciption = '[data-testid="input-clause-desc"]';
        this.clauseSubmit = '[data-testid="button-submit-clause"]';
        this.publishBid = '[data-testid="button-publish-bid"]';
        this.finalBid = '[data-testid="button-publish-confirm"]';

    }

    async createBidTender(testData) {
        const dynamicData = generateTenderTestData('TENDER');

        console.log('Generated Tender data:', dynamicData);

        await this.page.click(this.requisitionLink);
        await this.page.fill(this.searchPR, testData.addLine.prNumber);
        const clickButton = await this.page.getByRole('button', { name: testData.createBidTender.type });
        await clickButton.click();
        await this.page.click(this.selectBid);
        const options = await this.page.locator('[role="option"]').allTextContents();
        console.log(options);
        await this.page.getByText(testData.createBidTender.bidname).click();
        await this.page.fill(this.selectOpenDate, dynamicData.openDate);
        await this.page.fill(this.selectCloseDate, dynamicData.closeDate);
        await this.page.fill(this.selectEnvelopeOpenDate, dynamicData.envelopeOpenDate);
        await this.page.click(this.submitBid);
        await this.page.click(this.tabSuppliers);
        await this.page.click(this.clickSupplier)
        await this.page.click(this.searchSupplier);
        const suppliers = testData.createBidTender.supplier.name;
        for (const supplier of suppliers) {
            const searchBox = this.page.locator(this.searchSupplier);

            await searchBox.fill('');
            await searchBox.fill(supplier);

            await this.page.getByText(supplier, { exact: true }).waitFor();

            await this.page.getByRole('checkbox').first().check();
        }

        await this.page.click(this.finalInvite);
        await this.page.click(this.evaluationCriteriaTab);



        for (const category of testData.createBidTender.criteriaCategory.name) {
            await this.page.locator(this.addCriteria).click();

            await this.page.locator(this.selectCategory).waitFor({
                state: 'visible'
            });

            await this.page.locator(this.selectCategory).click();

            await this.page.getByRole('option', {
                name: category,
                exact: true
            }).click();

            await this.page.fill(
                this.enterCriteriaDescription,
                testData.createBidTender.criteriaDescription
            );

            await this.page.click(this.selectCriteriaValue);

            await this.page.getByRole('option', {
                name: testData.createBidTender.criteriaOption,
                exact: true
            }).click();

            await this.page.click(this.selectValueType);

            await this.page.getByRole('option', {
                name: testData.createBidTender.criteriaValueType,
                exact: true
            }).click();

            await this.page.fill(
                this.enterCriteriaValue,
                testData.createBidTender.criteriaWeight
            );

            await this.page.locator(this.submitCriteria).click();

            await this.page.locator(this.submitCriteria).waitFor({
                state: 'hidden'
            });
        }


        await this.page.click(this.selectEvaluationTeam);
        await this.page.click(this.selectTechnicalTeam);
        await this.page.fill(this.searchTechnicalTeam, testData.createBidTender.technicalTeam.name);
        await this.page.getByRole('option', { name: testData.createBidTender.technicalTeam.name }).click();
        await this.page.click(this.selectTechnicalApproveTeam);
        await this.page.fill(this.searchTechnicalApprovelTeam, testData.createBidTender.technicalApproveTeam.name);
        await this.page.getByRole('option', { name: testData.createBidTender.technicalApproveTeam.name }).click();
        await this.page.click(this.selectCommercialTeam);
        await this.page.fill(this.searchCommercialTeam, testData.createBidTender.commercialTeam.name);
        await this.page.getByRole('option', { name: testData.createBidTender.commercialTeam.name }).click();
        await this.page.click(this.selectCommercialApproveTeam);
        await this.page.fill(this.searchCommercialApproveTeam, testData.createBidTender.commercialApproveTeam.name);
        await this.page.getByRole('option', { name: testData.createBidTender.commercialApproveTeam.name }).click();

        const committeeMembers = testData.createBidTender.committeeTeam.name;

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
        await this.page.getByRole('option', { name: testData.createBidTender.termsType }).click();
        await this.page.keyboard.press('Tab');
        await this.page.fill(this.enterTermsDesciption, testData.createBidTender.termsDescription);
        await this.page.click(this.clauseSubmit);
        await this.page.click(this.publishBid);
        await this.page.click(this.finalBid);
    }
} module.exports = BidsTender;