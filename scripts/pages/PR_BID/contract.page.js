const { expect } = require('@playwright/test');
const { generateBidTestData } = require('../../utils/dataGenerator');
const JsonWriter = require('../../utils/JsonWriter');

class PRTender {
    constructor(page) {
        this.page = page;
        // Navigation
        this.requisitionLink = '[data-testid="nav-requisitions"]';

        this.searchPR = '[data-testid="input-search-pr"]';

        // Contract
        this.selectBid = '[data-testid="select-bid-type"]';

        this.selectOpenDate = '[data-testid="input-contract-start-date"]';

        this.selectEndDate = '[data-testid="input-contract-end-date"]';

        // Contract lines
        this.selectLines = '[data-testid^="pr-to-contract-line-test-id"]';

        // Supplier
        this.searchSupplier = '[data-testid="input-vendor-search-contract"]';

        // Create contract
        this.createContract = '[data-testid="button-create-contract-from-pr"]';

        // Clauses
        this.tabClauses = '[data-testid="tab-clauses"]';

        this.clickAddClause = '[data-testid="button-add-clause"]';

        this.clauseTitleInput = '[data-testid^="input-clause-title"]';

        this.saveChanges = '[data-testid="button-save-clauses"]';

        // Review team
        this.clickReviewTeam = '[data-testid="button-add-reviewer"]';

        this.clicksearchReviewer = '[data-testid="input-reviewer-search"]';

        this.clickAddReviewer = '[data-testid="button-add-selected"]';

        // Submit
        this.submitReview = '[data-testid="button-submit-contract"]';

        this.finalSubmitReview = '[data-testid="button-confirm-submit"]';

        // Contract number
        this.contractNumber = '[data-testid="text-contract-ref"]';
    }

    async createContractPR(testdata) {

        const dynamicData =
            generateBidTestData('Contract');

        console.log(
            'Generated Contract data:',
            dynamicData
        );

        // =========================================================
        // 1. Navigate to Requisitions
        // =========================================================

        await this.page
            .locator(this.requisitionLink)
            .click();

        await expect(
            this.page.locator(this.searchPR)
        ).toBeVisible();

        // =========================================================
        // 2. Search PR
        // =========================================================

        console.log(
            `Searching for PR Number: ${testdata.addLine.prNumber}`
        );

        await this.page
            .locator(this.searchPR)
            .fill(testdata.addLine.prNumber);

        // Wait for PR search results to load.
        await this.page.waitForLoadState('networkidle');

        // =========================================================
        // 3. Select Create Contract option
        // =========================================================

        const clickButton =
            this.page.getByRole('button', {
                name: testdata.createContract.type
            });

        await expect(clickButton).toBeVisible();

        await expect(clickButton).toBeEnabled();

        await clickButton.click();

        // =========================================================
        // 4. Fill Contract Dates
        // =========================================================

        const openDate =
            this.page.locator(this.selectOpenDate);

        const endDate =
            this.page.locator(this.selectEndDate);

        await expect(openDate).toBeVisible();

        await expect(endDate).toBeVisible();

        await openDate.fill(
            dynamicData.openDate
        );

        await endDate.fill(
            dynamicData.closeDate
        );

        // Trigger change / blur events.
        await endDate.press('Tab');

        console.log(
            `Contract Start Date: ${dynamicData.openDate}`
        );

        console.log(
            `Contract End Date: ${dynamicData.closeDate}`
        );

        // =========================================================
        // 5. Select Supplier
        // =========================================================

        const supplierName =
            testdata.createContract.supplier.name;

        console.log(
            `Selecting Supplier: ${supplierName}`
        );

        const supplierSearch =
            this.page.locator(this.searchSupplier);

        await expect(
            supplierSearch
        ).toBeVisible();

        await supplierSearch.fill(
            supplierName
        );

        const supplierOption =
            this.page.getByText(
                supplierName,
                {
                    exact: true
                }
            );

        await expect(
            supplierOption
        ).toBeVisible({
            timeout: 15000
        });

        await supplierOption.click();

        console.log(
            `Supplier selected: ${supplierName}`
        );

        // =========================================================
        // 6. Select Contract Lines
        // =========================================================
        //
        // Some PR lines may already have been raised.
        // Those lines are rendered with disabled checkboxes.
        //
        // Example:
        //
        // Line 0 -> disabled -> already raised -> SKIP
        // Line 1 -> enabled  -> SELECT
        // Line 2 -> enabled  -> SELECT
        // Line 3 -> enabled  -> SELECT
        //
        // Therefore, do NOT expect every checkbox to be enabled.
        // Only select checkboxes that are currently enabled.
        // =========================================================

        const checkboxes =
            this.page.locator(this.selectLines);

        const lineCount =
            await checkboxes.count();

        console.log(
            `Found ${lineCount} contract line checkbox(es)`
        );

        if (lineCount === 0) {
            throw new Error(
                'No contract line checkboxes were found.'
            );
        }

        let selectedCount = 0;
        let skippedCount = 0;

        for (let i = 0; i < lineCount; i++) {

            const checkbox =
                checkboxes.nth(i);

            await checkbox.waitFor({
                state: 'visible',
                timeout: 15000
            });

            const checkboxId =
                await checkbox.getAttribute('id');

            const dataTestId =
                await checkbox.getAttribute(
                    'data-testid'
                );

            const isDisabled =
                await checkbox.isDisabled();

            const isChecked =
                await checkbox.isChecked();

            console.log(
                `Line ${i}: id=${checkboxId}, ` +
                `data-testid=${dataTestId}, ` +
                `disabled=${isDisabled}, ` +
                `checked=${isChecked}`
            );

            // -----------------------------------------------------
            // Skip already-raised / unavailable lines.
            // -----------------------------------------------------

            if (isDisabled) {

                console.log(
                    `Line ${i} is disabled/already raised. Skipping.`
                );

                skippedCount++;

                continue;
            }

            // -----------------------------------------------------
            // Select available line.
            // -----------------------------------------------------

            if (!isChecked) {

                await checkbox.check();

                console.log(
                    `Line ${i} selected successfully`
                );

                selectedCount++;

            } else {

                console.log(
                    `Line ${i} is already selected`
                );

                selectedCount++;
            }
        }

        console.log(
            `Contract lines selected: ${selectedCount}, ` +
            `skipped: ${skippedCount}`
        );

        // Make sure there is at least one new line to contract.
        if (selectedCount === 0) {
            throw new Error(
                'No new contract lines were available for selection.'
            );
        }

        // =========================================================
        // 7. Create Contract
        // =========================================================

        const createContractButton =
            this.page.locator(
                this.createContract
            );

        await expect(
            createContractButton
        ).toBeVisible();

        await expect(
            createContractButton
        ).toBeEnabled();

        await createContractButton.click();

        // =========================================================
        // 8. Clauses
        // =========================================================

        const clausesTab =
            this.page.locator(
                this.tabClauses
            );

        await clausesTab.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await clausesTab.scrollIntoViewIfNeeded();

        await clausesTab.click();

        // Add clause.
        await this.page
            .locator(this.clickAddClause)
            .click();

        // Clause title.
        await this.page
            .locator(this.clauseTitleInput)
            .fill(
                testdata.clauses.title
            );

        // Clause description.
        const descriptionField =
            this.page.locator(
                '[contenteditable="true"][data-placeholder="Click here to start editing..."]'
            ).last();

        await descriptionField.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await descriptionField.fill(
            testdata.clauses.description
        );

        // Save clauses.
        await this.page
            .locator(this.saveChanges)
            .click();

        // =========================================================
        // 9. Add Reviewers
        // =========================================================

        await this.page
            .locator(this.clickReviewTeam)
            .click();

        const reviewers =
            Array.isArray(testdata.reviewer.name)
                ? testdata.reviewer.name
                : [testdata.reviewer.name];

        console.log(
            `Reviewers to add: ${reviewers.join(', ')}`
        );

        for (const reviewer of reviewers) {

            const searchBox =
                this.page.locator(
                    this.clicksearchReviewer
                );

            await searchBox.fill('');

            await searchBox.fill(
                reviewer
            );

            const reviewerOption =
                this.page.getByText(
                    reviewer,
                    {
                        exact: true
                    }
                );

            await reviewerOption.waitFor({
                state: 'visible',
                timeout: 15000
            });

            await reviewerOption.click();

            // Select the reviewer checkbox.
            const reviewerCheckbox =
                this.page.getByRole(
                    'checkbox'
                ).first();

            await expect(
                reviewerCheckbox
            ).toBeEnabled();

            if (
                !(await reviewerCheckbox.isChecked())
            ) {
                await reviewerCheckbox.check();
            }
        }

        await this.page
            .locator(this.clickAddReviewer)
            .click();

        // =========================================================
        // 10. Submit Contract
        // =========================================================

        const submitButton =
            this.page.locator(
                this.submitReview
            );

        await expect(
            submitButton
        ).toBeVisible();

        await expect(
            submitButton
        ).toBeEnabled();

        await submitButton.click();

        // Confirm submit.
        const confirmButton =
            this.page.locator(
                this.finalSubmitReview
            );

        await expect(
            confirmButton
        ).toBeVisible();

        await expect(
            confirmButton
        ).toBeEnabled();

        await confirmButton.click();

        console.log(
            'Contract submitted successfully.'
        );
    }

    // =============================================================
    // Get Contract Number
    // =============================================================

    async getContractNumber() {

        const contractNumberLocator =
            this.page.locator(
                this.contractNumber
            );

        await contractNumberLocator.waitFor({
            state: 'visible',
            timeout: 30000
        });

        const contractNumberText =
            await contractNumberLocator.textContent();

        const contractNumber =
            contractNumberText?.trim();

        if (!contractNumber) {
            throw new Error(
                'Contract number was not found on the page.'
            );
        }

        console.log(
            `Contract Number: ${contractNumber}`
        );

        JsonWriter.saveContractNumber(
            contractNumber
        );

        return contractNumber;
    }
}

module.exports = PRTender;