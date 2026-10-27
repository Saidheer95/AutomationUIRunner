const { expect } = require('@playwright/test');

const DEFAULT_TIMEOUT = 30000;

function assertionOptions(message, timeout = DEFAULT_TIMEOUT) {
  const options = { timeout };

  if (message) {
    options.message = message;
  }

  return options;
}

async function assertVisible(locator, timeout = DEFAULT_TIMEOUT, message) {
  await expect(locator).toBeVisible(assertionOptions(message, timeout));
}

async function assertHidden(locator, timeout = DEFAULT_TIMEOUT, message) {
  await expect(locator).toBeHidden(assertionOptions(message, timeout));
}

async function assertEnabled(locator, timeout = DEFAULT_TIMEOUT, message) {
  await expect(locator).toBeEnabled(assertionOptions(message, timeout));
}

async function assertDisabled(locator, timeout = DEFAULT_TIMEOUT, message) {
  await expect(locator).toBeDisabled(assertionOptions(message, timeout));
}

async function assertChecked(locator, timeout = DEFAULT_TIMEOUT, message) {
  await expect(locator).toBeChecked(assertionOptions(message, timeout));
}

async function assertUnchecked(locator, timeout = DEFAULT_TIMEOUT, message) {
  await expect(locator).not.toBeChecked(assertionOptions(message, timeout));
}

async function assertHasText(locator, text, timeout = DEFAULT_TIMEOUT, message) {
  await expect(locator).toContainText(text, assertionOptions(message, timeout));
}

async function assertHasValue(locator, value, timeout = DEFAULT_TIMEOUT, message) {
  await expect(locator).toHaveValue(value, assertionOptions(message, timeout));
}

async function assertCount(locator, count, timeout = DEFAULT_TIMEOUT, message) {
  await expect(locator).toHaveCount(count, assertionOptions(message, timeout));
}

async function assertHasAttribute(locator, attribute, value, timeout = DEFAULT_TIMEOUT, message) {
  await expect(locator).toHaveAttribute(
    attribute,
    value,
    assertionOptions(message, timeout)
  );
}

async function assertPageUrl(page, url, timeout = DEFAULT_TIMEOUT, message) {
  await expect(page).toHaveURL(url, assertionOptions(message, timeout));
}

async function assertPageTitle(page, title, timeout = DEFAULT_TIMEOUT, message) {
  await expect(page).toHaveTitle(title, assertionOptions(message, timeout));
}

async function assertPageContainsText(page, text, timeout = DEFAULT_TIMEOUT, message) {
  await expect(page.locator('body')).toContainText(
    text,
    assertionOptions(message, timeout)
  );
}

function assertDefined(value, message = 'Expected value to be defined') {
  expect(value, message).toBeDefined();
}

function assertNonEmpty(value, message = 'Expected value to be non-empty') {
  expect(value, message).toBeTruthy();
}

function assertEqual(actual, expected, message) {
  expect(actual, message).toEqual(expected);
}

function assertGreaterThan(actual, expected, message) {
  expect(actual, message).toBeGreaterThan(expected);
}

function assertContains(collection, value, message) {
  expect(collection, message).toContain(value);
}

module.exports = {
  expect,
  assertVisible,
  assertHidden,
  assertEnabled,
  assertDisabled,
  assertChecked,
  assertUnchecked,
  assertHasText,
  assertHasValue,
  assertCount,
  assertHasAttribute,
  assertPageUrl,
  assertPageTitle,
  assertPageContainsText,
  assertDefined,
  assertNonEmpty,
  assertEqual,
  assertGreaterThan,
  assertContains
};