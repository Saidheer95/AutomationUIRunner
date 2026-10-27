class SupplierChatPage {

    constructor(page) {

        this.page = page;

        this.agentConsoleDropdown =
            '[data-testid="nav-ai"]';

        this.clickAIAgent =
            '[data-testid="nav-ai-agents"]';

        this.clickSupplierAgent =
            '[data-testid="card-agent-vendor"]';

        this.chatMessages =
            page.locator(
                '[data-testid="chat-messages"]'
            );

        this.chatInput =
            '[data-testid="input-vendor-prompt"]';

        this.sendButton =
            '[data-testid="button-vendor-submit"]';

        this.messageRows =
            this.chatMessages.locator(
                ':scope > div'
            );

        this.agentMessages =
            this.chatMessages.locator(
                'div.bg-muted'
            );
    }

    async openSupplierAgent() {

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
                this.clickSupplierAgent
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

    async getAgentMessageCount() {

        return await this.agentMessages.count();
    }

    async getLatestAgentResponse() {

        const count =
            await this.getAgentMessageCount();

        const latestMessage =
            this.agentMessages.nth(
                count - 1
            );

        await latestMessage.waitFor({
            state: 'visible'
        });

        const responseText =
            await latestMessage.innerText();

        return responseText.trim();
    }

    async waitForNewResponse(
        previousAgentCount
    ) {

        await this.page.waitForFunction(

            (previousCount) => {

                const container =
                    document.querySelector(
                        '[data-testid="chat-messages"]'
                    );

                if (!container) {
                    return false;
                }

                const messages =
                    container.querySelectorAll(
                        'div.bg-muted'
                    );

                return (
                    messages.length >
                    previousCount
                );
            },

            previousAgentCount,

            {
                timeout: 60000
            }
        );

        return await this.getLatestAgentResponse();
    }
}

module.exports = {
    SupplierChatPage
};
