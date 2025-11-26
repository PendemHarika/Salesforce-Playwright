import { Locator, Page } from 'playwright';
import { WebUserActions } from '../utils/webUserActions';
import locators from '../locators/locators.json';

/**
 * Page Object Model for the Contact Creation Page (CRM)
 * Handles actions for creating a new contact and verifying success messages.
 */
export class ContactPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // =============================
  // Locators
  // =============================

  private get contactsLink(): Locator {
    // Navigates to contacts list
    return this.page.locator('a[href="/contacts"]'); // TODO: Replace with locators.ContactPage.contactsLink if added to locators.json
  }

  private get createContactButton(): Locator {
    // Button to open the create contact form
    return this.page.locator('button.ui.linkedin.button:has-text("Create")'); // TODO: Replace with locators.ContactPage.createContactButton if added
  }

  private get firstNameInput(): Locator {
    return this.page.locator('input[name="first_name"]'); // TODO: Replace with locators.ContactPage.firstNameInput if added
  }

  private get lastNameInput(): Locator {
    return this.page.locator('input[name="last_name"]'); // TODO: Replace with locators.ContactPage.lastNameInput if added
  }

  private get phoneNumberInput(): Locator {
    return this.page.locator('input[name="phone"]'); // TODO: Replace with locators.ContactPage.phoneNumberInput if added
  }

  private get companyInput(): Locator {
    return this.page.locator('input[name="company"]'); // TODO: Replace with locators.ContactPage.companyInput if added
  }

  private get emailAddressInput(): Locator {
    return this.page.locator('input[name="value"][placeholder="Email address"]'); // TODO: Replace with locators.ContactPage.emailAddressInput if added
  }

  private get emailTypeInput(): Locator {
    return this.page.locator('input[name="name"][placeholder*="email"]'); // TODO: Replace with locators.ContactPage.emailTypeInput if added
  }

  private get addEmailButton(): Locator {
    return this.page.locator('button.ui.tiny.basic.icon.button'); // TODO: Replace with locators.ContactPage.addEmailButton if added
  }

  private get categoryDropdown(): Locator {
    return this.page.locator('div[name="category"][role="listbox"]'); // TODO: Replace with locators.ContactPage.categoryDropdown if added
  }

  private categoryDropdownOption(optionText: string): Locator {
    // Selects a category option by visible text
    return this.page.locator(`div[name="category"][role="option"] span.text:text-is('${optionText}')`);
  }

  private get saveButton(): Locator {
    return this.page.locator('button.ui.linkedin.button:has-text("Save")'); // TODO: Replace with locators.ContactPage.saveButton if added
  }

  private get successMessage(): Locator {
    // Placeholder for success message after saving
    return this.page.locator('div.ui.positive.message, div.success.message, div[role="alert"]'); // TODO: Replace with locators.ContactPage.successMessage if added
  }

  // =============================
  // Actions
  // =============================

  /**
   * Navigates to the Contacts list page.
   */
  async navigateToContactsList(): Promise<void> {
    await WebUserActions.clickOnElement('Contacts Link', this.contactsLink);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clicks the 'Create' button to open the new contact form.
   */
  async clickCreateContactButton(): Promise<void> {
    await WebUserActions.clickOnElement('Create Contact Button', this.createContactButton);
    // Wait for the form to be visible
    await this.firstNameInput.waitFor({ state: 'visible' });
  }

  /**
   * Fills the contact creation form with provided details.
   * @param firstName First Name
   * @param lastName Last Name
   * @param phoneNumber Phone Number
   * @param company Company Name
   * @param email Email Address
   * @param emailType Email Type (e.g., 'Personal', 'Business')
   * @param category Category (e.g., 'Lead', 'Customer', 'Contact', 'Affiliate')
   */
  async fillContactForm(
    firstName: string,
    lastName: string,
    phoneNumber: string,
    company: string,
    email: string,
    emailType: string,
    category: string
  ): Promise<void> {
    await WebUserActions.sendText('First Name Input', this.firstNameInput, firstName);
    await WebUserActions.sendText('Last Name Input', this.lastNameInput, lastName);
    // Phone and company may not have explicit locators; use placeholders
    if (await this.phoneNumberInput.count() > 0) {
      await WebUserActions.sendText('Phone Number Input', this.phoneNumberInput, phoneNumber);
    }
    if (await this.companyInput.count() > 0) {
      await WebUserActions.sendText('Company Input', this.companyInput, company);
    }
    await WebUserActions.sendText('Email Address Input', this.emailAddressInput, email);
    await WebUserActions.sendText('Email Type Input', this.emailTypeInput, emailType);
    await WebUserActions.clickOnElement('Add Email Button', this.addEmailButton);
    await WebUserActions.clickOnElement('Category Dropdown', this.categoryDropdown);
    await WebUserActions.clickOnElement(`Category Option: ${category}`, this.categoryDropdownOption(category));
  }

  /**
   * Clicks the 'Save' button to submit the new contact form.
   */
  async clickSaveButton(): Promise<void> {
    await WebUserActions.clickOnElement('Save Button', this.saveButton);
  }

  /**
   * Creates a new contact by filling the form and saving.
   * @param firstName First Name
   * @param lastName Last Name
   * @param phoneNumber Phone Number
   * @param company Company Name
   * @param email Email Address
   * @param emailType Email Type
   * @param category Category
   */
  async createNewContact(
    firstName: string,
    lastName: string,
    phoneNumber: string,
    company: string,
    email: string,
    emailType: string,
    category: string
  ): Promise<void> {
    await this.clickCreateContactButton();
    await this.fillContactForm(firstName, lastName, phoneNumber, company, email, emailType, category);
    await this.clickSaveButton();
  }

  /**
   * Waits for and returns the success message after saving the contact.
   * @returns {Promise<string>} The success message text
   */
  async getSuccessMessage(): Promise<string> {
    await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
    return await this.successMessage.textContent() ?? '';
  }

  /**
   * Validates that the success message is displayed after contact creation.
   * @param expectedMessage The expected message (partial match allowed)
   */
  async validateContactCreatedMessage(expectedMessage: string): Promise<void> {
    const actualMessage = await this.getSuccessMessage();
    if (!actualMessage.includes(expectedMessage)) {
      throw new Error(`Expected success message to include: "${expectedMessage}", but got: "${actualMessage}"`);
    }
  }
}
