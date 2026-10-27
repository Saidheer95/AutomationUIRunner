class PurchaseSubmitApprovalPage {

    constructor(page) {

        this.page = page;

        this.checkBudget =
            '[data-testid="button-check-budget"]';

        this.submitApproval =
            '[data-testid="button-submit-approval"]';

        this.approvalConfirmation =
            '[data-testid="button-submit-confirm"]';
    }

    async submitForApproval() {

        const checkBudgetButton =
            this.page.locator(this.checkBudget);

        const submitApprovalButton =
            this.page.locator(this.submitApproval);

        const confirmationButton =
            this.page.locator(this.approvalConfirmation);

        console.log(
            'Checking PR budget...'
        );

        await checkBudgetButton.waitFor({
            state: 'visible'
        });

        await checkBudgetButton.click();

        console.log(
            'Opening Submit for Approval...'
        );


        await submitApprovalButton.click();

        console.log(
            'Confirming Submit for Approval...'
        );


        await confirmationButton.click();

        console.log(
            'PR submitted for approval successfully.'
        );
    }
}

module.exports = PurchaseSubmitApprovalPage;
