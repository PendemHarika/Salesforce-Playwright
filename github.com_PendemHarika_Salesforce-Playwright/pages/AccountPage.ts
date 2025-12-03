// ADD THESE NEW METHODS TO EXISTING CLASS - DO NOT MODIFY EXISTING CODE

import { Locator, Page } from 'playwright';
import { WebUserActions } from '../utils/webUserActions';
import { Logger } from '../utils/logger';
import locators from '../locators/locators.json';

/**
 * Performs the complete end-to-end flow for creating a new Salesforce Account as described in TC_001.
 * This method groups all the related actions (login, navigation, form filling, and validations) into a single business workflow.
 *
 * @param username - Salesforce username
 * @param password - Salesforce password
 * @param accountData - Object containing all required account creation data fields
 */
async createNewAccountEndToEnd(
  username: string,
  password: string,
  accountData: {
    user: string;
    businessName: string;
    accountName: string;
    primaryProducerLead: string;
    primaryServiceLead: string;
    billingAddress: string;
    fein: string;
    website: string;
    phoneNumber: string;
    primaryNaicsDescription: string;
    annualRevenue: string;
    numberOfEmployees: string;
    dnbCompany: string;
    primaryAccountEffectiveDate: string;
  }
): Promise<void> {
  Logger.info('Starting end-to-end Account creation flow...');

  // 1. Login (reuse LoginPage)
  const loginPage = new (require('./LoginPage').LoginPage)(this.page);
  await loginPage.gotoLoginPage(process.env.SALESFORCE_URL || 'https://lockton1--cbqa.sandbox.my.salesforce.com');
  await loginPage.loginWithValidCredentials(username, password);

  // 2. Click Setup and search for user (reuse HomePage)
  const homePage = new (require('./HomePage').HomePage)(this.page);
  await homePage.clickOnSetUpButton();
  await homePage.searchTLUser(accountData.user);
  await homePage.switchToUser();

  // 3. Navigate to Accounts tab and click New
  await homePage.navigateToAccountsTab();
  await WebUserActions.clickOnElement('New Account Button', this.page.locator("//div[@title='New']")); // TODO: Replace with actual locator if available

  // 4. Fill in Account creation form
  await this.fillAccountCreationForm(accountData);

  // 5. Save Account
  await WebUserActions.clickOnElement('Save Button', this.page.locator("//button[@name='Save']")); // TODO: Replace with actual locator if available

  // 6. Validate Account creation (e.g., success toast or presence of Account Name)
  await this.validateAccountCreated(accountData.accountName);

  // 7. Edit Account with additional info
  await WebUserActions.clickOnElement('Edit Button', this.page.locator("//button[@name='Edit']")); // TODO: Replace with actual locator if available
  await this.fillAccountEditForm(accountData);
  await WebUserActions.clickOnElement('Save Button', this.page.locator("//button[@name='Save']")); // TODO: Replace with actual locator if available

  // 8. Click Related tab (if required)
  await WebUserActions.clickOnElement('Related Tab', this.page.locator("//a[@data-label='Related']")); // TODO: Replace with actual locator if available

  Logger.info('Account creation flow completed.');
}

/**
 * Fills the Account creation form with provided data.
 * @param accountData - Account data object
 */
async fillAccountCreationForm(accountData: {
  businessName: string;
  accountName: string;
  primaryProducerLead: string;
  primaryServiceLead: string;
  billingAddress: string;
  primaryAccountEffectiveDate: string;
}): Promise<void> {
  // Business Name (search box)
  await WebUserActions.sendText('Business Name Search Box', this.page.locator("//input[@placeholder='Search Accounts']"), accountData.businessName); // TODO: Replace with actual locator
  await this.page.keyboard.press('Enter');
  await WebUserActions.clickOnElement('Create New Button', this.page.locator("//button[contains(.,'Create New')]")); // TODO: Replace with actual locator

  // Account Name
  await WebUserActions.sendText('Account Name Input', this.page.locator("//input[@name='Account Name']"), accountData.accountName); // TODO: Replace with actual locator

  // Primary Producer Lead
  await WebUserActions.sendText('Primary Producer Lead Search', this.page.locator("//input[@placeholder='Search Primary Producer Lead']"), accountData.primaryProducerLead); // TODO: Replace with actual locator
  await this.page.keyboard.press('Enter');

  // Primary Service Lead
  await WebUserActions.sendText('Primary Service Lead Search', this.page.locator("//input[@placeholder='Search Primary Service Lead']"), accountData.primaryServiceLead); // TODO: Replace with actual locator
  await this.page.keyboard.press('Enter');

  // Primary Account Effective Date
  await WebUserActions.sendText('Primary Account Effective Date', this.page.locator("//input[@name='Primary Account Effective Date']"), accountData.primaryAccountEffectiveDate); // TODO: Replace with actual locator

  // Billing Address
  await WebUserActions.sendText('Billing Address Search', this.page.locator("//input[@placeholder='Search Address']"), accountData.billingAddress); // TODO: Replace with actual locator
  await this.page.keyboard.press('Enter');
}

/**
 * Fills the Account edit form with additional data.
 * @param accountData - Account data object
 */
async fillAccountEditForm(accountData: {
  fein: string;
  website: string;
  phoneNumber: string;
  primaryNaicsDescription: string;
  annualRevenue: string;
  numberOfEmployees: string;
  dnbCompany: string;
}): Promise<void> {
  // FEIN Number
  await WebUserActions.sendText('FEIN Number Input', this.page.locator("//input[@name='FEIN']"), accountData.fein); // TODO: Replace with actual locator
  // Website
  await WebUserActions.sendText('Website Input', this.page.locator("//input[@name='Website']"), accountData.website); // TODO: Replace with actual locator
  // Business Phone
  await WebUserActions.sendText('Business Phone Input', this.page.locator("//input[@name='Phone']"), accountData.phoneNumber); // TODO: Replace with actual locator
  // Primary NAICS Description
  await WebUserActions.sendText('Primary NAICS Description Input', this.page.locator("//input[@name='Primary NAICS Description']"), accountData.primaryNaicsDescription); // TODO: Replace with actual locator
  // Annual Revenue
  await WebUserActions.sendText('Annual Revenue Input', this.page.locator("//input[@name='Annual Revenue']"), accountData.annualRevenue); // TODO: Replace with actual locator
  // Number of Employees
  await WebUserActions.sendText('Number of Employees Input', this.page.locator("//input[@name='Number of Employees']"), accountData.numberOfEmployees); // TODO: Replace with actual locator
  // D&B Company Profile
  await WebUserActions.sendText('D&B Company Search', this.page.locator("//input[@placeholder='Search D&B Company']"), accountData.dnbCompany); // TODO: Replace with actual locator
  await this.page.keyboard.press('Enter');
}

/**
 * Validates that the Account was created successfully by checking for Account Name or success toast.
 * @param accountName - The expected Account Name
 */
async validateAccountCreated(accountName: string): Promise<void> {
  // Try to find Account Name header or success toast
  const accountNameHeader = this.page.locator(`//span[contains(text(),'${accountName}')]`); // TODO: Replace with actual locator
  await accountNameHeader.waitFor({ state: 'visible', timeout: 10000 });
  Logger.info(`Account '${accountName}' created and visible.`);
}
