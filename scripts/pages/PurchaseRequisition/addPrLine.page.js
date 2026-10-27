// class AddPrLinePage {
//     constructor(page) {
//         this.page = page;

//         this.addLineButton = '[data-testid="button-add-line-item"]';
//         this.productSelectButton = '[data-testid="button-select-item"]';
//         this.quantityInput = '[data-testid="input-line-quantity"]';
//         this.uomSelect = '[data-testid="select-line-uom"]';
//         this.priceInput = '[data-testid="input-line-unit-price"]';
//         this.saveLineButton = '[data-testid="button-save-line"]';
//         this.addLineDialog = '[role="dialog"]:visible';
//         this.successToast = 'text=Line item added successfully';
//     }

//     async openAddLine() {
//         await this.page
//             .locator(this.addLineButton);

//         await this.page
//             .locator(this.addLineButton)
//             .click();

//         await this.page
//             .locator(this.saveLineButton);
//     }

//     async selectRandomProduct() {
//         await this.page
//             .locator(this.productSelectButton)
//             .waitFor({ state: 'visible' });

//         await this.page
//             .locator(this.productSelectButton)
//             .click();

//         const options =
//             this.page.locator('[role="option"]:visible');

//         await options.first().waitFor({
//             state: 'visible'
//         });

//         const count = await options.count();

//         if (!count) {
//             throw new Error('No product options available.');
//         }

//         const randomIndex =
//             Math.floor(Math.random() * count);

//         await options
//             .nth(randomIndex)
//             .click();
//     }

//     async enterQuantity(quantity) {
//         const input =
//             this.page.locator(this.quantityInput);

//         await input.waitFor({
//             state: 'visible'
//         });

//         await input.fill(String(quantity));
//     }

//     async selectRandomUOM() {
//         const uom =
//             this.page.locator(this.uomSelect);

//         await uom.waitFor({
//             state: 'visible'
//         });

//         await uom.click();

//         const options =
//             this.page.locator('[role="option"]:visible');

//         await options.first().waitFor({
//             state: 'visible'
//         });

//         const count = await options.count();

//         if (!count) {
//             throw new Error('No UOM options available.');
//         }

//         const randomIndex =
//             Math.floor(Math.random() * count);

//         await options
//             .nth(randomIndex)
//             .click();
//     }

//     async enterPrice(price) {
//         const input =
//             this.page.locator(this.priceInput);

//         await input.waitFor({
//             state: 'visible'
//         });

//         await input.fill(String(price));
//     }

//     async saveLine() {
//         await this.page
//             .locator(this.saveLineButton)
//             .click();

//         await this.page
//             .locator(this.successToast)
//             .waitFor({
//                 state: 'visible',
//                 timeout: 5000
//             })
//             .catch(() => {});
//     }

//     async closeAddLine() {
//         const dialog =
//             this.page.locator(this.addLineDialog);

//         if (await dialog.count()) {
//             await this.page.keyboard.press('Escape');

//             await dialog
//                 .first()
//                 .waitFor({
//                     state: 'hidden',
//                     timeout: 3000
//                 })
//                 .catch(() => {});
//         }
//     }

//     async addPurchaseRequisitionLine(testData) {
//         await this.openAddLine();

//         await this.selectRandomProduct();

//         await this.enterQuantity(
//             testData.addLine.quantity
//         );

//         await this.selectRandomUOM();

//         await this.enterPrice(
//             testData.addLine.price
//         );

//         await this.saveLine();
//     }
// }

// module.exports = AddPrLinePage;
class AddPrLinePage {
    constructor(page) {
        this.page = page;

        this.addLineButton = '[data-testid="button-add-line-item"]';
        this.addLineDialog = '[role="dialog"]:visible';

        this.productSelectButton = '[data-testid="button-select-item"]';
        this.quantityInput = '[data-testid="input-line-quantity"]';
        this.uomSelect = '[data-testid="select-line-uom"]';
        this.priceInput = '[data-testid="input-line-unit-price"]';
        this.saveLineButton = '[data-testid="button-save-line"]';

        this.successToast = 'text=Line item added successfully';
    }

    async getActiveDialog() {
        const dialog = this.page
            .locator(this.addLineDialog)
            .last();

        await dialog.waitFor({
            state: 'visible'
        });

        return dialog;
    }

    async openAddLine() {
        const addButton =
            this.page.locator(this.addLineButton);

        await addButton.waitFor({
            state: 'visible'
        });

        await addButton.scrollIntoViewIfNeeded();

        await addButton.click();

        const dialog = await this.getActiveDialog();

        await dialog
            .locator(this.saveLineButton)
            .waitFor({
                state: 'visible'
            });

        return dialog;
    }

    async selectRandomProduct(dialog) {
        const productButton =
            dialog.locator(this.productSelectButton);

        await productButton.waitFor({
            state: 'visible'
        });

        await productButton.click();

        const options =
            this.page.locator('[role="option"]:visible');

        await options.first().waitFor({
            state: 'visible'
        });

        const count =
            await options.count();

        if (!count) {
            throw new Error(
                'No product options available.'
            );
        }

        const randomIndex =
            Math.floor(Math.random() * count);

        await options
            .nth(randomIndex)
            .click();
    }

    async enterQuantity(dialog, quantity) {
        const input =
            dialog.locator(this.quantityInput);

        await input.waitFor({
            state: 'visible'
        });

        await input.fill(
            String(quantity)
        );
    }

    async selectRandomUOM(dialog) {
        const uom =
            dialog.locator(this.uomSelect);

        await uom.waitFor({
            state: 'visible'
        });

        await uom.click();

        const options =
            this.page.locator('[role="option"]:visible');

        await options.first().waitFor({
            state: 'visible'
        });

        const count =
            await options.count();

        if (!count) {
            throw new Error(
                'No UOM options available.'
            );
        }

        const randomIndex =
            Math.floor(Math.random() * count);

        await options
            .nth(randomIndex)
            .click();
    }

    async enterPrice(dialog, price) {
        const input =
            dialog.locator(this.priceInput);

        await input.waitFor({
            state: 'visible'
        });

        await input.fill(
            String(price)
        );
    }

    async saveLine(dialog) {
        const saveButton =
            dialog.locator(this.saveLineButton);

        await saveButton.waitFor({
            state: 'visible'
        });

        await saveButton.click();

        await dialog.waitFor({
            state: 'hidden'
        });

        await this.page
            .locator(this.successToast)
            .waitFor({
                state: 'visible'
            })
            .catch(() => {});
    }

    async addPurchaseRequisitionLine(testData) {
        const dialog =
            await this.openAddLine();

        await this.selectRandomProduct(
            dialog
        );

        await this.enterQuantity(
            dialog,
            testData.addLine.quantity
        );

        await this.selectRandomUOM(
            dialog
        );

        await this.enterPrice(
            dialog,
            testData.addLine.price
        );

        await this.saveLine(
            dialog
        );
    }
}

module.exports = AddPrLinePage;