// tests/Account.spec.ts
import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';
import { HomePage } from '../pages/HomePage';
import * as fs from 'fs';

// Load test data for TC_001: Title not provided
const testData = JSON.parse(
  fs.readFileSync(require('path').resolve(__dirname, '../test-data/title-not-provided-data.json'), 'utf-8')
);

const accountCreationData = testData.accountCreation;

// Helper to get a valid account creation data set
function getValidAccountData() {
  // Use the first valid value from each field array
  return {
    username: 'jennifer.beauregard@lockton.com.cbqa', // Example, update as needed
    password: 'TestPassword123', // Example, update as needed
    businessName: 'ABB',
    accountName: 'AB constructors',
    primaryProducerLead: 'Emily anand',
    primaryServiceLead: 'Jennifer beauguard',
    billingAddress: 'USA',
    fein: '67-6778889',
    website: 'www.google.com',
    phoneNumber: '9999897867',
    primaryNaicsDescription: 'Hazardous waste collection',
    annualRevenue: '2330',
    numberOfEmployees: '12',
    dnbCompany: 'Apple',
    primaryAccountEffectiveDate: '11/27/2025'
  };
}

test.describe('TC_001: Title not provided - New Account Creation', () => {
  let page: Page;
  let loginPage: LoginPage;
  let homePage: HomePage;
  let accountPage: AccountPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    accountPage = new AccountPage(page);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('should create a new Account successfully (TC_001)', async () => {
    const data = getValidAccountData();

    // Step 1: Launch Salesforce and login
    await page.goto('https://lockton1--cbqa.sandbox.my.salesforce.com/');
    await loginPage.enterUsername(data.username);
    await loginPage.enterPassword(data.password);
    await loginPage.clickLogin();
    // Optionally: Wait for HomePage to load/validate
    await homePage.waitForHomePageLoaded();

    // Step 2: Create new Account using AccountPage workflow
    await accountPage.createNewAccount(data);

    // Step 3: Validate Account creation (handled inside createNewAccount)
    // Optionally, add extra assertions if needed
    // For example, check for a success toast or presence of account details
    // (Handled in AccountPage.validateAccountCreated)
  });

  test('should show error when Account Name is missing', async () => {
    const data = getValidAccountData();
    data.accountName = '';

    // Step 1: Login
    await page.goto('https://lockton1--cbqa.sandbox.my.salesforce.com/');
    await loginPage.enterUsername(data.username);
    await loginPage.enterPassword(data.password);
    await loginPage.clickLogin();
    await homePage.waitForHomePageLoaded();

    // Step 2: Start Account creation
    await accountPage.createNewAccount({ ...data });

    // Step 3: Expect error (simulate the error check)
    // This assumes AccountPage.validateAccountCreated will throw if not found
    // But for negative case, check for error message
    // You may want to add a method to AccountPage to get error messages
    // For now, use Playwright assertion for a generic error toast
    const errorToast = page.locator('div[role="alert"]:has-text("Account Name is required")');
    await expect(errorToast).toBeVisible();
  });

  test('should show error for invalid email format', async () => {
    const data = getValidAccountData();
    data.email = 'invalid-email';

    await page.goto('https://lockton1--cbqa.sandbox.my.salesforce.com/');
    await loginPage.enterUsername(data.username);
    await loginPage.enterPassword(data.password);
    await loginPage.clickLogin();
    await homePage.waitForHomePageLoaded();

    await accountPage.createNewAccount({ ...data });

    // Validate error message for invalid email
    const errorToast = page.locator('div[role="alert"]:has-text("Invalid email format")');
    await expect(errorToast).toBeVisible();
  });

  test('should show error when all required fields are missing', async () => {
    const data = {
      username: 'jennifer.beauregard@lockton.com.cbqa',
      password: 'TestPassword123',
      businessName: '',
      accountName: '',
      primaryProducerLead: '',
      primaryServiceLead: '',
      billingAddress: '',
      fein: '',
      website: '',
      phoneNumber: '',
      primaryNaicsDescription: '',
      annualRevenue: '',
      numberOfEmployees: '',
      dnbCompany: '',
      primaryAccountEffectiveDate: ''
    };
    await page.goto('https://lockton1--cbqa.sandbox.my.salesforce.com/');
    await loginPage.enterUsername(data.username);
    await loginPage.enterPassword(data.password);
    await loginPage.clickLogin();
    await homePage.waitForHomePageLoaded();

    await accountPage.createNewAccount({ ...data });

    // Validate error message for missing fields
    const errorToast = page.locator('div[role="alert"]:has-text("All required fields are missing")');
    await expect(errorToast).toBeVisible();
  });

  // Add more data-driven tests as needed, using accountCreationData.fields and edgeCases
});
