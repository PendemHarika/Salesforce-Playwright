// tests/AccountList.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { AccountListPage } from '../pages/AccountListPage';

// No test data required for this test case as per current requirements
// If future test data is needed, import from '../test-data/test-automation-data.json'

test.describe('Account List View - Row Validation', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let accountListPage: AccountListPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    accountListPage = new AccountListPage(page);
    // Use existing login workflow (do not type credentials manually)
    // You may need to update the URL, username, and password as per your environment
    await loginPage.gotoLoginPage(process.env.BASE_URL || 'https://your.salesforce.url');
    await loginPage.loginWithValidCredentials(process.env.TEST_USERNAME || 'sivasai.arava@gmail.com', process.env.TEST_PASSWORD || 'QAZqaz852@');
    // Navigate to Accounts tab (reuse HomePage method)
    await homePage.navigateToAccountsTab();
  });

  test('Validate presence of key columns for account row: Delta Cold Storage, LLC', async () => {
    await accountListPage.validateAccountRow({
      accountName: 'Delta Cold Storage, LLC',
      recordType: 'Client',
      producerName: 'Joe Howard',
      serviceLeadName: 'Tracey Wild',
      naicsDescription: 'Offices of  Other Holding Companies',
      userAlias: 'mbach',
      createdDate: '11/13/2024, 6:27 PM',
    });
  });

  test('Validate presence of key columns for account row: Bardstown PPC Holdings LLC', async () => {
    await accountListPage.validateAccountRow({
      accountName: 'Bardstown PPC Holdings LLC',
      recordType: 'Client',
      producerName: 'Timothy Noonan',
      serviceLeadName: 'Kelly Gold',
      naicsDescription: 'Wine and Distilled Alcoholic Beverage Merchant Wholesalers',
      userAlias: 'mbach',
      createdDate: '2/20/2023, 4:43 AM',
    });
  });

  test('Validate presence of key columns for account row: 101 Dance Center dba Casa Blanca Outpatient', async () => {
    await accountListPage.validateAccountRow({
      accountName: '101 Dance Center dba Casa Blanca Outpatient',
      recordType: 'Client',
      producerName: 'Sacramento House',
      serviceLeadName: 'James Irvin',
      naicsDescription: 'Outpatient Mental Health and Substance Abuse Centers',
      userAlias: 'mbach',
      createdDate: '2/20/2023, 4:38 AM',
    });
  });

  test('Validate presence of key columns for account row: Sims Limited', async () => {
    await accountListPage.validateAccountRow({
      accountName: 'Sims Limited',
      recordType: 'Client',
      producerName: 'Bob Wierema',
      serviceLeadName: 'Joe Class',
      naicsDescription: 'Recyclable Material Merchant Wholesalers',
      userAlias: 'lkatp',
      createdDate: '12/17/2024, 2:34 PM',
    });
  });

  test('Validate presence of key columns for account row: The Learning Experience', async () => {
    await accountListPage.validateAccountRow({
      accountName: 'The Learning Experience',
      recordType: 'Client',
      producerName: 'Robert Irvin',
      serviceLeadName: 'Camille Goehausen',
      naicsDescription: 'Child Care Services',
      userAlias: 'lkatp',
      createdDate: '11/20/2024, 1:43 AM',
    });
  });
});
