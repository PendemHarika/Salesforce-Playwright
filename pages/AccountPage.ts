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

   
}