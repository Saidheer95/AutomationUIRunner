class PRChatPage {
    constructor(page) {
        this.page = page;
        this.agentConsoleDropdown = '[data-testid="nav-ai"]';

        this.clickAIAgent =
            '[data-testid="nav-ai-agents"]';

        this.clickSourcingAgent =
            '[data-testid="card-agent-procurement"]';

        this.chatMessages =
            page.locator(
                '[data-testid="chat-messages"]'
            );

        this.chatInput =
            '[data-testid="input-procurement-prompt"]';

        this.sendButton =
            '[data-testid="button-procurement-submit"]';

        this.messageRows =
            this.chatMessages.locator(
                ':scope > div'
            );
    }

    async openProcurementAgent() {

        await this.page
            .locator(
                this.agentConsoleDropdown
            )
            .click();

        await this.page
            .locator(
                this.clickAIAgent
            )
            .click();

        await this.page
            .locator(
                this.clickSourcingAgent
            )
            .click();

        await this.chatMessages.waitFor({
            state: 'visible'
        });
    }

    async sendMessage(message) {

        const input =
            this.page.locator(
                this.chatInput
            );

        const sendButton =
            this.page.locator(
                this.sendButton
            );

        await input.fill(message);

        await sendButton.click();
    }

    async getMessageCount() {

        return await this.messageRows.count();
    }

    async waitForNewResponse(
        previousCount,
        userMessage
    ) {

        await this.page.waitForFunction(
            ({ previousCount, userMessage }) => {

                const container =
                    document.querySelector(
                        '[data-testid="chat-messages"]'
                    );

                if (!container) {
                    return false;
                }

                const rows =
                    Array.from(
                        container.children
                    );

                if (
                    rows.length <=
                    previousCount
                ) {
                    return false;
                }

                const latestRow =
                    rows[rows.length - 1];

                const latestText =
                    latestRow.innerText?.trim() ||
                    '';

                if (!latestText) {
                    return false;
                }

                if (
                    latestText ===
                    userMessage.trim()
                ) {
                    return false;
                }

                return true;

            },
            {
                previousCount,
                userMessage
            },
            {
                timeout: 60000
            }
        );

        const count =
            await this.getMessageCount();

        const latestRow =
            this.messageRows.nth(
                count - 1
            );

        await latestRow.waitFor({
            state: 'visible'
        });

        const responseText =
            await latestRow.innerText();

        return responseText.trim();
    }
}

module.exports = {
    PRChatPage
};