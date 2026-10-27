const { test, expect } = require('@playwright/test');

const {    GoogleGenAI } = require('@google/genai');

const dotenv =   require('dotenv');

const {
    LoginPage,
    loadCredentials
} =
    require('../../pages/Login/login.page');

const {
    SupplierChatPage
} =
    require('../../pages/Supplier/supplier_chat_ai.page');

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
    'AI Dynamic Supplier Creation',
    () => {

        test(
            'Create Supplier Dynamically Using AI',
            async ({ page }) => {

                test.setTimeout(
                    180000
                );

                const loginPage =
                    new LoginPage(page);

                const supplierChatPage =
                    new SupplierChatPage(page);

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

                let supplierNumber =
                    null;

                let supplierName =
                    null;

                let completed =
                    false;

                let step =
                    1;

                const maxSteps =
                    15;

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
                 * SUPPLIER NUMBER EXTRACTION
                 * ====================================
                 */

                function extractSupplierNumber(
                    text
                ) {

                    const patterns = [

                        /\bSUP[_\s-]?\d+\b/i,

                        /\bSUPPLIER[_\s-]?\d+\b/i,

                        /\bVENDOR[_\s-]?\d+\b/i,

                        /\bVEN[_\s-]?\d+\b/i

                    ];

                    for (
                        const pattern
                        of patterns
                    ) {

                        const match =
                            text.match(
                                pattern
                            );

                        if (match) {

                            return match[0]
                                .replace(
                                    /\s+/g,
                                    '_'
                                )
                                .replace(
                                    /-/g,
                                    '_'
                                )
                                .toUpperCase();
                        }
                    }

                    return null;
                }

                /*
                 * ====================================
                 * SUPPLIER NAME EXTRACTION
                 * ====================================
                 */

                function extractSupplierName(
                    text
                ) {

                    const patterns = [

                        /supplier\s+(?:named|name[d]?\s*(?:is|:)?|called)\s+["']?([^"'\n,.]+)["']?/i,

                        /supplier\s+["']([^"']+)["']/i,

                        /vendor\s+(?:named|name[d]?\s*(?:is|:)?|called)\s+["']?([^"'\n,.]+)["']?/i,

                        /vendor\s+["']([^"']+)["']/i,

                        /supplier\s*:\s*([^\n,]+)/i,

                        /vendor\s*:\s*([^\n,]+)/i

                    ];

                    for (
                        const pattern
                        of patterns
                    ) {

                        const match =
                            text.match(
                                pattern
                            );

                        if (match) {

                            return match[1]
                                .trim();
                        }
                    }

                    return null;
                }

                /*
                 * ====================================
                 * SUPPLIER SUCCESS DETECTION
                 * ====================================
                 */

                function isSupplierCreationConfirmed(
                    text
                ) {

                    const lowerText =
                        text.toLowerCase();

                    const hasSupplierNumber =
                        extractSupplierNumber(
                            text
                        ) !== null;

                    const successWords = [

                        'created successfully',

                        'successfully created',

                        'creation successful',

                        'supplier created',

                        'supplier has been created',

                        'supplier was created',

                        'vendor created',

                        'vendor has been created',

                        'vendor was created',

                        'supplier registration completed',

                        'supplier registered successfully',

                        'vendor registered successfully'

                    ];

                    const hasSuccessMessage =
                        successWords.some(
                            word =>
                                lowerText.includes(
                                    word
                                )
                        );

                    return (
                        hasSuccessMessage &&
                        (
                            hasSupplierNumber ||
                            lowerText.includes(
                                'supplier'
                            ) ||
                            lowerText.includes(
                                'vendor'
                            )
                        )
                    );
                }

                /*
                 * ====================================
                 * TEST START
                 * ====================================
                 */

                console.log('');

                console.log(
                    '===================================='
                );

                console.log(
                    'AI PLAYWRIGHT SUPPLIER TEST STARTED'
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
                 * OPEN SUPPLIER AGENT
                 * ====================================
                 */

                await supplierChatPage
                    .openSupplierAgent();

                /*
                 * ====================================
                 * FIRST GEMINI REQUEST
                 * ====================================
                 */

                const firstPrompt = `
Start Supplier Registration.

Generate a natural dynamic user request to create/register a supplier.

Rules:
- Generate a realistic supplier/company name.
- Mention that the user wants to register/create the supplier.
- Do not provide unnecessary fields.
- Do not provide supplier ID.
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
                        'Gemini generated an empty first supplier message.'
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
                 * GET CURRENT AGENT MESSAGE COUNT
                 * ====================================
                 */

                const previousAgentMessageCount =
                    await supplierChatPage
                        .getAgentMessageCount();

                /*
                 * ====================================
                 * SEND FIRST MESSAGE
                 * ====================================
                 */

                await supplierChatPage
                    .sendMessage(
                        firstAction.message
                    );

                /*
                 * ====================================
                 * WAIT FOR NEW AGENT RESPONSE
                 * ====================================
                 */

                let agentResponse =
                    await supplierChatPage
                        .waitForNewResponse(
                            previousAgentMessageCount
                        );

                console.log(
                    `AGENT: ${agentResponse}`
                );

                /*
                 * ====================================
                 * EXTRACT SUPPLIER INFORMATION
                 * ====================================
                 */

                supplierNumber =
                    extractSupplierNumber(
                        agentResponse
                    );

                supplierName =
                    extractSupplierName(
                        firstAction.message
                    );

                if (
                    supplierNumber
                ) {

                    console.log('');

                    console.log(
                        `SUPPLIER NUMBER FOUND: ${supplierNumber}`
                    );
                }

                if (
                    supplierName
                ) {

                    console.log('');

                    console.log(
                        `SUPPLIER NAME: ${supplierName}`
                    );
                }

                /*
                 * ====================================
                 * CHECK SUCCESS
                 * ====================================
                 */

                if (
                    isSupplierCreationConfirmed(
                        agentResponse
                    )
                ) {

                    completed =
                        true;

                    console.log('');

                    console.log(
                        'SUPPLIER CREATION CONFIRMED'
                    );
                }

                /*
                 * ====================================
                 * DYNAMIC AI CONVERSATION
                 * ====================================
                 */

                while (
                    !completed &&
                    step < maxSteps
                ) {

                    step++;

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

                    /*
                     * --------------------------------
                     * SEND ONLY THE LATEST AGENT
                     * RESPONSE TO GEMINI
                     * --------------------------------
                     */

                    const nextPrompt = `
The Supplier Agent has sent the following response:

${agentResponse}

Determine what the Agent wants from the user and reply appropriately.

Rules:
- Read the Agent response dynamically.
- Answer exactly what the Agent is asking.
- Generate realistic information when information is requested.
- If multiple pieces of information are requested, answer all of them.
- If choices are provided, choose only from those choices.
- Do not invent choices.
- Do not assume fixed fields.
- Do not assume a fixed conversation flow.
- Do not repeat the previous answer.
- Keep the response concise.
- If the Agent confirms supplier creation, return complete.
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

                        completed =
                            true;

                        console.log('');

                        console.log(
                            'AI MARKED SUPPLIER AS COMPLETE'
                        );

                        break;
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
                            `Invalid AI action: ${JSON.stringify(
                                nextAction
                            )}`
                        );
                    }

                    if (
                        !nextAction.message ||
                        !nextAction.message.trim()
                    ) {

                        throw new Error(
                            'Gemini generated an empty supplier message.'
                        );
                    }

                    /*
                     * --------------------------------
                     * GET CURRENT AGENT MESSAGE COUNT
                     * --------------------------------
                     */

                    const currentAgentMessageCount =
                        await supplierChatPage
                            .getAgentMessageCount();

                    /*
                     * --------------------------------
                     * SEND AI GENERATED USER MESSAGE
                     * --------------------------------
                     */

                    console.log(
                        `USER : ${nextAction.message}`
                    );

                    await supplierChatPage
                        .sendMessage(
                            nextAction.message
                        );

                    /*
                     * --------------------------------
                     * WAIT FOR NEW AGENT RESPONSE
                     * --------------------------------
                     */

                    agentResponse =
                        await supplierChatPage
                            .waitForNewResponse(
                                currentAgentMessageCount
                            );

                    console.log(
                        `AGENT: ${agentResponse}`
                    );

                    /*
                     * --------------------------------
                     * CHECK SUPPLIER NUMBER
                     * --------------------------------
                     */

                    const detectedSupplierNumber =
                        extractSupplierNumber(
                            agentResponse
                        );

                    if (
                        detectedSupplierNumber
                    ) {

                        supplierNumber =
                            detectedSupplierNumber;

                        console.log('');

                        console.log(
                            `SUPPLIER NUMBER FOUND: ${supplierNumber}`
                        );
                    }

                    /*
                     * --------------------------------
                     * CHECK SUPPLIER SUCCESS
                     * --------------------------------
                     */

                    if (
                        isSupplierCreationConfirmed(
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
                            'SUPPLIER CREATION CONFIRMED'
                        );

                        if (
                            supplierName
                        ) {

                            console.log(
                                `Supplier Name : ${supplierName}`
                            );
                        }

                        if (
                            supplierNumber
                        ) {

                            console.log(
                                `Supplier Number : ${supplierNumber}`
                            );
                        }

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
                    completed,
                    'Supplier creation was not completed'
                ).toBeTruthy();

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
                    'AI SUPPLIER TEST RESULT'
                );

                console.log(
                    '===================================='
                );

                if (
                    supplierName
                ) {

                    console.log(
                        `Supplier Name : ${supplierName}`
                    );
                }

                if (
                    supplierNumber
                ) {

                    console.log(
                        `Supplier Number : ${supplierNumber}`
                    );
                }

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
