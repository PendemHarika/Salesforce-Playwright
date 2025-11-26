import { Locator, Page } from 'playwright';
import { WebUserActions } from '../utils/webUserActions';
import locators from '../locators/locators.json';

/**
 * Page Object Model for the Setup Page actions as per TC_02
 * Handles navigation and actions: click global search, setup, New, Import, Sort
 */
export class SetupPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // --- Locators ---
  // Note: Add these to locators.json if not present. Placeholders used for missing ones.

  private get globalSearchButton(): Locator {
    // Reuse HomePage globalSearchButton if available
    return this.page.locator(locators.HomePage?.globalSearchButton || 'locator("<PLACEHOLDER_GLOBAL_SEARCH_BUTTON>")');
  }

  private get globalSearchInputField(): Locator {
    // Reuse HomePage globalSearchInputField if available
    return this.page.locator(locators.HomePage?.globalSearchInputField || 'locator("<PLACEHOLDER_GLOBAL_SEARCH_INPUT>")');
  }

  private get setupButton(): Locator {
    // Placeholder: Add to locators.json as SetupPage.setupButton
    return this.page.locator('locator("<PLACEHOLDER_SETUP_BUTTON>")'); // TODO: Replace with actual locator
  }

  private get newButton(): Locator {
    // Placeholder: Add to locators.json as SetupPage.newButton
    return this.page.locator('locator("<PLACEHOLDER_NEW_BUTTON>")'); // TODO: Replace with actual locator
  }

  private get importButton(): Locator {
    // Placeholder: Add to locators.json as SetupPage.importButton
    return this.page.locator('locator("<PLACEHOLDER_IMPORT_BUTTON>")'); // TODO: Replace with actual locator
  }

  private get sortButton(): Locator {
    // Placeholder: Add to locators.json as SetupPage.sortButton
    return this.page.locator('locator("<PLACEHOLDER_SORT_BUTTON>")'); // TODO: Replace with actual locator
  }

  // --- Actions ---

  /**
   * Clicks the global search button and enters a search term if needed.
   * @param {string} [searchText] - Optional search text to enter
   */
  async clickOnGlobalSearch(searchText?: string): Promise<void> {
    await WebUserActions.waitForVisible('Global Search Button', this.globalSearchButton);
    await WebUserActions.clickOnElement('Global Search Button', this.globalSearchButton);
    if (searchText) {
      await WebUserActions.waitForVisible('Global Search Input', this.globalSearchInputField);
      await WebUserActions.sendText('Global Search Input', this.globalSearchInputField, searchText);
    }
  }

  /**
   * Clicks the Setup button to navigate to the setup page.
   */
  async clickOnSetupButton(): Promise<void> {
    await WebUserActions.waitForVisible('Setup Button', this.setupButton);
    await WebUserActions.clickOnElement('Setup Button', this.setupButton);
  }

  /**
   * Clicks the New button on the setup page.
   */
  async clickOnNewButton(): Promise<void> {
    await WebUserActions.waitForVisible('New Button', this.newButton);
    await WebUserActions.clickOnElement('New Button', this.newButton);
  }

  /**
   * Clicks the Import button on the setup page.
   */
  async clickOnImportButton(): Promise<void> {
    await WebUserActions.waitForVisible('Import Button', this.importButton);
    await WebUserActions.clickOnElement('Import Button', this.importButton);
  }

  /**
   * Clicks the Sort button on the setup page.
   */
  async clickOnSortButton(): Promise<void> {
    await WebUserActions.waitForVisible('Sort Button', this.sortButton);
    await WebUserActions.clickOnElement('Sort Button', this.sortButton);
  }

  /**
   * Performs the full navigation flow for TC_02: login assumed, then global search, setup, new, import, sort.
   * @param {string} [searchText] - Optional search text for global search
   */
  async navigateToSetupAndPerformActions(searchText?: string): Promise<void> {
    await this.clickOnGlobalSearch(searchText);
    await this.clickOnSetupButton();
    await this.clickOnNewButton();
    await this.clickOnImportButton();
    await this.clickOnSortButton();
  }
}
