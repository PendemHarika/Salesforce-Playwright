// Test In the upload
import { Locator, Page } from 'playwright';
import { WebUserActions } from '../utils/webUserActions';
import locators from '../locators/locators.json';

/**
 * Page Object Model for Test Automation flows not covered by existing page objects.
 * This class provides end-to-end business workflow methods for the "Test automation" scenario.
 *
 * CRITICAL: This file follows the repository's existing Page Object patterns and conventions.
 */
export class TestAutomationPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators (using inline pattern for missing locators, as per instructions)
  private get emailInput(): Locator {
    // TODO: Replace with actual locator if available in locators.json
    return this.page.locator("input[name='email']");
  }

  private get passwordInput(): Locator {
    // TODO: Replace with actual locator if available in locators.json
    return this.page.locator("input[name='password']");
  }

  private get loginButton(): Locator {
    // TODO: Replace with actual locator if available in locators.json
    return this.page.locator("//div[contains(@class, 'submit button') and text()='Login']");
  }

  private get contactsLink(): Locator {
    // TODO: Replace with actual locator if available in locators.json
    return this.page.locator("a[href='/contacts']");
  }

  private get createContactButton(): Locator {
    // TODO: Replace with actual locator if available in locators.json
    return this.page.locator("//button[contains(@class, 'linkedin button') and text()='Create']");
  }

  private get firstNameInput(): Locator {
    // TODO: Replace with actual locator if available in locators.json
    return this.page.locator("input[name='first_name']");
  }

  private get lastNameInput(): Locator {
    // TODO: Replace with actual locator if available in locators.json
    return this.page.locator("input[name='last_name']");
  }

  private get emailAddressInput(): Locator {
    // TODO: Replace with actual locator if available in locators.json
    return this.page.locator("input[name='value'][placeholder='Email address']");
  }

  private get emailTypeInput(): Locator {
    // TODO: Replace with actual locator if available in locators.json
    return this.page.locator("input[name='name'][placeholder='Personal email, Business, Alt...']");
  }

  private get addEmailButton(): Locator {
    // TODO: Replace with actual locator if available in locators.json
    return this.page.locator("button.ui.tiny.basic.icon.button");
  }

  private get categoryDropdown(): Locator {
    // TODO: Replace with actual locator if available in locators.json
    return this.page.locator("div.ui.selection.dropdown");
  }

  private get saveButton(): Locator {
    // TODO: Replace with actual locator if available in locators.json
    return this.page.locator("//button[contains(@class, 'linkedin button') and text()='Save']");
  }

  private get deleteButton(): Locator {
    // TODO: Replace with actual locator if available in locators.json
    return this.page.locator("button.ui.button.icon");
  }

  private get logOutLink(): Locator {
    // TODO: Replace with actual locator if available in locators.json
    return this.page.locator("//a[@role='option']/i[@class='power icon']/following-sibling::span[text()='Log Out']");
  }

  /**
   * Complete login workflow for the application.
   * @param email - User email
   * @param password - User password
   */
  async login(email: string, password: string): Promise<void> {
    await WebUserActions.sendText('Email Input', this.emailInput, email);
    await WebUserActions.sendText('Password Input', this.passwordInput, password);
    await WebUserActions.clickOnElement('Login Button', this.loginButton);
    // Optionally wait for navigation or dashboard
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Complete contact creation workflow, including adding an email and selecting category.
   * @param firstName - Contact's first name
   * @param lastName - Contact's last name
   * @param emailAddress - Contact's email address
   * @param emailType - Type of email (e.g., Personal, Business)
   * @param category - Category to select (e.g., Lead, Customer)
   */
  async createContact(firstName: string, lastName: string, emailAddress: string, emailType: string, category: string): Promise<void> {
    await WebUserActions.clickOnElement('Contacts Link', this.contactsLink);
    await WebUserActions.clickOnElement('Create Contact Button', this.createContactButton);
    await WebUserActions.sendText('First Name Input', this.firstNameInput, firstName);
    await WebUserActions.sendText('Last Name Input', this.lastNameInput, lastName);
    await WebUserActions.sendText('Email Address Input', this.emailAddressInput, emailAddress);
    await WebUserActions.sendText('Email Type Input', this.emailTypeInput, emailType);
    await WebUserActions.clickOnElement('Add Email Button', this.addEmailButton);
    await WebUserActions.clickOnElement('Category Dropdown', this.categoryDropdown);
    // Select category option
    const categoryOption = this.categoryDropdown.locator(`.item:has-text('${category}')`);
    await WebUserActions.clickOnElement(`Category Option: ${category}`, categoryOption);
    await WebUserActions.clickOnElement('Save Button', this.saveButton);
    // Optionally wait for success message or navigation
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Delete a contact from the contact list (assumes user is on the contact list page).
   * @param contactName - Name of the contact to delete
   */
  async deleteContact(contactName: string): Promise<void> {
    // TODO: Replace with actual locator for contact row and delete button
    const contactRow = this.page.locator(`//tr[td[contains(text(),'${contactName}')]]`); // Placeholder
    await WebUserActions.waitForVisible('Contact Row', contactRow);
    await WebUserActions.clickOnElement('Delete Button', this.deleteButton);
    // Optionally handle confirmation dialog
    // await WebUserActions.clickOnElement('Confirm Delete', this.page.locator('<PLACEHOLDER_CONFIRM_DELETE_BUTTON>'));
    await this.page.waitForTimeout(1000);
  }

  /**
   * Log out from the application.
   */
  async logout(): Promise<void> {
    await WebUserActions.clickOnElement('Log Out Link', this.logOutLink);
    await this.page.waitForLoadState('domcontentloaded');
  }
}
