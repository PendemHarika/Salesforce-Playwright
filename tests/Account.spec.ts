// tests/Account.spec.ts
import { test, expect } from '@playwright/test';
import { AccountPage } from '../pages/AccountPage';
import * as fs from 'fs';
import * as path from 'path';

// Load test data for TC_001: Title not provided
const testDataPath = path.resolve(__dirname, '../test-data/title-not-provided-data.json');
const rawTestData = fs.readFileSync(testDataPath, 'utf-8');
const testData = JSON.parse(rawTestData);

// Helper: Get Salesforce credentials from environment or fallback
const SALESFORCE_USERNAME = process.env.SALESFORCE_USERNAME || 'test.user@lockton.com.cbqa';
const SALESFORCE_PASSWORD = process.env.SALESFORCE_PASSWORD || 'Password123!';

// Map test data to AccountPage.createNewAccountEndToEnd expected shape
function mapValidAccountData(data: any) {
  // This mapping is based on the AccountPage method signature
  return {
    user: 'Jennifer beaguard', // Static as per original test case
    businessName: data.accountName || data.businessName || 'Acme Corp',
    accountName: data.accountName || 'Acme Corp',
    primaryProducerLead: data.primaryProducerLead || 'Emily anand',
    primaryServiceLead: data.primaryServiceLead || 'Jennifer beauguard',
    billingAddress: data.billingAddress?.street || data.billingAddress || 'USA',
    fein: data.fein || '67-6778889',
    website: data.website || 'www.google.com',
    phoneNumber: data.phone || data.phonenumber || '9999897867',
    primaryNaicsDescription: data.primaryNaicsDescription || 'Hazardous waste collection',
    annualRevenue: String(data.annualRevenue ?? '2330'),
    numberOfEmployees: String(data.numberOfEmployees ?? '12'),
    dnbCompany: data.dnbCompany || 'Apple',
    primaryAccountEffectiveDate: data.primaryAccountEffectiveDate || '11/27/2025',
  };
}

test.describe('Account Creation - TC_001: Title not provided', () => {
  test('should create a new Account successfully with valid data', async ({ page }) => {
    const accountPage = new AccountPage(page);
    const accountData = mapValidAccountData(testData.validAccountCreation);

    await accountPage.createNewAccountEndToEnd(
      SALESFORCE_USERNAME,
      SALESFORCE_PASSWORD,
      accountData
    );
    // The AccountPage method includes its own validation/assertion for creation
  });

  test.describe('Edge Cases', () => {
    for (const edgeCase of testData.edgeCases) {
      test(`should create account: ${edgeCase.scenarioName}`, async ({ page }) => {
        const accountPage = new AccountPage(page);
        const accountData = mapValidAccountData(edgeCase);
        await accountPage.createNewAccountEndToEnd(
          SALESFORCE_USERNAME,
          SALESFORCE_PASSWORD,
          accountData
        );
        // The AccountPage method includes its own validation/assertion for creation
      });
    }
  });

  test.describe('Negative Cases', () => {
    for (const negativeCase of testData.negativeCases) {
      test(`should fail to create account: ${negativeCase.scenarioName}`, async ({ page }) => {
        const accountPage = new AccountPage(page);
        const accountData = mapValidAccountData(negativeCase);
        let errorCaught = false;
        try {
          await accountPage.createNewAccountEndToEnd(
            SALESFORCE_USERNAME,
            SALESFORCE_PASSWORD,
            accountData
          );
        } catch (err) {
          errorCaught = true;
        }
        expect(errorCaught).toBeTruthy();
      });
    }
  });
});
