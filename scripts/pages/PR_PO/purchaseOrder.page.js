const { expect } = require('@playwright/test');
const JsonWriter = require('../../utils/JsonWriter');

class PurchaseOrderPage {
  constructor(page) {
    this.page = page;
    this.requisitionLink = '[data-testid="nav-requisitions"]';
    this.searchPR = '[data-testid="input-search-pr"]';
    this.createPO = (prNumber) => `[data-testid="button-create-po-${prNumber}"]`;
    this.selectPOLine = '[data-testid^="pr-to-po-line-test-id"]';
    this.searchSupplier = '[data-testid="input-vendor-search-po"]';
    this.selectPaymentTerms = '[data-testid="select-payment-terms-po"]';
    this.selectAdvancePayment = '[data-testid="checkbox-advance-flag-po"]';
    this.enterAdvancePayment = '[data-testid="input-advance-percentage-po"]';
    this.submitPO = '[data-testid="button-create-po-from-pr"]';
    this.checkBudget = 'button:has-text("Check Budget")';
    this.submitApproval = '[data-testid="button-submit-approval"]';
    this.finalSubmit = '[data-testid="button-submit-confirm"]';
    this.poNumber = '[data-testid="text-po-number"]';
  }

  async createPurchaseOrder(testData) {
    console.log(`Creating Purchase Order for PR Number: ${testData.addLine.prNumber}`);

    await this.page.locator(this.requisitionLink).click();

    const prSearch = this.page.locator(this.searchPR);
    await prSearch.fill(testData.addLine.prNumber);

    const createPOButton = this.page.locator(this.createPO(testData.addLine.prNumber)    );
    await expect(createPOButton).toBeVisible();
    await createPOButton.click();

    const poLine = this.page.locator(this.selectPOLine).first();
    await expect(poLine).toBeVisible();
    await poLine.click();

    const supplierSearch = this.page.locator(this.searchSupplier);
    await expect(supplierSearch).toBeVisible();
    await supplierSearch.fill(testData.createPurchaseOrder.supplierName);

    const supplierName = testData.createPurchaseOrder.supplierName;
    // await this.page.waitForTimeout(1000);

    let supplierOption = this.page.getByRole('option', {
      name: supplierName,
      exact: true
    });

    if (await supplierOption.count() > 0) {
      await supplierOption.first().waitFor({ state: 'visible' });
      await supplierOption.first().click();
    } else {
      supplierOption = this.page.locator('li').filter({ hasText: supplierName });

      if (await supplierOption.count() > 0) {
        await supplierOption.first().waitFor({ state: 'visible' });
        await supplierOption.first().click();
      } else {
        supplierOption = this.page.getByText(supplierName, { exact: true });
        await expect(supplierOption).toBeVisible({ timeout: 10000 });
        await supplierOption.first().click();
      }
    }

    await expect(supplierSearch).toHaveValue(supplierName);

    const paymentTerms = this.page.locator(this.selectPaymentTerms);
    await expect(paymentTerms).toBeVisible();
    await paymentTerms.click();

    const paymentOption = this.page.getByRole('option', { name: testData.createPurchaseOrder.paymentTerms,
      exact: true     });
    await expect(paymentOption).toBeVisible();
    await paymentOption.click();

    const advanceCheckbox = this.page.locator(this.selectAdvancePayment);
    await expect(advanceCheckbox).toBeVisible();

    if (!(await advanceCheckbox.isChecked())) {
      await advanceCheckbox.click();
    }

    const advancePayment = this.page.locator(this.enterAdvancePayment);
    await expect(advancePayment).toBeVisible();

    await advancePayment.fill(
      String(testData.createPurchaseOrder.advancePayment)
    );

    await expect(advancePayment).toHaveValue( String(testData.createPurchaseOrder.advancePayment)    );

    const submitPOButton = this.page.locator(this.submitPO);
    await expect(submitPOButton).toBeVisible();
    await expect(submitPOButton).toBeEnabled({ timeout: 15000 });
    await submitPOButton.click();

    const checkBudgetButton = this.page.getByRole('button', {
      name: 'Check Budget',
      exact: true
    });
    await expect(checkBudgetButton).toBeVisible();
    await expect(checkBudgetButton).toBeEnabled();
    await checkBudgetButton.click();

    const submitApprovalButton = this.page.locator(this.submitApproval);
    await expect(submitApprovalButton).toBeVisible();
    await expect(submitApprovalButton).toBeEnabled();
    await submitApprovalButton.click();

    await this.page.click(this.finalSubmit);

    console.log(`Creating Purchase Order for PR Number: ${testData.addLine.prNumber}`);
    console.log(`Supplier Name: ${testData.createPurchaseOrder.supplierName}`);
    console.log(`Payment Terms: ${testData.createPurchaseOrder.paymentTerms}`);
    console.log(`Advance Payment: ${testData.createPurchaseOrder.advancePayment}`);
  }

  async getPONumber() {
    const poNumberLocator = this.page.locator(this.poNumber);
    await poNumberLocator.waitFor({ state: 'visible' });

    const poNumberText = await poNumberLocator.textContent();
    const poNumber = poNumberText?.trim();

    if (!poNumber) {
      throw new Error('PO number was not found on the page.');
    }

    JsonWriter.savePONumber(poNumber);
    return poNumber;
  }
}

module.exports = PurchaseOrderPage;