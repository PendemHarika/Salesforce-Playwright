// Test In the upload
import { Page, Locator } from "playwright";
import { WebUserActions } from "../utils/webUserActions";
import locators from "../locators/locators.json";

export class ContactsPage {
  private page: Page;
  private actions: WebUserActions;

  constructor(page: Page) {
    this.page = page;
    this.actions = new WebUserActions(page);
  }

  /**
   * End-to-end workflow: Create a new contact with all fields and category selection, then save.
   * This method covers:
   *  - Navigating to Contacts
   *  - Clicking Create
   *  - Filling First Name, Last Name, Email, Email Type
   *  - Adding Email
   *  - Selecting Category
   *  - Saving
   *  - (Optional) Validation of successful creation
   */
  async createNewContact({
    firstName,
    lastName,
    emailAddress,
    emailType,
    category
  }: {
    firstName: string;
    lastName: string;
    emailAddress: string;
    emailType: string;
    category: string;
  }) {
    // Navigate to Contacts
    await this.actions.click(await this.page.locator(locators["Contacts Link"].primary[0]));
    // Wait for Contacts page to load
    await this.page.waitForLoadState('networkidle');

    // Click Create button
    await this.actions.click(await this.page.locator(locators["Create Button"].primary[0]));
    await this.page.waitForSelector(locators["First Name Input"].primary[0]);

    // Fill First Name
    await this.actions.fill(await this.page.locator(locators["First Name Input"].primary[0]), firstName);
    // Fill Last Name
    await this.actions.fill(await this.page.locator(locators["Last Name Input"].primary[0]), lastName);

    // Fill Email Address
    await this.actions.fill(await this.page.locator(locators["Email Address Input"].primary[0]), emailAddress);
    // Fill Email Type
    await this.actions.fill(await this.page.locator(locators["Email Type Input"].primary[0]), emailType);
    // Add Email
    await this.actions.click(await this.page.locator(locators["Add Email Button"].primary[0]));

    // Select Category from dropdown
    const dropdown = await this.page.locator(locators["Category Dropdown"].primary[0]);
    await this.actions.click(dropdown);
    // Wait for dropdown options
    const optionLocator = this.page.locator(`//div[@role='option' and @name='category']//span[text()='${category}']`);
    await optionLocator.waitFor({ state: 'visible', timeout: 5000 });
    await this.actions.click(optionLocator);

    // Save
    await this.actions.click(await this.page.locator(locators["Save Button"].primary[0]));
    // Wait for save to complete (could be a toast, redirect, etc.)
    // TODO: Replace with actual validation/selector for success
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * End-to-end workflow: Delete a contact from the contacts list.
   * Assumes the contact is already selected or visible.
   * Optionally, you can extend this to search/select by name.
   */
  async deleteContactByName(contactName: string) {
    // TODO: Replace with actual locator to select contact row by name
    const contactRow = this.page.locator(`<PLACEHOLDER_contact_row_by_name>`); // TODO: Replace with actual locator
    await contactRow.waitFor({ state: 'visible', timeout: 5000 });
    await this.actions.click(contactRow);
    // Click Trash Icon Button
    await this.actions.click(await this.page.locator(locators["Trash Icon Button"].primary[0]));
    // Confirm deletion if needed
    // TODO: Replace with actual confirmation dialog locator and logic
    // const confirmButton = this.page.locator('<PLACEHOLDER_confirm_delete_button>'); // TODO: Replace with actual locator
    // await this.actions.click(confirmButton);
    // Wait for deletion to complete
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * End-to-end workflow: Log out from the application.
   */
  async logout() {
    // Click on Log Out Link
    await this.actions.click(await this.page.locator(locators["Log Out Link"].primary[0]));
    // Wait for login page or confirmation
    await this.page.waitForSelector(locators["Login Button"].primary[0]);
  }
}
