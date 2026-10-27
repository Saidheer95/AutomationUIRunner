class AddLine {
    constructor(page) {
        this.page = page;
        this.clickAddLine = page.getByRole("button", { name: "Add Line" });
        this.selectItem = '[data-testid="select-line-item"]';
        this.selectLineType = '[data-testid="select-linetype"]';
        this.enterQuantity = '[data-testid="input-line-quantity"]';
        this.selectUOM = '[data-testid="select-line-uom"]';
        this.enterUnitPrice = '[data-testid="input-line-price"]';
        this.clickAdd = '[data-testid="button-submit-line"]';
        // Locator for the suppliers tab in the bid workflow
        this.tabSuppliers = '[data-testid="tab-suppliers"]';
        // Locator for the add supplier button
        this.clickSupplier = '[data-testid="button-add-supplier"]';
        // Locator for the supplier search input field
        this.searchSupplier = '[data-testid="input-search-supplier"]';
        // Locator for the invite suppliers button
        this.finalInvite = '[data-testid="button-invite-suppliers"]';
        // Locator for the terms tab in the bid workflow
        this.clickTerms = '[data-testid="tab-terms"]';
        // Locator for the add clause button
        this.clickAddTerms = '[data-testid="button-add-clause"]';
        // Locator for the clause type dropdown selector
        this.selectTermsType = '[data-testid="select-clause-type"]';
        // Locator for the clause description input field
        this.enterTermsDesciptin = '[data-testid="input-clause-desc"]'
        // Locator for the submit clause button
        this.clauseSubmit = '[data-testid="button-submit-clause"]';
        // Locator for the publish bid button
        this.publishBid = '[data-testid="button-publish-bid"]';
        // Locator for the final publish confirmation button
        this.finalBid = '[data-testid="button-publish-confirm"]';

    }

    async selectRandomProduct() {
        await this.page.click(this.selectItem);

        const options = this.page.locator('[role="option"]');

        await options.first().waitFor();

        const count = await options.count();

        const randomIndex = Math.floor(Math.random() * count);

        await options.nth(randomIndex).click();
    }

    async selectDropdown() {
        await this.page.click(this.selectUOM);

        const options = this.page.locator('[role="option"]');

        await options.first().waitFor();

        const count = await options.count();

        const randomIndex = Math.floor(Math.random() * count);

        await options.nth(randomIndex).click();
    }


    async addBidLine(testdata) {


        for (let i = 0; i <= 3; i++) {

            await this.clickAddLine.click();
            // Fill form
            await this.selectRandomProduct();
            await this.page.click(this.selectLineType, testdata.addLine.lineType);
            const option = this.page.locator('[role="option"]', {
                hasText: testdata.addLine.lineType
            });
            await option.waitFor();
            await option.click();
            await this.page.fill(this.enterQuantity, String(testdata.addLine.quantity));
            await this.selectDropdown();
            await this.page.fill(this.enterUnitPrice, String(testdata.addLine.price));

            await this.page.click(this.clickAdd);
        }
        await this.page.click(this.tabSuppliers);
        // Click to add a supplier to the bid
        await this.page.click(this.clickSupplier)
        // Activate the supplier search input field
        await this.page.click(this.searchSupplier);
        // Read the supplier names from the test data
        const suppliers = testdata.createBidRFQ.supplier.name;

        // Loop through each supplier name provided in the test data
        for (const supplier of suppliers) {
            // Create a locator reference for the supplier search field
            const searchBox = this.page.locator(this.searchSupplier);
            // Clear any existing search text from the field
            await searchBox.fill('');
            // Fill the supplier search field with the current supplier name
            await searchBox.fill(supplier);
            // Wait until the supplier text appears exactly in the page
            await this.page.getByText(supplier, { exact: true }).waitFor();
            // Check the first checkbox in the current context to select the supplier
            await this.page.getByRole('checkbox').first().check();
        }

        // Click the button to invite all currently selected suppliers
        await this.page.click(this.finalInvite);
        // Click to open the terms tab
        await this.page.click(this.clickTerms);
        // Click to add a new clause to the bid terms
        await this.page.click(this.clickAddTerms);
        // Click the clause type dropdown to show available clause types
        await this.page.click(this.selectTermsType);
        // Select the specific terms type from the options using test data
        await this.page.getByRole('option', { name: testdata.createBidRFQ.termsType }).click();
        // Fill the clause description field with the description from test data
        await this.page.fill(this.enterTermsDesciptin, testdata.createBidRFQ.termsDescription);
        // Submit the newly added clause
        await this.page.click(this.clauseSubmit);
        // Click the publish bid button to begin publishing
        await this.page.click(this.publishBid);
        // Confirm the final publish action for the bid
        await this.page.click(this.finalBid);

    }
} module.exports = AddLine;