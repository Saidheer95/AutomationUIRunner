const { test, expect } = require('@playwright/test');

test.describe('Create Bid Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://qa.prokraya.ai/signin');

        await page.locator('[data-testid="input-email"]').fill('prokraya1@gmail.com');
        await page.locator('[data-testid="input-password"]').fill('Test@123');
        await page.locator('[data-testid="button-login"]').click();

        await expect(page).toHaveURL(/dashboard/);
    });

    test('Direct Bid Creation', async ({ page }) => {
        // Static test data
        const bidData = {
            description: `Direct Bid ${Date.now()}`,
            bidType: 'Tender',
            businessEntity: 'YOUR_BUSINESS_ENTITY',
            buyer: 'YOUR_BUYER',
            currency: 'INR',
            paymentTerms: '60 Days',
            deliveryLocation: 'YOUR_DELIVERY_LOCATION'
        };

        // Dynamic bid dates
        const now = new Date();
        const openDate = new Date(now.getTime() + 5 * 60000);
        const closeDate = new Date(now.getTime() + 24 * 60 * 60000);
        const envelopeOpenDate = new Date(closeDate.getTime() + 5 * 60000);

        const formatDate = date => {
            const pad = value => String(value).padStart(2, '0');

            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
        };

        // Navigate to Bids
        await page.locator('[data-testid="nav-bids"]').click();
        await page.locator('[data-testid="button-create-bid"]').click();

        // Enter Bid Description
        await page.locator('[data-testid="input-bid-title"]')
            .fill(bidData.description);

        // Select Bid Type
        await page.locator('[data-testid="select-bid-type"]').click();
        await page.getByRole('option', {
            name: bidData.bidType,
            exact: true
        }).click();

        // Select Business Entity
        await page.locator('[data-testid="select-pr-business-entity"]').click();
        await page.getByRole('option', {
            name: bidData.businessEntity,
            exact: true
        }).click();

        // Select Buyer
        await page.locator('[data-testid="select-bid-buyer"]').click();
        await page.getByRole('option', {
            name: bidData.buyer,
            exact: true
        }).click();

        // Select Currency
        await page.locator('[data-testid="select-bid-currency"]').click();
        await page.getByRole('option', {
            name: bidData.currency,
            exact: true
        }).click();

        // Enter Bid Dates
        await page.locator('[data-testid="input-bid-start-date"]')
            .fill(formatDate(openDate));

        await page.locator('[data-testid="input-bid-end-date"]')
            .fill(formatDate(closeDate));

        const envelopeDate = page.locator(
            '[data-testid="input-bid-env-open-date"]'
        );

        await expect(envelopeDate).toBeEnabled();
        await envelopeDate.fill(formatDate(envelopeOpenDate));

        // Select Payment Terms
        await page.locator('[data-testid="select-bid-payment-terms"]').click();
        await page.getByRole('option', {
            name: bidData.paymentTerms,
            exact: true
        }).click();

        // Select Delivery Location
        await page.locator('[data-testid="select-bid-delivery-location"]').click();
        await page.getByRole('option', {
            name: bidData.deliveryLocation,
            exact: true
        }).click();

        // Save Bid
        await page.locator('[data-testid="button-save-bid"]').click();

        // Add Bid Line
        // Add the actual AddBidRFQ.page.js locators and actions here.

        console.log(`Direct Bid created: ${bidData.description}`);
    });

    test.afterEach(async ({ page }) => {
        if (page.url().includes('/dashboard')) {
            await page.locator('[data-testid="button-user-menu"]').click();
            await page.locator('[data-testid="button-logout"]').click();
        }
    });
});