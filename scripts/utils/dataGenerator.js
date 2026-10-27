const { faker } = require('@faker-js/faker');

function formatDateTimeLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDateOnly(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Generate RFQ dates
 *
 * Open  = current time + 5 minutes
 * Close = open + 3 days
 */
function generateRFQDates() {
    const now = new Date();

    const openDate = new Date(now);
    openDate.setMinutes(openDate.getMinutes() + 5);

    const closeDate = new Date(openDate);
    closeDate.setDate(closeDate.getDate() + 3);

    return {
        openDate: formatDateTimeLocal(openDate),
        closeDate: formatDateTimeLocal(closeDate)
    };
}

/**
 * Generate RFP dates
 *
 * Open  = current time + 5 minutes
 * Close = open + 3 days
 */
function generateRFPDates() {
    const now = new Date();

    const openDate = new Date(now);
    openDate.setMinutes(openDate.getMinutes() + 5);

    const closeDate = new Date(openDate);
    closeDate.setDate(closeDate.getDate() + 3);

    return {
        openDate: formatDateTimeLocal(openDate),
        closeDate: formatDateTimeLocal(closeDate)
    };
}

/**
 * Generate Tender dates
 *
 * Open          = current time + 5 minutes
 * Close         = open + 3 days
 * Envelope Open = close + 1 hour
 */
function generateTenderDates() {
    const now = new Date();

    const openDate = new Date(now);
    openDate.setMinutes(openDate.getMinutes() + 5);

    const closeDate = new Date(openDate);
    closeDate.setDate(closeDate.getDate() + 3);

    const envelopeOpenDate = new Date(closeDate);
    envelopeOpenDate.setHours(envelopeOpenDate.getHours() + 1);

    return {
        openDate: formatDateTimeLocal(openDate),
        closeDate: formatDateTimeLocal(closeDate),
        envelopeOpenDate: formatDateTimeLocal(envelopeOpenDate)
    };
}

/**
 * Generate Contract dates
 *
 * Open  = current date
 * Close = open + 3 days
 */
function generateContractDates() {
    const now = new Date();

    const openDate = new Date(now);

    const closeDate = new Date(openDate);
    closeDate.setDate(closeDate.getDate() + 3);

    return {
        openDate: formatDateOnly(openDate),
        closeDate: formatDateOnly(closeDate)
    };
}

function generateDescription() {
    const descriptions = [
        'The supplier must provide high-quality materials within the agreed delivery timeline.',
        'The supplier should ensure that all products meet the required quality and technical standards.',
        'The supplier must provide reliable products with appropriate documentation and certification.',
        'The supplier should deliver the required materials according to the approved project schedule.',
        'The supplier must ensure that all supplied items comply with the specified technical requirements.'
    ];

    return faker.helpers.arrayElement(descriptions);
}

function generateCriteriaDescription() {
    const criteria = [
        'The supplier must demonstrate the ability to deliver the required materials within the specified timeline.',
        'The supplier must provide products that meet the required technical and quality standards.',
        'The supplier should demonstrate sufficient experience in delivering similar products or services.',
        'The supplier must ensure that all products comply with the applicable specifications and requirements.',
        'The supplier should provide adequate support and documentation throughout the delivery process.'
    ];

    return faker.helpers.arrayElement(criteria);
}

function generateTermsDescription() {
    const terms = [
        'Payment will be processed according to the agreed commercial terms after successful delivery.',
        'All supplied products must comply with the agreed specifications and quality requirements.',
        'The supplier is responsible for ensuring timely delivery of all required materials.',
        'Any changes to the agreed terms must be approved by the authorized procurement team.',
        'The supplier must provide all required documentation before the final payment is processed.'
    ];

    return faker.helpers.arrayElement(terms);
}

function generateReferenceNumber(prefix) {
    return `${prefix}-${faker.string.alphanumeric(8).toUpperCase()}`;
}

/**
 * Common data
 */
function generateCommonData(type) {
    return {
        type,
        description: generateDescription(),
        criteriaDescription: generateCriteriaDescription(),
        termsDescription: generateTermsDescription(),
        referenceNumber: generateReferenceNumber(type)
    };
}

/**
 * Generate RFQ test data
 */
function generateRFQTestData() {
    return {
        ...generateCommonData('RFQ'),
        ...generateRFQDates()
    };
}

/**
 * Generate RFP test data
 */
function generateRFPTestData() {
    return {
        ...generateCommonData('RFP'),
        ...generateRFPDates()
    };
}

/**
 * Generate Tender test data
 */
function generateTenderTestData() {
    return {
        ...generateCommonData('TENDER'),
        ...generateTenderDates()
    };
}

/**
 * Generate Contract test data
 */
function generateContractTestData() {
    return {
        ...generateCommonData('CONTRACT'),
        ...generateContractDates()
    };
}

/**
 * Generic generator
 *
 * Can still be used when the type is dynamic.
 */
function generateBidTestData(type) {
    if (!type) {
        throw new Error(
            'Bid type is required. Supported types: RFQ, RFP, TENDER, CONTRACT'
        );
    }

    const normalizedType = type.toUpperCase();

    switch (normalizedType) {
        case 'RFQ':
            return generateRFQTestData();

        case 'RFP':
            return generateRFPTestData();

        case 'TENDER':
            return generateTenderTestData();

        case 'CONTRACT':
            return generateContractTestData();

        default:
            throw new Error(
                `Unsupported bid type: ${type}. Supported types: RFQ, RFP, TENDER, CONTRACT`
            );
    }
}

module.exports = {
    generateBidTestData,
    generateRFQTestData,
    generateRFPTestData,
    generateTenderTestData,
    generateContractTestData,
    generateRFQDates,
    generateRFPDates,
    generateTenderDates,
    generateContractDates,
    generateDescription,
    generateCriteriaDescription,
    generateTermsDescription,
    generateReferenceNumber
};