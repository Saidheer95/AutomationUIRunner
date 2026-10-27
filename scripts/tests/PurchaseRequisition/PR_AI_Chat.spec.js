const {
    test,
    expect
} = require('@playwright/test');

const {
    GoogleGenAI
} = require('@google/genai');

const dotenv =
    require('dotenv');

const {
    LoginPage,
    loadCredentials
} =
    require('../../pages/Login/login.page');

const {
    PRChatPage
} =
    require('../../pages/PurchaseRequisition/pr_chat.page');

dotenv.config();

const apiKey =
    process.env.GEMINI_API_KEY;

if (!apiKey) {

    throw new Error(
        'GEMINI_API_KEY was not found in the .env file.'
    );
}

const aiStudio =
    new GoogleGenAI({
        apiKey
    });

const GEMINI_MODEL =
    'gemini-3.6-flash';

test.describe(
    'AI Dynamic Purchase Requisition',
    () => {

        test(
            'Create Purchase Requisition Dynamically Using AI',
            async ({ page }) => {

                test.setTimeout(
                    180000
                );

                const loginPage =
                    new LoginPage(page);

                const prChatPage =
                    new PRChatPage(page);

                const credentials =
                    loadCredentials();

                let totalInputTokens =
                    0;

                let totalOutputTokens =
                    0;

                let totalThoughtTokens =
                    0;

                let totalCachedTokens =
                    0;

                let totalTokens =
                    0;

                let geminiRequestCount =
                    0;

                let prNumber =
                    null;

                let completed =
                    false;

                let step =
                    1;

                const maxSteps =
                    15;

                const chatHistory =
                    [];

                /*
                 * ====================================
                 * TOKEN USAGE
                 * ====================================
                 */

                function printTokenUsage(
                    usage
                ) {

                    const inputTokens =
                        usage?.promptTokenCount ||
                        usage?.prompt_token_count ||
                        0;

                    const outputTokens =
                        usage?.candidatesTokenCount ||
                        usage?.candidates_token_count ||
                        0;

                    const thoughtTokens =
                        usage?.thoughtsTokenCount ||
                        usage?.thoughts_token_count ||
                        0;

                    const cachedTokens =
                        usage?.cachedContentTokenCount ||
                        usage?.cached_content_token_count ||
                        0;

                    const requestTotal =
                        usage?.totalTokenCount ||
                        usage?.total_token_count ||
                        (
                            inputTokens +
                            outputTokens +
                            thoughtTokens
                        );

                    totalInputTokens +=
                        inputTokens;

                    totalOutputTokens +=
                        outputTokens;

                    totalThoughtTokens +=
                        thoughtTokens;

                    totalCachedTokens +=
                        cachedTokens;

                    totalTokens +=
                        requestTotal;

                    geminiRequestCount++;

                    console.log('');

                    console.log(
                        '------------------------------------'
                    );

                    console.log(
                        'GEMINI TOKEN USAGE'
                    );

                    console.log(
                        '------------------------------------'
                    );

                    console.log(
                        `Request          : ${geminiRequestCount}`
                    );

                    console.log(
                        `Input tokens     : ${inputTokens}`
                    );

                    console.log(
                        `Output tokens    : ${outputTokens}`
                    );

                    console.log(
                        `Thinking tokens  : ${thoughtTokens}`
                    );

                    console.log(
                        `Cached tokens    : ${cachedTokens}`
                    );

                    console.log(
                        `Total tokens     : ${requestTotal}`
                    );

                    console.log(
                        '------------------------------------'
                    );

                    console.log(
                        'SESSION TOTAL'
                    );

                    console.log(
                        `Input tokens     : ${totalInputTokens}`
                    );

                    console.log(
                        `Output tokens    : ${totalOutputTokens}`
                    );

                    console.log(
                        `Thinking tokens  : ${totalThoughtTokens}`
                    );

                    console.log(
                        `Cached tokens    : ${totalCachedTokens}`
                    );

                    console.log(
                        `TOTAL USED       : ${totalTokens}`
                    );

                    console.log(
                        '------------------------------------'
                    );
                }

                /*
                 * ====================================
                 * GEMINI JSON PARSER
                 * ====================================
                 */

                function parseAIResponse(
                    responseText
                ) {

                    let cleanedResponse =
                        responseText.trim();

                    cleanedResponse =
                        cleanedResponse
                            .replace(
                                /^```json\s*/i,
                                ''
                            )
                            .replace(
                                /^```\s*/i,
                                ''
                            )
                            .replace(
                                /\s*```$/i,
                                ''
                            )
                            .trim();

                    try {

                        return JSON.parse(
                            cleanedResponse
                        );

                    } catch (error) {

                        throw new Error(
                            `Invalid JSON returned by Gemini:\n${responseText}`
                        );
                    }
                }

                /*
                 * ====================================
                 * GEMINI CALL
                 * ====================================
                 */

                async function askGemini(
                    prompt
                ) {

                    try {

                        const response =
                            await aiStudio.models.generateContent({

                                model:
                                    GEMINI_MODEL,

                                contents:
                                    prompt,

                                config: {

                                    thinkingConfig: {
                                        thinkingLevel:
                                            'minimal'
                                    },

                                    responseMimeType:
                                        'application/json',

                                    maxOutputTokens:
                                        50
                                }
                            });

                        printTokenUsage(
                            response.usageMetadata
                        );

                        return response.text;

                    } catch (error) {

                        console.error('');

                        console.error(
                            '===================================='
                        );

                        console.error(
                            'GEMINI API ERROR'
                        );

                        console.error(
                            '===================================='
                        );

                        console.error(
                            error.message
                        );

                        console.error(
                            '===================================='
                        );

                        throw error;
                    }
                }

                /*
                 * ====================================
                 * PR NUMBER EXTRACTION
                 * ====================================
                 */

                function extractPRNumber(
                    text
                ) {

                    const match =
                        text.match(
                            /\bPR[_\s-]?\d+\b/i
                        );

                    if (!match) {
                        return null;
                    }

                    return match[0]
                        .replace(
                            /\s+/g,
                            '_'
                        )
                        .replace(
                            /-/g,
                            '_'
                        );
                }

                /*
                 * ====================================
                 * PR SUCCESS DETECTION
                 * ====================================
                 */

                function isPRCreationConfirmed(
                    text
                ) {

                    const lowerText =
                        text.toLowerCase();

                    const hasPRNumber =
                        /\bPR[_\s-]?\d+\b/i.test(
                            text
                        );

                    if (!hasPRNumber) {
                        return false;
                    }

                    const successWords = [
                        'created successfully',
                        'successfully created',
                        'creation successful',
                        'purchase requisition created',
                        'requisition created successfully'
                    ];

                    return successWords.some(
                        word =>
                            lowerText.includes(
                                word
                            )
                    );
                }

                /*
                 * ====================================
                 * START TEST
                 * ====================================
                 */

                console.log('');

                console.log(
                    '===================================='
                );

                console.log(
                    'AI PLAYWRIGHT TEST STARTED'
                );

                console.log(
                    '===================================='
                );

                console.log(
                    `Model : ${GEMINI_MODEL}`
                );

                console.log(
                    'Tier  : FREE'
                );

                console.log(
                    'API   : API KEY'
                );

                console.log(
                    'Thinking : MINIMAL'
                );

                console.log(
                    'Max Output Tokens : 50'
                );

                console.log(
                    '===================================='
                );

                /*
                 * ====================================
                 * LOGIN
                 * ====================================
                 */

                await page.goto(
                    credentials.loginUrl
                );

                await loginPage.login(
                    credentials.user.email,
                    credentials.user.password
                );

                /*
                 * ====================================
                 * OPEN PROCUREMENT AGENT
                 * ====================================
                 */

                await prChatPage
                    .openProcurementAgent();

                /*
                 * ====================================
                 * FIRST GEMINI REQUEST
                 * ====================================
                 */

                const firstPrompt = `
Start a Purchase Requisition.

Generate a natural dynamic user request.

Rules:
- Mention one realistic item and quantity.
- Do not provide business entity.
- Do not provide buyer.
- Do not provide currency.
- Do not provide delivery location.
- Return JSON only.

{"action":"send_message","message":"..."}
`;

                const firstAIResponse =
                    await askGemini(
                        firstPrompt
                    );

                const firstAction =
                    parseAIResponse(
                        firstAIResponse
                    );

                /*
                 * ====================================
                 * VALIDATE FIRST ACTION
                 * ====================================
                 */

                if (
                    firstAction.action !==
                    'send_message'
                ) {

                    throw new Error(
                        `Invalid first AI action:\n${firstAIResponse}`
                    );
                }

                if (
                    !firstAction.message ||
                    !firstAction.message.trim()
                ) {

                    throw new Error(
                        'Gemini generated an empty first message.'
                    );
                }

                /*
                 * ====================================
                 * STEP 1
                 * ====================================
                 */

                console.log('');

                console.log(
                    '===================================='
                );

                console.log(
                    `STEP ${step}`
                );

                console.log(
                    '===================================='
                );

                console.log(
                    `USER : ${firstAction.message}`
                );

                /*
                 * ====================================
                 * SEND FIRST MESSAGE
                 * ====================================
                 */

                const previousMessageCount =
                    await prChatPage
                        .getMessageCount();

                await prChatPage.sendMessage(
                    firstAction.message
                );

                let agentResponse =
                    await prChatPage
                        .waitForNewResponse(
                            previousMessageCount,
                            firstAction.message
                        );

                console.log(
                    `AGENT: ${agentResponse}`
                );

                /*
                 * ====================================
                 * STORE CONVERSATION
                 * ====================================
                 */

                chatHistory.push({
                    role: 'user',
                    message:
                        firstAction.message
                });

                chatHistory.push({
                    role: 'agent',
                    message:
                        agentResponse
                });

                /*
                 * ====================================
                 * CHECK PR NUMBER
                 * ====================================
                 */

                prNumber =
                    extractPRNumber(
                        agentResponse
                    );

                if (prNumber) {

                    console.log('');

                    console.log(
                        `PR NUMBER FOUND: ${prNumber}`
                    );
                }

                /*
                 * ====================================
                 * CHECK PR SUCCESS
                 * ====================================
                 */

                if (
                    isPRCreationConfirmed(
                        agentResponse
                    )
                ) {

                    completed =
                        true;

                    console.log('');

                    console.log(
                        'PR CREATION CONFIRMED'
                    );
                }

                /*
                 * ====================================
                 * DYNAMIC LOOP
                 * ====================================
                 */

                while (
                    !completed &&
                    step < maxSteps
                ) {

                    /*
                     * --------------------------------
                     * CHECK WHETHER AGENT ALREADY
                     * CREATED THE PR
                     * --------------------------------
                     */

                    if (
                        prNumber &&
                        isPRCreationConfirmed(
                            agentResponse
                        )
                    ) {

                        completed =
                            true;

                        break;
                    }

                    step++;

                    /*
                     * --------------------------------
                     * GET PREVIOUS USER MESSAGE
                     * --------------------------------
                     */

                    const previousUserMessages =
                        chatHistory.filter(
                            item =>
                                item.role ===
                                'user'
                        );

                    const previousUserMessage =
                        previousUserMessages.length
                            ? previousUserMessages[
                                previousUserMessages.length - 1
                            ].message
                            : '';

                    /*
                     * --------------------------------
                     * SMALL DYNAMIC PROMPT
                     * --------------------------------
                     */

                    const nextPrompt = `
Previous user:
${previousUserMessage}

Latest Agent response:
${agentResponse}

Reply to the Agent's latest message.

Rules:
- Answer exactly what the Agent asks.
- If options are provided, choose one of those options.
- If information is requested, provide realistic data.
- Do not repeat the previous answer.
- Do not invent options.
- If the Agent confirms PR creation with a PR number, complete.
- Return JSON only.

{"action":"send_message","message":"..."}

or

{"action":"complete","message":""}
`;

                    /*
                     * --------------------------------
                     * GEMINI DECISION
                     * --------------------------------
                     */

                    const aiResponse =
                        await askGemini(
                            nextPrompt
                        );

                    const nextAction =
                        parseAIResponse(
                            aiResponse
                        );

                    /*
                     * --------------------------------
                     * LOG AI DECISION
                     * --------------------------------
                     */

                    console.log('');

                    console.log(
                        '===================================='
                    );

                    console.log(
                        `STEP ${step}`
                    );

                    console.log(
                        '===================================='
                    );

                    console.log(
                        `AI DECISION: ${JSON.stringify(
                            nextAction
                        )}`
                    );

                    /*
                     * --------------------------------
                     * COMPLETE
                     * --------------------------------
                     */

                    if (
                        nextAction.action ===
                        'complete'
                    ) {

                        if (prNumber) {

                            completed =
                                true;

                            console.log('');

                            console.log(
                                'AI MARKED PR AS COMPLETE'
                            );

                            break;
                        }

                        /*
                         * If AI says complete but
                         * Playwright did not detect
                         * a PR number, continue.
                         */

                        console.log('');

                        console.log(
                            'AI requested completion but PR number was not detected.'
                        );

                        continue;
                    }

                    /*
                     * --------------------------------
                     * VALIDATE ACTION
                     * --------------------------------
                     */

                    if (
                        nextAction.action !==
                        'send_message'
                    ) {

                        throw new Error(
                            `Invalid AI action:\n${JSON.stringify(
                                nextAction
                            )}`
                        );
                    }

                    if (
                        !nextAction.message ||
                        !nextAction.message.trim()
                    ) {

                        throw new Error(
                            'Gemini generated an empty message.'
                        );
                    }

                    /*
                     * --------------------------------
                     * SEND NEXT USER MESSAGE
                     * --------------------------------
                     */

                    console.log(
                        `USER : ${nextAction.message}`
                    );

                    const currentMessageCount =
                        await prChatPage
                            .getMessageCount();

                    await prChatPage.sendMessage(
                        nextAction.message
                    );

                    /*
                     * --------------------------------
                     * WAIT FOR LIVE AGENT RESPONSE
                     * --------------------------------
                     */

                    agentResponse =
                        await prChatPage
                            .waitForNewResponse(
                                currentMessageCount,
                                nextAction.message
                            );

                    console.log(
                        `AGENT: ${agentResponse}`
                    );

                    /*
                     * --------------------------------
                     * STORE CONVERSATION
                     * --------------------------------
                     */

                    chatHistory.push({
                        role: 'user',
                        message:
                            nextAction.message
                    });

                    chatHistory.push({
                        role: 'agent',
                        message:
                            agentResponse
                    });

                    /*
                     * --------------------------------
                     * CHECK PR NUMBER
                     * --------------------------------
                     */

                    const detectedPRNumber =
                        extractPRNumber(
                            agentResponse
                        );

                    if (
                        detectedPRNumber
                    ) {

                        prNumber =
                            detectedPRNumber;

                        console.log('');

                        console.log(
                            `PR NUMBER FOUND: ${prNumber}`
                        );
                    }

                    /*
                     * --------------------------------
                     * CHECK SUCCESS BEFORE
                     * CALLING GEMINI AGAIN
                     * --------------------------------
                     */

                    if (
                        prNumber &&
                        isPRCreationConfirmed(
                            agentResponse
                        )
                    ) {

                        completed =
                            true;

                        console.log('');

                        console.log(
                            '===================================='
                        );

                        console.log(
                            'PR CREATION CONFIRMED'
                        );

                        console.log(
                            `PR NUMBER : ${prNumber}`
                        );

                        console.log(
                            '===================================='
                        );

                        break;
                    }
                }

                /*
                 * ====================================
                 * FINAL VALIDATION
                 * ====================================
                 */

                if (!completed) {

                    throw new Error(
                        `AI could not complete Supplier creation within ${maxSteps} steps.`
                    );
                }

                expect(
                    prNumber,
                    'PR number was not generated'
                ).not.toBeNull();

                /*
                 * ====================================
                 * SESSION SUMMARY
                 * ====================================
                 */

                console.log('');

                console.log(
                    '===================================='
                );

                console.log(
                    'GEMINI SESSION SUMMARY'
                );

                console.log(
                    '===================================='
                );

                console.log(
                    `Model            : ${GEMINI_MODEL}`
                );

                console.log(
                    `Requests         : ${geminiRequestCount}`
                );

                console.log(
                    `Input tokens     : ${totalInputTokens}`
                );

                console.log(
                    `Output tokens    : ${totalOutputTokens}`
                );

                console.log(
                    `Thinking tokens  : ${totalThoughtTokens}`
                );

                console.log(
                    `Cached tokens    : ${totalCachedTokens}`
                );

                console.log(
                    `TOTAL TOKENS     : ${totalTokens}`
                );

                console.log(
                    '===================================='
                );

                /*
                 * ====================================
                 * FINAL RESULT
                 * ====================================
                 */

                console.log('');

                console.log(
                    '===================================='
                );

                console.log(
                    'AI PR TEST RESULT'
                );

                console.log(
                    '===================================='
                );

                console.log(
                    `PR Number : ${prNumber}`
                );

                console.log(
                    `Steps     : ${step}`
                );

                console.log(
                    'Status    : SUCCESS'
                );

                console.log(
                    '===================================='
                );
            }
        );
    }
);