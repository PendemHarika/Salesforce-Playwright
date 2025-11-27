import { Page,Locator } from 'playwright';
import { Logger } from '../utils/logger';
import { WebUserActions } from '../utils/webUserActions';
import locators from '../locators/locators.json';

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

    /**
     * Creates a new Salesforce Account by executing the full workflow:
     * - Login as a user (if not already logged in)
     * - Navigate to Accounts, click New
     * - Fill all required fields and business data
     * - Save and validate account creation
     *
     * This method consolidates all major steps for the "Account creation" business process.
     *
     * @param accountData Object containing all required account creation fields
     */
    async createNewAccount(accountData: {
      username: string;
      password: string;
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
    }) {
      Logger.info('AccountPage: Starting new account creation workflow');
    
      // 1. Login (if not already logged in)
      // NOTE: LoginPage is a separate PO, so this should be handled in test setup or by a helper
    
      // 2. Navigate to Accounts list view
      await WebUserActions.clickOnElement('Accounts Tab', this.page.locator('a[title="Accounts"]'));
    
      // 3. Click "New" button to start account creation
      await WebUserActions.clickOnElement('New Account Button', this.page.locator('a[title="New"]'));
    
      // 4. Fill required fields in the New Account modal/page
      await this.fillAccountCreationForm(accountData);
    
      // 5. Save the account
      await WebUserActions.clickOnElement('Save Account Button', this.page.locator('button[type="button"][title="Save"]'));
    
      // 6. Validate account was created successfully
      await this.validateAccountCreated(accountData.accountName);
    }
    
    /**
     * Fills all required fields in the Salesforce New Account creation form.
     * This method assumes the New Account modal/page is already open.
     *
     * @param accountData Object containing all required account creation fields
     */
    async fillAccountCreationForm(accountData: {
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
    }) {
      // Account Name
      await WebUserActions.sendText('Account Name Input', this.page.locator('input[name="Name"]'), accountData.accountName);
      // Business Name
      await WebUserActions.sendText('Business Name Input', this.page.locator('input[name="BusinessName__c"]'), accountData.businessName);
      // Primary Producer Lead (lookup)
      await WebUserActions.sendText('Primary Producer Lead Lookup', this.page.locator('input[placeholder="Search Persons..."]'), accountData.primaryProducerLead);
      await this.page.waitForTimeout(1000); // Wait for lookup results
      await WebUserActions.clickOnElement('Primary Producer Lead Result', this.page.locator(`span:has-text("${accountData.primaryProducerLead}")`).first());
      // Primary Service Lead (lookup)
      await WebUserActions.sendText('Primary Service Lead Lookup', this.page.locator('input[placeholder="Search Persons..."]'), accountData.primaryServiceLead);
      await this.page.waitForTimeout(1000);
      await WebUserActions.clickOnElement('Primary Service Lead Result', this.page.locator(`span:has-text("${accountData.primaryServiceLead}")`).first());
      // Billing Address
      await WebUserActions.sendText('Billing Address Input', this.page.locator('input[placeholder="Billing Address"]'), accountData.billingAddress);
      // FEIN
      await WebUserActions.sendText('FEIN Input', this.page.locator('input[name="FEIN__c"]'), accountData.fein);
      // Website
      await WebUserActions.sendText('Website Input', this.page.locator('input[name="Website"]'), accountData.website);
      // Phone Number
      await WebUserActions.sendText('Phone Number Input', this.page.locator('input[name="Phone"]'), accountData.phoneNumber);
      // Primary NAICS Description
      await WebUserActions.sendText('Primary NAICS Description Input', this.page.locator('input[name="Primary_NAICS_Description__c"]'), accountData.primaryNaicsDescription);
      // Annual Revenue
      await WebUserActions.sendText('Annual Revenue Input', this.page.locator('input[name="AnnualRevenue"]'), accountData.annualRevenue);
      // Number of Employees
      await WebUserActions.sendText('Number of Employees Input', this.page.locator('input[name="NumberOfEmployees"]'), accountData.numberOfEmployees);
      // D&B Company (lookup)
      await WebUserActions.sendText('D&B Company Lookup', this.page.locator('input[placeholder="Search D&B Company"]'), accountData.dnbCompany);
      await this.page.waitForTimeout(1000);
      await WebUserActions.clickOnElement('D&B Company Result', this.page.locator(`span:has-text("${accountData.dnbCompany}")`).first());
      // Primary Account Effective Date
      await WebUserActions.sendText('Primary Account Effective Date Input', this.page.locator('input[name="Primary_P_C_Effective_Date__c"]'), accountData.primaryAccountEffectiveDate);
    }
    
    /**
     * Validates that the account was created successfully by checking for the presence of the account name
     * in the resulting Account detail page header or toast message.
     *
     * @param accountName The name of the account to validate
     */
    async validateAccountCreated(accountName: string) {
      // Wait for the Account detail page header to appear
      const accountHeader = this.page.locator(`h1:has-text("${accountName}")`);
      await accountHeader.waitFor({ state: 'visible', timeout: 10000 });
      Logger.info(`AccountPage: Account '${accountName}' created successfully.`);
    }
    
    /**
     * Edits an existing account by opening the account, clicking Edit, updating fields, and saving.
     *
     * @param accountName The name of the account to edit
     * @param updates Object with updated field values
     */
    async editAccount(accountName: string, updates: Partial<{
      fein: string;
      website: string;
      phoneNumber: string;
      primaryNaicsDescription: string;
      annualRevenue: string;
      numberOfEmployees: string;
      dnbCompany: string;
    }>) {
      // 1. Navigate to the account detail page
      await WebUserActions.clickOnElement('Account Link', this.page.locator(`a[title="${accountName}"]`).first());
      // 2. Click Edit
      await WebUserActions.clickOnElement('Edit Account Button', this.page.locator('button[title="Edit"]'));
      // 3. Update fields as needed
      if (updates.fein) await WebUserActions.sendText('FEIN Input', this.page.locator('input[name="FEIN__c"]'), updates.fein);
      if (updates.website) await WebUserActions.sendText('Website Input', this.page.locator('input[name="Website"]'), updates.website);
      if (updates.phoneNumber) await WebUserActions.sendText('Phone Number Input', this.page.locator('input[name="Phone"]'), updates.phoneNumber);
      if (updates.primaryNaicsDescription) await WebUserActions.sendText('Primary NAICS Description Input', this.page.locator('input[name="Primary_NAICS_Description__c"]'), updates.primaryNaicsDescription);
      if (updates.annualRevenue) await WebUserActions.sendText('Annual Revenue Input', this.page.locator('input[name="AnnualRevenue"]'), updates.annualRevenue);
      if (updates.numberOfEmployees) await WebUserActions.sendText('Number of Employees Input', this.page.locator('input[name="NumberOfEmployees"]'), updates.numberOfEmployees);
      if (updates.dnbCompany) {
        await WebUserActions.sendText('D&B Company Lookup', this.page.locator('input[placeholder="Search D&B Company"]'), updates.dnbCompany);
        await this.page.waitForTimeout(1000);
        await WebUserActions.clickOnElement('D&B Company Result', this.page.locator(`span:has-text("${updates.dnbCompany}")`).first());
      }
      // 4. Save
      await WebUserActions.clickOnElement('Save Account Button', this.page.locator('button[type="button"][title="Save"]'));
      // 5. Validate changes (optional)
      Logger.info(`AccountPage: Account '${accountName}' edited successfully.`);
    }

   
}