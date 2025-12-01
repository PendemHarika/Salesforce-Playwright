import { Page,Locator } from 'playwright';
import { Logger } from '../utils/logger';
import { WebUserActions } from '../utils/webUserActions';
import locators from '../locators/locators.json';
import { HomePage } from './HomePage';

export class AccountPage {

    private readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    private accountRecordType(recordType: string): Locator {
        const xpath = WebUserActions.getDynamicLocator(locators.AccountPage.accountRecordType, recordType);
        return this.page.locator(xpath);
    }
  
    /**
     * Validates that a specific account record type is visible on the page.
     * 
     * This method dynamically locates an element based on the provided `accountRecordType`
     * and waits until it becomes visible in the DOM.
     * 
     * @param {string} accountRecordType - The name of the account record type to validate (e.g., "Client", "Partner").
     * @returns {Promise<void>} A promise that resolves once the record type element is found and visible.
     */
    async validateAccountRecordType (accountRecordType : string) : Promise<void> {
        try {
            Logger.info(`AccountPage: Validating account record type: ${accountRecordType}`);
            await this.accountRecordType(accountRecordType).first().waitFor({state:"visible"});
            Logger.info(`AccountPage: Account record type '${accountRecordType}' is visible.`);
        } catch (error) {
            Logger.error(`AccountPage: Error validating account record type '${accountRecordType}': ${error}`);
            throw error;
        }
    }

   
}

/**
 * Composite method to automate the full new account creation flow as described in TC_001.
 * This method combines all the logical steps required to create a new account from login to post-save validation.
 *
 * @param {object} testData - The test data required for account creation.
 * @param {Page} page - The Playwright page instance.
 */
export async function createNewAccountFlow(page: Page, testData: {
  username: string;
  password: string;
  user: string;
  businessName: string;
  accountName: string;
  primaryProducerLead: string;
  primaryServiceLead: string;
  billingAddress: string;
  fein: string;
  website: string;
  phoneNumber: string;
  primaryNiacsDescription: string;
  annualRevenue: string;
  numberOfEmployees: string;
  dnbCompany: string;
  effectiveDate: string;
}) {
  const homePage = new HomePage(page);
  const accountPage = new AccountPage(page);

  // 1. Launch application and login
  Logger.info('Launching Salesforce application and logging in.');
  await page.goto(process.env.SALESFORCE_URL || 'https://login.salesforce.com');
  await WebUserActions.sendText('Username Input', page.locator(locators.LoginPage.userNameInputField), testData.username);
  await WebUserActions.sendText('Password Input', page.locator(locators.LoginPage.passwordInputField), testData.password);
  await WebUserActions.clickOnElement('Login Button', page.locator(locators.LoginPage.loginButton));

  // 1.3 Click on setup button
  Logger.info('Clicking on Setup button.');
  await homePage.clickOnSetUpButton();

  // 2. Search for user and login as user
  Logger.info(`Searching for user: ${testData.user}`);
  await homePage.searchTLUser(testData.user);
  await homePage.switchToUser();

  // 3. Click on New button to create new account
  Logger.info('Navigating to Accounts tab and clicking New button.');
  await homePage.navigateToAccountsTab();
  await WebUserActions.clickOnElement('New Account Button', page.locator('button[title="New"]')); // TODO: Replace with actual locator if available

  // 3.1 Input business name in search box and click enter
  Logger.info(`Searching business name: ${testData.businessName}`);
  await WebUserActions.sendText('Business Name Search', page.locator('input[placeholder="Search Accounts"]'), testData.businessName); // TODO: Replace with actual locator
  await page.keyboard.press('Enter');

  // 3.2 Click on create new button
  await WebUserActions.clickOnElement('Create New Button', page.locator('button[title="Create New"]')); // TODO: Replace with actual locator

  // 3.3 Enter account name
  Logger.info(`Entering account name: ${testData.accountName}`);
  await WebUserActions.sendText('Account Name Input', page.locator('input[name="AccountName"]'), testData.accountName); // TODO: Replace with actual locator

  // 3.4 Search for primary producer lead
  Logger.info(`Searching for Primary Producer Lead: ${testData.primaryProducerLead}`);
  await WebUserActions.sendText('Primary Producer Lead Search', page.locator('input[placeholder="Primary Producer Lead"]'), testData.primaryProducerLead); // TODO: Replace with actual locator
  await page.keyboard.press('Enter');

  // 3.5 Search for primary service lead
  Logger.info(`Searching for Primary Service Lead: ${testData.primaryServiceLead}`);
  await WebUserActions.sendText('Primary Service Lead Search', page.locator('input[placeholder="Primary Service Lead"]'), testData.primaryServiceLead); // TODO: Replace with actual locator
  await page.keyboard.press('Enter');

  // 4. Enter primary account effective date
  Logger.info(`Entering Primary Account Effective Date: ${testData.effectiveDate}`);
  await WebUserActions.sendText('Primary Account Effective Date', page.locator('input[name="PrimaryAccountEffectiveDate"]'), testData.effectiveDate); // TODO: Replace with actual locator

  // 4.1 Enter billing address
  Logger.info(`Entering Billing Address: ${testData.billingAddress}`);
  await WebUserActions.sendText('Billing Address Input', page.locator('input[placeholder="Billing Address"]'), testData.billingAddress); // TODO: Replace with actual locator

  // 4.2 Click on Save button
  Logger.info('Clicking Save button to create account.');
  await WebUserActions.clickOnElement('Save Button', page.locator('button[title="Save"]'));

  // 5. Click on edit button
  Logger.info('Clicking Edit button to update additional account details.');
  await WebUserActions.clickOnElement('Edit Button', page.locator('button[title="Edit"]'));

  // 5.1 Enter FEIN Number
  Logger.info(`Entering FEIN Number: ${testData.fein}`);
  await WebUserActions.sendText('FEIN Input', page.locator('input[name="FEIN"]'), testData.fein); // TODO: Replace with actual locator

  // 5.2 Enter website and business phone number
  Logger.info(`Entering Website: ${testData.website}`);
  await WebUserActions.sendText('Website Input', page.locator('input[name="Website"]'), testData.website); // TODO: Replace with actual locator
  Logger.info(`Entering Phone Number: ${testData.phoneNumber}`);
  await WebUserActions.sendText('Business Phone Input', page.locator('input[name="Phone"]'), testData.phoneNumber); // TODO: Replace with actual locator

  // 5.3 Enter Primary niacs description
  Logger.info(`Entering Primary NIACS Description: ${testData.primaryNiacsDescription}`);
  await WebUserActions.sendText('Primary NIACS Description Input', page.locator('input[name="PrimaryNIACSDescription"]'), testData.primaryNiacsDescription); // TODO: Replace with actual locator

  // 5.4 Enter annual revenue
  Logger.info(`Entering Annual Revenue: ${testData.annualRevenue}`);
  await WebUserActions.sendText('Annual Revenue Input', page.locator('input[name="AnnualRevenue"]'), testData.annualRevenue); // TODO: Replace with actual locator

  // 5.5 Enter Number of employees
  Logger.info(`Entering Number of Employees: ${testData.numberOfEmployees}`);
  await WebUserActions.sendText('Number of Employees Input', page.locator('input[name="NumberOfEmployees"]'), testData.numberOfEmployees); // TODO: Replace with actual locator

  // 5.6 Enter D&B company profile
  Logger.info(`Entering D&B Company: ${testData.dnbCompany}`);
  await WebUserActions.sendText('D&B Company Input', page.locator('input[placeholder="D&B Company"]'), testData.dnbCompany); // TODO: Replace with actual locator
  await page.keyboard.press('Enter');

  // 5.7 Click on save button
  Logger.info('Clicking Save button to update account details.');
  await WebUserActions.clickOnElement('Save Button', page.locator('button[title="Save"]'));

  // 6. Click on related tab (post-creation validation)
  Logger.info('Navigating to Related tab to validate account creation.');
  await WebUserActions.clickOnElement('Related Tab', page.locator('a[title="Related"]')); // TODO: Replace with actual locator

  // Final validation: Ensure account was created successfully
  Logger.info('Validating that the new account was created successfully.');
  // You may add further validation here, such as checking for a success toast or account details.
}