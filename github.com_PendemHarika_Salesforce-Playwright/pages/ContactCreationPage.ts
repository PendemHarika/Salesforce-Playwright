import { Locator, Page } from 'playwright';
import { WebUserActions } from '../utils/webUserActions';
import locators from '../locators/locators.json';

/**
 * Page Object Model for the Contact Creation screen in the CRM system.
 * Handles workflows for creating a new contact, including invalid email validation.
 */
export class ContactCreationPage {
  private readonly page: Page;

  /**
   * Constructor for ContactCreationPage
   * @param page Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  // =============================
  // Locators (using getter methods)
  // =============================

  // TODO: Replace the following placeholder locators with actual selectors from the application UI
  private get nameInputField(): Locator {
    // TODO: Update with the real locator for the Name input field
    return this.page.locator('//input[@name="Name"]');
  }

  private get phoneInputField(): Locator {
    // TODO: Update with the real locator for the Phone Number input field
    return this.page.locator('//input[@name="Phone"]');
  }

  private get companyInputField(): Locator {
    // TODO: Update with the real locator for the Company input field
    return this.page.locator('//input[@name="Company"]');
  }

  private get positionInputField(): Locator {
    // TODO: Update with the real locator for the Position input field
    return this.page.locator('//input[@name="Position"]');
  }

  private get emailInputField(): Locator {
    // TODO: Update with the real locator for the Email input field
    return this.page.locator('//input[@name="Email"]');
  }

  private get saveButton(): Locator {
    // TODO: Update with the real locator for the Save button
    return this.page.locator('//button[@name="Save"]');
  }

  private get invalidEmailErrorMessage(): Locator {
    // TODO: Update with the real locator for the invalid email error message
    return this.page.locator('//div[contains(@class, "error") and contains(text(), "invalid email")]');
  }

  // =============================
  // Workflow Methods
  // =============================

  /**
   * Fills all required fields for contact creation except email.
   * @param name - Contact's name
   * @param phone - Contact's phone number
   * @param company - Contact's company
   * @param position - Contact's position
   */
  async fillContactDetailsExceptEmail(name: string, phone: string, company: string, position: string): Promise<void> {
    await WebUserActions.sendText('Name Input', this.nameInputField, name);
    await WebUserActions.sendText('Phone Input', this.phoneInputField, phone);
    await WebUserActions.sendText('Company Input', this.companyInputField, company);
    await WebUserActions.sendText('Position Input', this.positionInputField, position);
  }

  /**
   * Enters an invalid email address in the Email field.
   * @param invalidEmail - The invalid email string to input (e.g., 'invalidemail.com')
   */
  async enterInvalidEmail(invalidEmail: string): Promise<void> {
    await WebUserActions.sendText('Email Input', this.emailInputField, invalidEmail);
  }

  /**
   * Clicks the Save button to attempt to create the contact.
   */
  async clickSaveButton(): Promise<void> {
    await WebUserActions.clickOnElement('Save Button', this.saveButton);
  }

  /**
   * Complete workflow: Fill all fields with valid data except for an invalid email, then attempt to save.
   * @param name - Contact's name
   * @param phone - Contact's phone number
   * @param company - Contact's company
   * @param position - Contact's position
   * @param invalidEmail - The invalid email string to input
   */
  async attemptToCreateContactWithInvalidEmail(name: string, phone: string, company: string, position: string, invalidEmail: string): Promise<void> {
    await this.fillContactDetailsExceptEmail(name, phone, company, position);
    await this.enterInvalidEmail(invalidEmail);
    await this.clickSaveButton();
  }

  /**
   * Retrieves the error message displayed for invalid email format.
   * @returns {Promise<string | null>} The error message text or null if not found.
   */
  async getInvalidEmailErrorMessage(): Promise<string | null> {
    try {
      await this.invalidEmailErrorMessage.waitFor({ state: 'visible', timeout: 5000 });
      return await WebUserActions.getTextForElement('Invalid Email Error Message', this.invalidEmailErrorMessage);
    } catch (error) {
      // Error message not found
      return null;
    }
  }
}
