// Playwright test for TC_001: Title not provided (Account Creation)
// This test uses the Page Object Model and test data from test-data/title-not-provided-data.json

import { test, expect } from '@playwright/test';
import { AccountPage } from '../pages/AccountPage';
import * as testData from '../test-data/title-not-provided-data.json';

// Utility function to get test data safely
function getTestData(scenarioKey: string) {
  if (!(scenarioKey in testData)) {
    throw new Error(`Test data for scenario '${scenarioKey}' not found in title-not-provided-data.json`);
  }
  // @ts-ignore
  return testData[scenarioKey];
}

test.describe('Account Creation - TC_001: Title not provided', () => {
  let accountPage: AccountPage;

  test.beforeEach(async ({ page }) => {
    accountPage = new AccountPage(page);
  });

  test('should create a new account successfully with valid data', async ({ page }) => {
    const data = getTestData('validAccountCreation');
    // Launch Salesforce (assume URL is set in env or config)
    const salesforceUrl = process.env.SALESFORCE_URL || 'https://lockton1--cbqa.sandbox.my.salesforce.com';
    await accountPage.launchSalesforce(salesforceUrl);

    // Login (assume credentials are set in env or config)
    await accountPage.enterUsername(process.env.SF_USERNAME || 'test.user@company.com');
    await accountPage.enterPassword(process.env.SF_PASSWORD || 'Password123');
    await accountPage.clickLoginButton();

    // Wait for home page or setup icon (could be improved with a HomePage.waitForLoaded())
    await page.waitForTimeout(3000); // Replace with a better wait if available

    // Click Setup and login as user (simulate admin login-as flow)
    await accountPage.clickSetupButton();
    await accountPage.searchUserInSetup('Jennifer Beauregard');
    await accountPage.clickLoginAsUser();

    // Wait for user context switch
    await page.waitForTimeout(2000);

    // Click New to create new Account
    await accountPage.clickNewAccountButton();

    // Search for business name and create new
    await accountPage.searchBusinessName(data.accountName);
    await accountPage.clickCreateNewButton();

    // Fill in Account details
    await accountPage.enterAccountName(data.accountName);
    await accountPage.searchPrimaryProducerLead('Emily Anand');
    await accountPage.searchPrimaryServiceLead('Jennifer Beauregard');
    await accountPage.enterPrimaryAccountEffectiveDate('11/27/2025');
    await accountPage.enterBillingAddress('USA');
    await accountPage.clickSaveButton();

    // Edit and fill additional details
    await accountPage.clickEditButton();
    await accountPage.enterFEINNumber('67-6778889');
    await accountPage.enterWebsiteAndPhone('www.google.com', '9999897867');
    await accountPage.enterPrimaryNAICSDescription('Hazardous waste collection');
    await accountPage.enterAnnualRevenue('2330');
    await accountPage.enterNumberOfEmployees('12');
    await accountPage.searchDnBCompanyProfile('Apple');
    await accountPage.clickSaveAfterEdit();

    // Go to Related tab
    await accountPage.clickRelatedTab();

    // Validate account creation
    await accountPage.validateAccountCreated(data.accountName);
  });

  test('should show error when required fields are missing', async ({ page }) => {
    const data = getTestData('missingRequiredFields');
    const salesforceUrl = process.env.SALESFORCE_URL || 'https://lockton1--cbqa.sandbox.my.salesforce.com';
    await accountPage.launchSalesforce(salesforceUrl);
    await accountPage.enterUsername(process.env.SF_USERNAME || 'test.user@company.com');
    await accountPage.enterPassword(process.env.SF_PASSWORD || 'Password123');
    await accountPage.clickLoginButton();
    await page.waitForTimeout(3000);
    await accountPage.clickSetupButton();
    await accountPage.searchUserInSetup('Jennifer Beauregard');
    await accountPage.clickLoginAsUser();
    await page.waitForTimeout(2000);
    await accountPage.clickNewAccountButton();
    await accountPage.searchBusinessName(data.accountName);
    await accountPage.clickCreateNewButton();
    // Do not fill required fields
    await accountPage.clickSaveButton();
    // Expect error message (would need a method like accountPage.getErrorMessages())
    // For now, just check that an error is thrown or visible
    // TODO: Implement error validation in AccountPage
    // Example:
    // const errorMsg = await accountPage.getErrorMessage();
    // expect(errorMsg).toContain('Required fields');
  });

  test('should not allow duplicate account creation', async ({ page }) => {
    const data = getTestData('duplicateAccount');
    const salesforceUrl = process.env.SALESFORCE_URL || 'https://lockton1--cbqa.sandbox.my.salesforce.com';
    await accountPage.launchSalesforce(salesforceUrl);
    await accountPage.enterUsername(process.env.SF_USERNAME || 'test.user@company.com');
    await accountPage.enterPassword(process.env.SF_PASSWORD || 'Password123');
    await accountPage.clickLoginButton();
    await page.waitForTimeout(3000);
    await accountPage.clickSetupButton();
    await accountPage.searchUserInSetup('Jennifer Beauregard');
    await accountPage.clickLoginAsUser();
    await page.waitForTimeout(2000);
    await accountPage.clickNewAccountButton();
    await accountPage.searchBusinessName(data.accountName);
    await accountPage.clickCreateNewButton();
    await accountPage.enterAccountName(data.accountName);
    await accountPage.clickSaveButton();
    // TODO: Implement duplicate error validation
    // const errorMsg = await accountPage.getErrorMessage();
    // expect(errorMsg).toContain('already exists');
  });

  // Additional edge and negative tests can be added here using the testData scenarios
});
