const fs=require('fs');
const path=require('path');
const {expect}=require('@playwright/test');

const defaultCredentialsPath=path.join(
  __dirname,
  '..',
  '..',
  'fixtures',
  'credentials.json'
);

function loadCredentials(filePath=defaultCredentialsPath){
  let raw;

  try{
    raw=fs.readFileSync(filePath,'utf8');
  }catch(error){
    throw new Error(
      `Unable to read credentials file at ${filePath}: ${error.message}`
    );
  }

  try{
    return JSON.parse(raw);
  }catch(error){
    throw new Error(
      `Unable to parse credentials file at ${filePath}: ${error.message}`
    );
  }
}

class LoginPage{
  constructor(page){
    this.page=page;

    this.emailID=page.locator(
      '[data-testid="input-email"]'
    );

    this.passwordInput=page.locator(
      '[data-testid="input-password"]'
    );

    this.signIn=page.locator(
      '[data-testid="button-login"]'
    );

    this.clickUser=page.locator(
      '[data-testid="button-user-menu"]'
    );

    this.signOut=page.locator(
      '[data-testid="button-logout"]'
    );
  }

  async login(email,password){
    console.log(`Logging in as: ${email}`);

    await expect(this.emailID).toBeVisible();
    await expect(this.emailID).toBeEnabled();

    await this.emailID.fill(email);

    await expect(this.emailID).toHaveValue(email);

    console.log(`Email entered successfully: ${email}`);

    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordInput).toBeEnabled();

    await this.passwordInput.fill(password);

    await expect(this.signIn).toBeVisible();
    await expect(this.signIn).toBeEnabled();

    console.log(`Submitting login for: ${email}`);

    await this.signIn.click();

    console.log(`Waiting for authenticated state: ${email}`);

    await expect(this.clickUser).toBeVisible();

    await expect(this.page).toHaveURL(
      /\/app\/dashboard/
    );

    console.log(`Login completed successfully for: ${email}`);
    console.log(`Current URL after login: ${this.page.url()}`);
  }

  async waitForLoginPage(){
    console.log('Waiting for login page...');

    await expect(this.emailID).toBeVisible();
    await expect(this.emailID).toBeEnabled();

    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordInput).toBeEnabled();

    console.log('Login page is ready');
  }

 
    async logout(){
    console.log('Logging out current user');

    // 1. Verify and click the user profile menu
    await expect(this.clickUser).toBeVisible();
    await expect(this.clickUser).toBeEnabled();
    await this.clickUser.click();

    // 2. Verify and click the sign-out button
    await expect(this.signOut).toBeVisible();
    await expect(this.signOut).toBeEnabled();
    await this.signOut.click();

    // 3. Wait until the login page fields are visible again
    await this.waitForLoginPage();

    console.log('Logout completed successfully');
  }
}

module.exports={ LoginPage, loadCredentials};