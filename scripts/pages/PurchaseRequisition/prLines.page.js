class BulkPurchaseRequisitionPage {
    constructor(page) {
        this.page = page;
        this.bulkLinesUpload = '[data-testid="button-import-excel"]';
        this.clickTemplateUpload=this.page.getByRole('button', { name: 'Choose File' });

    }

    async uploadBulkLines(filePath) {
        await this.page.click(this.bulkLinesUpload);
        await this.clickTemplateUpload.setInputFiles(filePath);
    }
}