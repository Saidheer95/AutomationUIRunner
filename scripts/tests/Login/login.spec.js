const { test } = require('@playwright/test');
const { LoginPage, loadCredentials } = require('../../pages/Login/login.page');

test.describe('Login page', () => {
  test('@smoke should login with credentials from file', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials = loadCredentials();

    await page.goto(credentials.loginUrl);
    await loginPage.login(credentials.requestor.email, credentials.requestor.password);

    // Add assertions for a successful login here.
    await page.waitForURL('**/dashboard');
  });

  test('@smoke login with invalid credentials should show an error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials = loadCredentials();

    await page.goto(credentials.loginUrl);
    await loginPage.login("test@gmail.com", "123456");

    // Add assertions for an unsuccessful login here.
    await page.waitForURL('**/login');
  });

  test('login with empty credentials should show an error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials = loadCredentials();

    await page.goto(credentials.loginUrl);
    await loginPage.login('', '');  
    // Add assertions for an unsuccessful login here.
    await page.waitForURL('**/login');
  });

   test('login with invalid email should show an error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials = loadCredentials();

    await page.goto(credentials.loginUrl);
    await loginPage.login('test^email.com', 'somepassword');  
    // Add assertions for an unsuccessful login here.
    await page.waitForURL('**/login');
  });
   test('login with invalid password should show an error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const credentials = loadCredentials();  
    
    await page.goto(credentials.loginUrl);
    await loginPage.login('demosup@g.com','Test@145');

    // Add assertions for an unsuccessful login here.
    await page.waitForURL('**/login');
  });

});
