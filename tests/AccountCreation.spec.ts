// tests/AccountCreation.spec.ts
import { test, expect } from '@playwright/test';
import { createNewAccountFlow } from '../pages/AccountPage';
import { Logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

// Load test data
const testDataPath = path.resolve(__dirname, '../test-data/title-not-provided-data.json');
const rawTestData = fs.readFileSync(testDataPath, 'utf-8');
const allTestData = JSON.parse(rawTestData);

// Map test data fields to the expected structure for createNewAccountFlow
function mapTestData(data: any) {
  return {
    username: process.env.SALESFORCE_USERNAME || 'testuser@example.com',
    password: process.env.SALESFORCE_PASSWORD || 'Password123!',
    user: data.accountName || 'Test User',
    businessName: data.accountName || 'Test Business',
    accountName: data.accountName,
    primaryProducerLead: 'Emily Anand', // Example, adjust as needed
    primaryServiceLead: 'Jennifer Beauguard', // Example, adjust as needed
    billingAddress: data.address && data.address.street ? data.address.street : '123 Main St',
    fein: data.fein || '67-6778889',
    website: data.website || 'www.example.com',
    phoneNumber: data.phone || '9999897867',
    primaryNiacsDescription: data.industry || 'Hazardous waste collection',
    annualRevenue: data.annualRevenue || '2330',
    numberOfEmployees: data.numberOfEmployees || '12',
    dnbCompany: data.dnbCompany || 'Apple',
    effectiveDate: data.effectiveDate || '2024-01-01',
  };
}

test.describe('Account Creation - Title not provided (TC_001)', () => {
  test('should create a new account successfully with valid data', async ({ page }) => {
    const data = allTestData.validAccountCreation;
    Logger.info('Starting valid account creation test');
    await createNewAccountFlow(page, mapTestData(data));
    // Add assertion for successful creation, e.g. toast message or account details
    // This is a placeholder, adjust according to your app's UI
    await expect(page.locator('text=New Account is created Successfully')).toBeVisible();
  });

  test('should show error when required fields are missing', async ({ page }) => {
    const data = allTestData.missingRequiredFields;
    Logger.info('Starting missing required fields test');
    await createNewAccountFlow(page, mapTestData(data));
    // Assert error message is shown
    await expect(page.locator('text=Error: Required fields are missing')).toBeVisible();
  });

  test('should create account with boundary values', async ({ page }) => {
    const data = allTestData.boundaryValues;
    Logger.info('Starting boundary values test');
    await createNewAccountFlow(page, mapTestData(data));
    await expect(page.locator('text=New Account is created Successfully')).toBeVisible();
  });

  test('should create account with max length fields', async ({ page }) => {
    const data = allTestData.maxLengthFields;
    Logger.info('Starting max length fields test');
    await createNewAccountFlow(page, mapTestData(data));
    await expect(page.locator('text=New Account is created Successfully')).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    const data = allTestData.invalidEmail;
    Logger.info('Starting invalid email format test');
    await createNewAccountFlow(page, mapTestData(data));
    await expect(page.locator('text=Error: Invalid email format')).toBeVisible();
  });

  test('should create account with special characters in fields', async ({ page }) => {
    const data = allTestData.specialCharacters;
    Logger.info('Starting special characters test');
    await createNewAccountFlow(page, mapTestData(data));
    await expect(page.locator('text=New Account is created Successfully')).toBeVisible();
  });

  test('should show error for duplicate account name', async ({ page }) => {
    const data = allTestData.duplicateAccount;
    Logger.info('Starting duplicate account name test');
    await createNewAccountFlow(page, mapTestData(data));
    await expect(page.locator('text=Error: Account already exists')).toBeVisible();
  });

  test('should create account with numeric-only fields', async ({ page }) => {
    const data = allTestData.numericFields;
    Logger.info('Starting numeric fields only test');
    await createNewAccountFlow(page, mapTestData(data));
    await expect(page.locator('text=New Account is created Successfully')).toBeVisible();
  });
});
