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
     * Completes the end-to-end workflow for creating a new Account, filling all required fields, saving, and validating creation success.
     * Combines navigation, data entry, submission, and validation into a single business-flow method.
     *
     * @param accountData - Object containing all required account fields (e.g., name, type, industry, etc.)
     */
    async createAndValidateNewAccount(accountData: { name: string; type?: string; industry?: string; [key: string]: any }) {
        const { name, type, industry, ...otherFields } = accountData;
        // Navigate to Accounts tab (reuse HomePage method if available)
        // TODO: Replace with actual navigation logic if not already present
        // await this.page.goto('/lightning/o/Account/list');

        // Click 'New' button
        await this.page.locator('locator("<PLACEHOLDER_new_account_button>")').click(); // TODO: Replace with actual locator

        // Fill Account Name
        await this.page.locator('locator("<PLACEHOLDER_account_name_input>")').fill(name); // TODO: Replace with actual locator

        // Fill optional fields if provided
        if (type) {
            await this.page.locator('locator("<PLACEHOLDER_account_type_dropdown>")').selectOption(type); // TODO: Replace with actual locator
        }
        if (industry) {
            await this.page.locator('locator("<PLACEHOLDER_account_industry_dropdown>")').selectOption(industry); // TODO: Replace with actual locator
        }
        // Fill any additional fields
        for (const [field, value] of Object.entries(otherFields)) {
            await this.page.locator(`locator("<PLACEHOLDER_${field}_input>")`).fill(value); // TODO: Replace with actual locator
        }

        // Click 'Save' button
        await this.page.locator('locator("<PLACEHOLDER_save_account_button>")').click(); // TODO: Replace with actual locator

        // Wait for success toast/message
        await this.page.waitForSelector('locator("<PLACEHOLDER_account_success_toast>")', { timeout: 10000 }); // TODO: Replace with actual locator

        // Validate Account was created (reuse validateAccountCreated if available)
        await this.validateAccountCreated(name);
    }

}