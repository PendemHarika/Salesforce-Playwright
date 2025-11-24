import { Locator, Page } from 'playwright';
import { WebUserActions } from '../utils/webUserActions';
import locators from '../locators/locators.json';

/**
 * Page Object Model for the Setup Page and related navigation actions in Salesforce Corebroking
 */
export class SetupPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Placeholder locator for global search
  private get globalSearchInput(): Locator {
    // TODO: Replace with actual locator
    return this.page.locator('locator(PLACEHOLDER_global_search_input)');
  }

  // Placeholder locator for setup button
  private get setupButton(): Locator {
    // TODO: Replace with actual locator
    return this.page.locator('locator(PLACEHOLDER_setup_button)');
  }

  // Placeholder locator for New button
  private get newButton(): Locator {
    // TODO: Replace with actual locator
    return this.page.locator('locator(PLACEHOLDER_new_button)');
  }

  // Placeholder locator for Import button
  private get importButton(): Locator {
    // TODO: Replace with actual locator
    return this.page.locator('locator(PLACEHOLDER_import_button)');
  }

  // Placeholder locator for Sort button
  private get sortButton(): Locator {
    // TODO: Replace with actual locator
    return this.page.locator('locator(PLACEHOLDER_sort_button)');
  }

  /**
   * Clicks on the global search input field
   */
  async clickGlobalSearch(): Promise<void> {
    await WebUserActions.waitForVisible('Global Search Input', this.globalSearchInput);
    await WebUserActions.clickOnElement('Global Search Input', this.globalSearchInput);
  }

  /**
   * Clicks on the Setup button
   */
  async clickSetupButton(): Promise<void> {
    await WebUserActions.waitForVisible('Setup Button', this.setupButton);
    await WebUserActions.clickOnElement('Setup Button', this.setupButton);
  }

  /**
   * Clicks on the New button
   */
  async clickNewButton(): Promise<void> {
    await WebUserActions.waitForVisible('New Button', this.newButton);
    await WebUserActions.clickOnElement('New Button', this.newButton);
  }

  /**
   * Clicks on the Import button
   */
  async clickImportButton(): Promise<void> {
    await WebUserActions.waitForVisible('Import Button', this.importButton);
    await WebUserActions.clickOnElement('Import Button', this.importButton);
  }

  /**
   * Clicks on the Sort button
   */
  async clickSortButton(): Promise<void> {
    await WebUserActions.waitForVisible('Sort Button', this.sortButton);
    await WebUserActions.clickOnElement('Sort Button', this.sortButton);
  }

  /**
   * Complete navigation to Setup page and perform all required actions as per TC_02
   * 1. Click global search
   * 2. Click setup button
   * 3. Click New button
   * 4. Click Import button
   * 5. Click Sort button
   */
  async navigateToSetupAndPerformActions(): Promise<void> {
    await this.clickGlobalSearch();
    await this.clickSetupButton();
    await this.clickNewButton();
    await this.clickImportButton();
    await this.clickSortButton();
  }
}
