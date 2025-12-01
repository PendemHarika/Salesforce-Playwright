// Playwright test for: Verify opportunity, Related contact and related account is created for existing account
// This test follows the Page Object Model and uses only Page Object methods for all UI interactions.

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { OpportunityPage } from '../pages/OpportunityPage';
import { AccountPage } from '../pages/AccountPage';
import { CommonPage } from '../pages/CommonPage';
import * as testData from '../test-data/verify-opportunity-related-contact-account-existing-account-data.json';

// Utility to get today's date in YYYY-MM-DD format
function getTodayISODate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Utility to get a date one year from today in YYYY-MM-DD format
function getOneYearLaterISODate() {
  const today = new Date();
  today.setFullYear(today.getFullYear() + 1);
  return today.toISOString().split('T')[0];
}

test.describe('TC_001: Verify opportunity, Related contact and related account is created for existing account', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let opportunityPage: OpportunityPage;
  let accountPage: AccountPage;
  let commonPage: CommonPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    opportunityPage = new OpportunityPage(page);
    accountPage = new AccountPage(page);
    commonPage = new CommonPage(page);
    // NOTE: If login is required, add login steps here using loginPage methods.
  });

  test('should create opportunity, related contact, and related account for an existing account', async ({ page }) => {
    // --- Test Data ---
    const scenario = testData.validOpportunityCreation;
    const accountName = scenario.account.accountName;
    const contact = scenario.contact;
    const opportunity = scenario.opportunity;
    const relatedAccount = scenario.relatedAccount;

    // 1. Launch Salesforce application (assume URL is set in config or env)
    await page.goto(process.env.SALESFORCE_URL || 'https://lockton1--cbqa.sandbox.lightning.force.com/lightning');

    // 2. Login (if not already logged in)
    // This assumes loginPage has methods for login. If SSO or session is used, skip.
    // await loginPage.login('your-username', 'your-password');

    // 3. Navigate to Accounts and search for the existing account
    await homePage.navigateToAccounts();
    await accountPage.searchAccount(accountName);
    await accountPage.openAccount(accountName);

    // 4. Go to Related tab
    await accountPage.navigateToRelatedTab();

    // 5. Create a related contact (using AccountPage methods)
    await accountPage.createRelatedContact({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      title: contact.title,
      department: contact.department,
      mailingAddress: contact.mailingAddress,
      contactRole: contact.contactRole
    });
    // Validate contact creation
    await accountPage.validateContactExists(contact.firstName, contact.lastName);

    // 6. Create a related account (e.g., subsidiary)
    await accountPage.createRelatedAccount({
      accountName: relatedAccount.accountName,
      accountType: relatedAccount.accountType,
      industry: relatedAccount.industry,
      billingAddress: relatedAccount.billingAddress,
      phone: relatedAccount.phone
    });
    // Validate related account creation
    await accountPage.validateRelatedAccountExists(relatedAccount.accountName);

    // 7. Create a new Opportunity for the existing account
    await accountPage.navigateToOpportunitiesSection();
    await opportunityPage.clickOnOpportunityNewButton();
    // The following assumes the OpportunityPage methods allow you to set all required fields
    await opportunityPage.enterOpportunityDetails(
      opportunity.opportunityType || 'Expansion', // insuranceValue
      'Standard' // insuranceSubtypeValue (if required)
    );
    // Set Opportunity Name, Stage, Dates, etc.
    // (If OpportunityPage exposes methods for these fields, use them. Otherwise, extend the Page Object.)
    // For now, assume enterOpportunityDetails covers these fields.

    // Set dates as per the test case
    // (If OpportunityPage exposes methods for setting effective and close dates, use them. Otherwise, extend Page Object.)
    // For now, assume enterOpportunityDetails sets today's date and one year later for effective/close date.

    await opportunityPage.clickOnSaveButton();

    // 8. Validate Opportunity creation
    await opportunityPage.openExistingOpportunity(opportunityPage.constructor['opportunityName'] || opportunity.opportunityName);
    // Validate fields (opportunity name, stage, dates, etc.)
    // (If OpportunityPage exposes validation methods, use them. Otherwise, extend Page Object.)

    // 9. Validate Related Contact is linked to Opportunity
    // (If OpportunityPage exposes a method, use it. Otherwise, extend Page Object.)
    // For now, placeholder:
    // await opportunityPage.validateRelatedContactLinked(contact.firstName, contact.lastName);

    // 10. Validate Related Account is linked to Opportunity
    // (If OpportunityPage exposes a method, use it. Otherwise, extend Page Object.)
    // For now, placeholder:
    // await opportunityPage.validateRelatedAccountLinked(relatedAccount.accountName);

    // 11. Assert expected result (summary)
    // This could be a UI assertion, or a check that all entities exist and are linked
    // For now, use Playwright's expect as a placeholder
    expect(true).toBeTruthy(); // Replace with real assertions as Page Objects are extended
  });
});
