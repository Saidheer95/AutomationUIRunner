// const { generateRFPTestData } = require('../../utils/dataGenerator');

// class BidsRFP {
//     constructor(page) {
//         this.page = page;
//         this.requisitionLink = '[data-testid="nav-requisitions"]';
//         this.searchPR = '[data-testid="input-search-pr"]';
//         this.selectBid = '[data-testid="select-bid-type"]';
//         this.selectOpenDate = '[data-testid="input-bid-open-date"]';
//         this.selectCloseDate = '[data-testid="input-bid-close-date"]';
//         this.submitBid = '[data-testid="button-confirm-create-bid"]';
//         this.tabSuppliers = '[data-testid="tab-suppliers"]';
//         this.clickSupplier = '[data-testid="button-add-supplier"]';
//         this.searchSupplier = '[data-testid="input-search-supplier"]';
//         this.finalInvite = '[data-testid="button-invite-suppliers"]';
//         this.evaluationCriteriaTab = '[data-testid="tab-criteria"]';
//         this.addCriteria = '[data-testid="button-add-criteria"]';
//         this.selectCategory = '[data-testid="select-criteria-category"]';
//         this.enterCriteriaDescription = '[data-testid="input-criteria-question"]';
//         this.selectCriteriaValue = '[data-testid="select-criteria-option"]';
//         this.selectValueType = '[data-testid="select-criteria-valuetype"]';
//         this.enterCriteriaValue = '[data-testid="input-criteria-weight"]';
//         this.clickTerms = '[data-testid="tab-terms"]';
//         this.submitCriteria = '[data-testid="button-submit-criteria"]';
//         this.selectEvaluationTeam = '[data-testid="tab-team"]';
//         this.selectTechnicalTeam = '[data-testid="button-select-member-technical-review-team"]';
//         this.searchTechnicalTeam = '[data-testid="input-search-member-technical-review-team"]';
//         this.selectCommercialTeam = '[data-testid="button-select-member-commercial-review-team"]';
//         this.searchCommercialTeam = '[data-testid="input-search-member-commercial-review-team"]';
//         this.clickAddTerms = '[data-testid="button-add-clause"]';
//         this.selectTermsType = '[data-testid="select-clause-type"]';
//         this.enterTermsDesciption = '[data-testid="input-clause-desc"]'
//         this.clauseSubmit = '[data-testid="button-submit-clause"]';
//         this.publishBid = '[data-testid="button-publish-bid"]';
//         this.finalBid = '[data-testid="button-publish-confirm"]';
//     }
//     async createBidRFP(testData) {
//         const dynamicData = generateRFPTestData('RFP');

//         console.log('Generated Tender data:', dynamicData);


//         await this.page.click(this.requisitionLink);
//         await this.page.fill(this.searchPR, testData.addLine.prNumber);
//         const clickButton = await this.page.getByRole('button', { name: testData.createBidRFP.type });
//         await clickButton.click();
//         await this.page.click(this.selectBid);
//         const options = await this.page.locator('[role="option"]').allTextContents();
//         console.log(options);
//         await this.page.getByText(testData.createBidRFP.bidname).click();
//         const dateOpen = await this.page.fill(this.selectOpenDate, dynamicData.openDate);
//         console.log("Open date:" + dateOpen);
//         await this.page.fill(this.selectCloseDate, dynamicData.closeDate);
//         await this.page.click(this.submitBid);
//         await this.page.click(this.tabSuppliers);
//         await this.page.click(this.clickSupplier)
//         await this.page.click(this.searchSupplier);
//         const suppliers = testData.createBidRFP.supplier.name;
//         for (const supplier of suppliers) {
//             const searchBox = this.page.locator(this.searchSupplier);

//             await searchBox.fill('');
//             await searchBox.fill(supplier);

//             await this.page.getByText(supplier, { exact: true }).waitFor();

//             await this.page.getByRole('checkbox').first().check();
//         }

//         await this.page.click(this.finalInvite);
//         await this.page.click(this.evaluationCriteriaTab);


//         for (const category of testData.createBidRFP.criteriaCategory.name) {
//             await this.page.locator(this.addCriteria).click();

//             await this.page.locator(this.selectCategory).waitFor({
//                 state: 'visible'
//             });

//             await this.page.locator(this.selectCategory).click();

//             const options = await this.page.locator('[role="option"]').allTextContents();
//             console.log('Category options:', options);

//             await this.page.getByRole('option', {
//                 name: category,
//                 exact: true
//             }).click();

//             await this.page.locator(this.enterCriteriaDescription).fill(
//                 dynamicData.criteriaDescription
//             );

//             await this.page.locator(this.selectCriteriaValue).click();

//             await this.page.getByRole('option', {
//                 name: testData.createBidRFP.criteriaOption,
//                 exact: true
//             }).click();

//             await this.page.locator(this.selectValueType).click();

//             await this.page.getByRole('option', {
//                 name: testData.createBidRFP.criteriaValueType,
//                 exact: true
//             }).click();

//             await this.page.locator(this.enterCriteriaValue).fill(
//                 testData.createBidRFP.criteriaWeight
//             );

//             await this.page.locator(this.submitCriteria).click();

//             await this.page.locator(this.submitCriteria).waitFor({
//                 state: 'hidden'
//             });

//             console.log(`Criteria submitted: ${category}`);
//         }

//         await this.page.click(this.selectEvaluationTeam);
//         await this.page.click(this.selectTechnicalTeam);

//         await this.page.locator(this.searchTechnicalTeam).fill(
//             testData.createBidRFP.technicalTeam.name
//         );

//         await this.page.getByRole('option', {
//             name: testData.createBidRFP.technicalTeam.name,
//         }).waitFor({
//             state: 'visible'
//         });

//         await this.page.getByRole('option', {
//             name: testData.createBidRFP.technicalTeam.name,
//         }).click();

//         await this.page.click(this.selectCommercialTeam);
//         await this.page.fill(this.searchCommercialTeam, testData.createBidRFP.commercialTeam.name);
//         await this.page.getByRole('option', { name: testData.createBidRFP.commercialTeam.name }).click();

//         await this.page.click(this.clickTerms);
//         await this.page.click(this.clickAddTerms);
//         await this.page.click(this.selectTermsType);
//         await this.page.getByRole('option', { name: testData.createBidRFP.termsType }).click();
//         await this.page.fill(this.enterTermsDesciption, dynamicData.termsDescription);
//         await this.page.click(this.clauseSubmit);
//         await this.page.click(this.publishBid);
//         await this.page.click(this.finalBid);
//     }
// } module.exports = BidsRFP;



const JsonWriter = require('../../utils/JsonWriter');

class PurchaseRequisitionPage {
    constructor(page) {
        this.page = page;

        this.requisitionLink = '[data-testid="nav-requisitions"]';
        this.createPR = '[data-testid="button-create-pr"]';

        this.prDescriptionInput = '[data-testid="input-pr-description"]';
        this.businessEntitySelect = '[data-testid="select-pr-business-entity"]';
        this.needByDateInput = '[data-testid="input-need-by-date"]';
        this.deliveryLocationSelect = '[data-testid="select-delivery-location"]';
        this.buyerSelect = '[data-testid="select-buyer"]';
        this.currencySelect = '[data-testid="select-currency"]';
        this.budgetSelect = '[data-testid="select-budget"]';

        this.finalSubmitPR = '[data-testid="button-save-pr"]';
        this.prNumber = '[data-testid="text-pr-number"]';

        this.createPRDialog = '[role="dialog"]';
    }

    async selectDropdown(dropdownLocator, optionText) {
        const dropdown = this.page.locator(dropdownLocator);

        await dropdown.waitFor({
            state: 'visible'
        });

        await dropdown.scrollIntoViewIfNeeded();

        if (!(await dropdown.isEnabled())) {
            throw new Error(
                `Dropdown '${dropdownLocator}' is disabled.`
            );
        }

        await dropdown.click();

        const optionTextValue = optionText?.trim();

        const optionLocators = [
            this.page.getByRole('option', {
                name: optionTextValue,
                exact: true
            }),
            this.page.getByText(optionTextValue, {
                exact: true
            })
        ];

        for (const option of optionLocators) {
            if (await option.count()) {
                const matchedOption = option.first();

                await matchedOption.waitFor({
                    state: 'visible'
                });

                await matchedOption.scrollIntoViewIfNeeded();
                await matchedOption.click();

                return;
            }
        }

        throw new Error(
            `Option '${optionText}' not found.`
        );
    }

    async navigateToCreatePR() {
        await this.page
            .locator(this.requisitionLink)
            .waitFor({
                state: 'visible'
            });

        await this.page
            .locator(this.requisitionLink)
            .click();

        await this.page
            .locator(this.createPR)
            .waitFor({
                state: 'visible'
            });

        await this.page
            .locator(this.createPR)
            .click();

        await this.page
            .locator(this.prDescriptionInput)
            .waitFor({
                state: 'visible'
            });
    }

    async enterDescription(description) {
        await this.page
            .locator(this.prDescriptionInput)
            .fill(description);
    }

    async selectBusinessEntity(entity) {
        await this.selectDropdown(
            this.businessEntitySelect,
            entity
        );
    }

    async enterNeedByDate(date) {
        await this.page
            .locator(this.needByDateInput)
            .fill(date);
    }

    async selectDeliveryLocation(location) {
        await this.selectDropdown(
            this.deliveryLocationSelect,
            location
        );
    }

    async selectBuyer(buyer) {
        await this.selectDropdown(
            this.buyerSelect,
            buyer
        );
    }

    async selectCurrency(currency) {
        await this.selectDropdown(
            this.currencySelect,
            currency
        );
    }

    async selectBudget(budget) {
        await this.selectDropdown(
            this.budgetSelect,
            budget
        );
    }

    async fillHeaderFields(testData) {
        const data =
            testData.createPurchaseRequisition;

        await this.enterDescription(
            data.prDescription
        );

        await this.selectBusinessEntity(
            data.businessEntity
        );

        await this.enterNeedByDate(
            this.getTomorrowDate()
        );

        await this.selectDeliveryLocation(
            data.deliveryLocation
        );

        await this.selectBuyer(
            data.buyer
        );

        await this.selectCurrency(
            data.currency
        );

        await this.selectBudget(
            data.budget
        );
    }

    getTomorrowDate() {
        const date = new Date();

        date.setDate(
            date.getDate() + 1
        );

        return date
            .toISOString()
            .split('T')[0];
    }

    async submitPR() {
        await this.page
            .locator(this.finalSubmitPR)
            .waitFor({
                state: 'visible'
            });

        await this.page
            .locator(this.finalSubmitPR)
            .click();
    }

    async closeCreatePR() {
        const dialog = this.page.locator(
            this.createPRDialog
        );

        if (await dialog.count()) {
            if (await dialog.first().isVisible()) {
                await this.page.keyboard.press('Escape');

                await dialog.first().waitFor({
                    state: 'hidden'
                }).catch(() => {});
            }
        }
    }

    async createPurchaseRequisitionPage(testData) {
        await this.navigateToCreatePR();

        await this.fillHeaderFields(testData);

        await this.submitPR();
    }

    async getPRNumber() {
        const prNumberLocator =
            this.page.locator(this.prNumber);

        await prNumberLocator.waitFor({
            state: 'visible'
        });

        const prNumberText =
            await prNumberLocator.textContent();

        const prNumber =
            prNumberText?.trim();

        if (!prNumber) {
            throw new Error(
                'PR number was not found on the page.'
            );
        }

        JsonWriter.savePRNumber(prNumber);

        return prNumber;
    }
}

module.exports = PurchaseRequisitionPage;