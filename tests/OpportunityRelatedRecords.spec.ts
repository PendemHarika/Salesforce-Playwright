// tests/OpportunityRelatedRecords.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { AccountPage } from '../pages/AccountPage';
import * as fs from 'fs';
import * as path from 'path';

// Load test data
const testDataPath = path.resolve(__dirname, '../test-data/verify-opportunity-related-contact-and-account-data.json');
const testDataRaw = fs.readFileSync(testDataPath, 'utf-8');
const testData = JSON.parse(testDataRaw);

// Helper to build full contact name
function getContactFullName(contact: { firstName: string; lastName: string }) {
  return `${contact.firstName} ${contact.lastName}`;
}

test.describe('TC_001: Verify opportunity, related contact and related account is created for existing account', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let accountPage: AccountPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    accountPage = new AccountPage(page);
    // Login (replace with actual credentials or data provider as needed)
    await loginPage.goto();
    await loginPage.enterUsername(process.env.SF_USERNAME || 'test.user');
    await loginPage.enterPassword(process.env.SF_PASSWORD || 'Password123');
    await loginPage.clickLogin();
    await homePage.waitForHomePageLoaded();
  });

  test('should create opportunity, related contact, and related account for existing account [happy path]', async ({ page }) => {
    const data = testData.validOpportunityCreation;
    // Prepare opportunity data for the page object
    const opportunityData = {
      opportunityName: data.opportunityName,
      stage: data.opportunityStage,
      effectiveDate: data.opportunityCloseDate, // Use close date as effective date for demo; adjust as needed
      closeDate: data.opportunityCloseDate,
      allocationPercent: '100'
    };
    const contactData = {
      contactName: getContactFullName(data.relatedContact),
      title: data.relatedContact.role, // Use role as title for demo; adjust as needed
      role: data.relatedContact.role
    };
    const relatedAccountData = {
      accountName: data.relatedAccount.accountName,
      fein: data.relatedAccount.accountNumber // Use account number as FEIN for demo; adjust as needed
    };
    // Run the full workflow
    await accountPage.createOpportunityWithRelatedContactAndAccount(
      data.accountName,
      opportunityData,
      contactData,
      relatedAccountData
    );
    // Validate records were created
    await accountPage.validateOpportunityAndRelatedRecords(
      opportunityData.opportunityName,
      contactData.contactName,
      relatedAccountData.accountName
    );
  });

  test('should handle missing contact email (edge case)', async ({ page }) => {
    const data = testData.edgeCases[0];
    const opportunityData = {
      opportunityName: data.opportunityName,
      stage: data.opportunityStage,
      effectiveDate: data.opportunityCloseDate,
      closeDate: data.opportunityCloseDate,
      allocationPercent: '100'
    };
    const contactData = {
      contactName: getContactFullName(data.relatedContact),
      title: data.relatedContact.role,
      role: data.relatedContact.role
    };
    const relatedAccountData = {
      accountName: data.relatedAccount.accountName,
      fein: data.relatedAccount.accountNumber
    };
    await accountPage.createOpportunityWithRelatedContactAndAccount(
      data.accountName,
      opportunityData,
      contactData,
      relatedAccountData
    );
    await accountPage.validateOpportunityAndRelatedRecords(
      opportunityData.opportunityName,
      contactData.contactName,
      relatedAccountData.accountName
    );
  });

  test('should handle zero opportunity amount (edge case)', async ({ page }) => {
    const data = testData.edgeCases[1];
    const opportunityData = {
      opportunityName: data.opportunityName,
      stage: data.opportunityStage,
      effectiveDate: data.opportunityCloseDate,
      closeDate: data.opportunityCloseDate,
      allocationPercent: '100'
    };
    const contactData = {
      contactName: getContactFullName(data.relatedContact),
      title: data.relatedContact.role,
      role: data.relatedContact.role
    };
    const relatedAccountData = {
      accountName: data.relatedAccount.accountName,
      fein: data.relatedAccount.accountNumber
    };
    await accountPage.createOpportunityWithRelatedContactAndAccount(
      data.accountName,
      opportunityData,
      contactData,
      relatedAccountData
    );
    await accountPage.validateOpportunityAndRelatedRecords(
      opportunityData.opportunityName,
      contactData.contactName,
      relatedAccountData.accountName
    );
  });

  test('should handle max length fields (boundary value)', async ({ page }) => {
    const data = testData.boundaryValues[0];
    const opportunityData = {
      opportunityName: data.opportunityName,
      stage: data.opportunityStage,
      effectiveDate: data.opportunityCloseDate,
      closeDate: data.opportunityCloseDate,
      allocationPercent: '100'
    };
    const contactData = {
      contactName: getContactFullName(data.relatedContact),
      title: data.relatedContact.role,
      role: data.relatedContact.role
    };
    const relatedAccountData = {
      accountName: data.relatedAccount.accountName,
      fein: data.relatedAccount.accountNumber
    };
    await accountPage.createOpportunityWithRelatedContactAndAccount(
      data.accountName,
      opportunityData,
      contactData,
      relatedAccountData
    );
    await accountPage.validateOpportunityAndRelatedRecords(
      opportunityData.opportunityName,
      contactData.contactName,
      relatedAccountData.accountName
    );
  });
});
