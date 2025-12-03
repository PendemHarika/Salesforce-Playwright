import { Page, Locator } from 'playwright';
import { WebUserActions } from '../utils/webUserActions';
import locators from '../locators/locators.json';

/**
 * Page Object Model for Account List View and Related Actions
 * Handles Salesforce Lightning List View table interactions for Accounts
 */
export class AccountListPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators for dynamic row links (Account Name, Record Type, Producer, Service Lead, NAICS, etc.)
  private accountNameLink(accountName: string): Locator {
    // Try to find by link text or fallback to title attribute
    return this.page.locator(`a[title='${accountName}'], a:has-text('${accountName}')`);
  }

  private recordTypeLink(recordType: string): Locator {
    return this.page.locator(`a[title='${recordType}'], a:has-text('${recordType}')`);
  }

  private primaryProducerLink(producerName: string): Locator {
    return this.page.locator(`a[title='${producerName}'], a:has-text('${producerName}')`);
  }

  private primaryServiceLeadLink(serviceLeadName: string): Locator {
    return this.page.locator(`a[title='${serviceLeadName}'], a:has-text('${serviceLeadName}')`);
  }

  private primaryNAICSDescriptionLink(naicsDescription: string): Locator {
    return this.page.locator(`a[title='${naicsDescription}'], a:has-text('${naicsDescription}')`);
  }

  private lastModifiedByLink(userAlias: string): Locator {
    return this.page.locator(`a[title='${userAlias}'], a:has-text('${userAlias}')`);
  }

  private createdDateCell(dateString: string): Locator {
    return this.page.locator(`span[title='${dateString}']`);
  }

  private selectItemCheckboxById(id: string): Locator {
    return this.page.locator(`#${id}`);
  }

  private showActionsButtonByLabelId(labelId: string): Locator {
    return this.page.locator(`[aria-labelledby='${labelId}']`);
  }

  // Placeholder for Show Actions Button (if labelId is not known)
  private get showActionsButton(): Locator {
    // TODO: Replace with actual locator if available
    return this.page.locator("//button[@aria-haspopup='true']");
  }

  /**
   * Navigates to the details page for a given account by name
   * @param accountName The account name to click
   */
  async openAccountDetails(accountName: string): Promise<void> {
    const link = this.accountNameLink(accountName);
    await WebUserActions.waitForVisible(`Account Name Link: ${accountName}`, link);
    await WebUserActions.clickOnElement(`Account Name Link: ${accountName}`, link);
  }

  /**
   * Validates the presence of a record type link in the list view
   * @param recordType The record type (e.g., 'Client')
   */
  async validateAccountRecordType(recordType: string): Promise<void> {
    const link = this.recordTypeLink(recordType);
    await WebUserActions.waitForVisible(`Account Record Type Link: ${recordType}`, link);
  }

  /**
   * Validates the presence of a primary producer link
   * @param producerName The producer's name
   */
  async validatePrimaryProducer(producerName: string): Promise<void> {
    const link = this.primaryProducerLink(producerName);
    await WebUserActions.waitForVisible(`Primary Producer Link: ${producerName}`, link);
  }

  /**
   * Validates the presence of a primary service lead link
   * @param serviceLeadName The service lead's name
   */
  async validatePrimaryServiceLead(serviceLeadName: string): Promise<void> {
    const link = this.primaryServiceLeadLink(serviceLeadName);
    await WebUserActions.waitForVisible(`Primary Service Lead Link: ${serviceLeadName}`, link);
  }

  /**
   * Validates the presence of a NAICS description link
   * @param naicsDescription The NAICS description
   */
  async validatePrimaryNAICSDescription(naicsDescription: string): Promise<void> {
    const link = this.primaryNAICSDescriptionLink(naicsDescription);
    await WebUserActions.waitForVisible(`Primary NAICS Description Link: ${naicsDescription}`, link);
  }

  /**
   * Validates the last modified by alias link
   * @param userAlias The user alias (e.g., 'mbach')
   */
  async validateLastModifiedByAlias(userAlias: string): Promise<void> {
    const link = this.lastModifiedByLink(userAlias);
    await WebUserActions.waitForVisible(`Last Modified By Alias Link: ${userAlias}`, link);
  }

  /**
   * Validates the created date cell for a given date string
   * @param dateString The date string as shown in UI (e.g., '2/20/2023, 4:49 AM')
   */
  async validateCreatedDate(dateString: string): Promise<void> {
    const cell = this.createdDateCell(dateString);
    await WebUserActions.waitForVisible(`Created Date Cell: ${dateString}`, cell);
  }

  /**
   * Selects a row by its checkbox id
   * @param checkboxId The id attribute of the checkbox
   */
  async selectRowByCheckboxId(checkboxId: string): Promise<void> {
    const checkbox = this.selectItemCheckboxById(checkboxId);
    await WebUserActions.waitForVisible(`Select Item Checkbox: ${checkboxId}`, checkbox);
    await checkbox.check();
  }

  /**
   * Opens the Show Actions menu for a row by label id
   * @param labelId The aria-labelledby value for the button
   */
  async openShowActionsMenu(labelId: string): Promise<void> {
    const button = this.showActionsButtonByLabelId(labelId);
    await WebUserActions.waitForVisible(`Show Actions Button: ${labelId}`, button);
    await WebUserActions.clickOnElement(`Show Actions Button: ${labelId}`, button);
  }

  /**
   * Validates that all key columns for an account row are present
   * @param rowData Object with keys: accountName, recordType, producerName, serviceLeadName, naicsDescription, userAlias, createdDate
   */
  async validateAccountRow(rowData: {
    accountName: string;
    recordType: string;
    producerName: string;
    serviceLeadName: string;
    naicsDescription: string;
    userAlias: string;
    createdDate: string;
  }): Promise<void> {
    await this.openAccountDetails(rowData.accountName);
    await this.validateAccountRecordType(rowData.recordType);
    await this.validatePrimaryProducer(rowData.producerName);
    await this.validatePrimaryServiceLead(rowData.serviceLeadName);
    await this.validatePrimaryNAICSDescription(rowData.naicsDescription);
    await this.validateLastModifiedByAlias(rowData.userAlias);
    await this.validateCreatedDate(rowData.createdDate);
  }
}
