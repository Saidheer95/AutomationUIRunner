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

        await dropdown.waitFor({ state: 'visible' });
        await dropdown.scrollIntoViewIfNeeded();

        if (!(await dropdown.isEnabled())) {
            throw new Error(
                `Dropdown '${dropdownLocator}' is disabled. Required dependency may not be selected.`
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
            }),
            this.page.locator('span').filter({
                hasText: optionTextValue
            }),
            this.page.locator(`text=${optionTextValue}`)
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
            `Option '${optionTextValue}' not found.`
        );
    }

    async navigateToCreatePR() {
        await this.page
            .locator(this.requisitionLink)
            .waitFor({ state: 'visible' });

        await this.page
            .locator(this.requisitionLink)
            .click();

        await this.page
            .locator(this.createPR)
            .waitFor({ state: 'visible' });

        await this.page
            .locator(this.createPR)
            .click();

        await this.page
            .locator(this.prDescriptionInput)
            .waitFor({ state: 'visible' });
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
            .waitFor({ state: 'visible' });

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

    getTomorrowDate() {
        const date = new Date();

        date.setDate(date.getDate() + 1);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    async fillHeaderFields(testData) {
        const data = testData.createPurchaseRequisition;

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

    async submitPR() {
        const submitButton =
            this.page.locator(this.finalSubmitPR);

        await submitButton.waitFor({
            state: 'visible'
        });

        await submitButton.click();
    }

    async createPurchaseRequisitionPage(testData) {
        await this.navigateToCreatePR();

        const data =
            testData.createPurchaseRequisition;

        await this.enterDescription(
            data.prDescription
        );

        await this.selectBusinessEntity(
            data.businessEntity
        );

        const date = this.getTomorrowDate();

        await this.enterNeedByDate(date);

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

    async closeCreatePR() {
        const dialog =
            this.page.locator(this.createPRDialog);

        if (await dialog.count() && await dialog.first().isVisible()) {
            await this.page.keyboard.press('Escape');

            await dialog.first()
                .waitFor({ state: 'hidden' })
                .catch(() => {});
        }
    }
}

module.exports = PurchaseRequisitionPage;