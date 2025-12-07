import { Locator, Page } from 'playwright';
import { WebUserActions } from '../utils/webUserActions';
import locators from '../locators/locators.json';

/**
 * Page Object Model for the Contacts Page (Test automation scenario)
 * Encapsulates all actions and validations for Contact creation, editing, and deletion flows.
 */
export class ContactsPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators (using getter methods for encapsulation)
  private get contactsLink(): Locator {
    // Primary: linkText=Contacts, fallback to xpath/cssSelector
    return this.page.locator('a.item[href="/contacts"]');
  }

  private get createButton(): Locator {
    // Primary: xpath=//button[contains(@class, 'linkedin button') and contains(., 'Create')]
    return this.page.locator('button.ui.linkedin.button:has-text("Create")');
  }

  private get firstNameInput(): Locator {
    return this.page.locator('input[name="first_name"]');
  }

  private get lastNameInput(): Locator {
    return this.page.locator('input[name="last_name"]');
  }

  private get emailAddressInput(): Locator {
    return this.page.locator('input[name="value"]');
  }

  private get emailTypeInput(): Locator {
    return this.page.locator('input[name="name"]');
  }

  private get addEmailButton(): Locator {
    // Primary: xpath=//button[contains(@class, 'icon button')]/i[contains(@class, 'add icon')]
    return this.page.locator('button.ui.tiny.basic.icon.button');
  }

  private get categoryDropdown(): Locator {
    // Primary: xpath=//div[@name='category' and contains(@class, 'dropdown')]
    return this.page.locator('div.ui.selection.dropdown[name="category"]');
  }

  private get saveButton(): Locator {
    // Primary: xpath=//button[contains(@class, 'linkedin button') and contains(., 'Save')]
    return this.page.locator('button.ui.linkedin.button:has-text("Save")');
  }

  private get deleteButton(): Locator {
    // Primary: xpath=//button[contains(@class, 'icon button')]/i[contains(@class, 'trash icon')]
    return this.page.locator('button.ui.button.icon');
  }

  private get logOutLink(): Locator {
    // Primary: xpath=//a[contains(@class, 'item') and contains(., 'Log Out')]
    return this.page.locator('a.item:has-text("Log Out")');
  }

  /**
   * Navigates to the Contacts page via the sidebar link.
   */
  async navigateToContactsPage(): Promise<void> {
    await WebUserActions.waitForVisible('Contacts Link', this.contactsLink);
    await WebUserActions.clickOnElement('Contacts Link', this.contactsLink);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Creates a new contact with all required and optional fields, including multiple emails.
   * This method covers the full contact creation workflow.
   * @param contactData Object containing all contact details
   *   - firstName: string
   *   - lastName: string
   *   - emails: Array<{ address: string, type: string }>
   *   - category: string (e.g., 'Lead', 'Customer', ...)
   */
  async createNewContact(contactData: {
    firstName: string;
    lastName: string;
    emails: Array<{ address: string; type: string }>;
    category: string;
  }): Promise<void> {
    await WebUserActions.waitForVisible('Create Button', this.createButton);
    await WebUserActions.clickOnElement('Create Button', this.createButton);
    await WebUserActions.waitForVisible('First Name Input', this.firstNameInput);
    await WebUserActions.sendText('First Name Input', this.firstNameInput, contactData.firstName);
    await WebUserActions.sendText('Last Name Input', this.lastNameInput, contactData.lastName);

    // Enter first email (main)
    if (contactData.emails.length > 0) {
      await WebUserActions.sendText('Email Address Input', this.emailAddressInput, contactData.emails[0].address);
      await WebUserActions.sendText('Email Type Input', this.emailTypeInput, contactData.emails[0].type);
    }
    // Add additional emails (if any)
    for (let i = 1; i < contactData.emails.length; i++) {
      await WebUserActions.clickOnElement('Add Email Button', this.addEmailButton);
      // Find the last added email input fields (assume new fields are appended at the end)
      const emailInputs = this.page.locator('input[name="value"]');
      const typeInputs = this.page.locator('input[name="name"]');
      await WebUserActions.sendText('Additional Email Address Input', emailInputs.nth(i), contactData.emails[i].address);
      await WebUserActions.sendText('Additional Email Type Input', typeInputs.nth(i), contactData.emails[i].type);
    }

    // Select category from dropdown
    await WebUserActions.clickOnElement('Category Dropdown', this.categoryDropdown);
    const categoryOption = this.categoryDropdown.locator(`.menu .item:has-text("${contactData.category}")`);
    await WebUserActions.waitForVisible('Category Option', categoryOption);
    await WebUserActions.clickOnElement('Category Option', categoryOption);

    // Save contact
    await WebUserActions.clickOnElement('Save Button', this.saveButton);
    await this.page.waitForTimeout(2000); // Wait for save to complete (adjust as needed)
  }

  /**
   * Deletes the currently viewed contact (assumes contact is open in the UI).
   * Handles confirmation if required.
   */
  async deleteCurrentContact(): Promise<void> {
    await WebUserActions.waitForVisible('Delete Button', this.deleteButton);
    await WebUserActions.clickOnElement('Delete Button', this.deleteButton);
    // TODO: If a confirmation dialog appears, handle it here
    await this.page.waitForTimeout(1000);
  }

  /**
   * Logs out from the application via the sidebar/user menu.
   */
  async logOut(): Promise<void> {
    await WebUserActions.waitForVisible('Log Out Link', this.logOutLink);
    await WebUserActions.clickOnElement('Log Out Link', this.logOutLink);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Validates that a contact with the given name and email exists in the contacts list.
   * @param firstName string
   * @param lastName string
   * @param email string
   */
  async validateContactInList(firstName: string, lastName: string, email: string): Promise<void> {
    // TODO: Replace with actual locator for contact row
    const contactRow = this.page.locator(`//tr[td[contains(text(), '${firstName}')] and td[contains(text(), '${lastName}')] and td[contains(text(), '${email}')]]`); // TODO: Replace with actual locator
    await WebUserActions.waitForVisible('Contact Row', contactRow);
    if (!(await contactRow.isVisible())) {
      throw new Error(`Contact ${firstName} ${lastName} with email ${email} not found in list.`);
    }
  }

  // ==================== NEW METHODS ADDED BELOW (per requirements) ====================

  /**
   * Creates a new contact with the given details, including multiple emails and category selection.
   * Fills out First Name, Last Name, Email(s), Email Type(s), Category, and saves the contact.
   * @param contactData - Object containing firstName, lastName, emails (array of { value, type }), and category
   */
  async createNewContact(contactData: {
    firstName: string;
    lastName: string;
    emails: { value: string; type: string }[];
    category: string;
  }) {
    const { firstName, lastName, emails, category } = contactData;
    const page = this.page;
    // The following assumes a utility object webUserActions is available as in the requirements.
    // If not, replace with direct Playwright actions as needed.
    // For consistency, we use direct Playwright actions here.
    // Fill First Name
    await page.locator('input[name="first_name"]').fill(firstName);
    // Fill Last Name
    await page.locator('input[name="last_name"]').fill(lastName);
    // Fill first Email and Email Type
    if (emails.length > 0) {
      await page.locator('input[name="value"]').first().fill(emails[0].value);
      await page.locator('input[name="name"]').first().fill(emails[0].type);
      // Add additional emails if present
      for (let i = 1; i < emails.length; i++) {
        await page.locator('xpath=//button[contains(@class, "basic icon button") and .//i[contains(@class, "add icon")]]').click();
        await page.locator('input[name="value"]').nth(i).fill(emails[i].value);
        await page.locator('input[name="name"]').nth(i).fill(emails[i].type);
      }
    }
    // Select Category from dropdown
    await page.locator('xpath=//div[@role="listbox" and contains(@class, "selection dropdown")]').click();
    await page.locator(`xpath=//div[@role="option" and .//span[text()="${category}"]]`).click();
    // Click Save
    await page.locator('xpath=//button[contains(@class, "linkedin button") and .//i[contains(@class, "save icon")]]').click();
    // Wait for contact to appear in list (validation can be performed separately)
  }

  /**
   * Validates that the error message for required First Name is displayed.
   * @returns Promise<boolean> indicating if the error is visible
   */
  async isFirstNameRequiredErrorVisible(): Promise<boolean> {
    const errorLocator = this.page.locator('label:has-text("First Name") .inline-error-msg');
    return await errorLocator.isVisible();
  }

  /**
   * Deletes a contact by first name and last name from the contacts list.
   * @param firstName - First Name of the contact
   * @param lastName - Last Name of the contact
   */
  async deleteContactByName(firstName: string, lastName: string) {
    // Find the contact row by name (placeholder locator)
    const contactRow = this.page.locator(`//tr[td[contains(text(), "${firstName}")] and td[contains(text(), "${lastName}")]]`); // TODO: Replace with actual locator
    await contactRow.locator('button.ui.button.icon').click(); // Delete Button
    // Confirm deletion if confirmation dialog appears (add logic if needed)
  }
}