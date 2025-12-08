// Test In the upload
import { Page, Locator } from "playwright";
import { WebUserActions } from "../utils/webUserActions";
import locators from "../locators/locators.json";

export class ContactsPage {
    private page: Page;
    private webUserActions: WebUserActions;

    constructor(page: Page) {
        this.page = page;
        this.webUserActions = new WebUserActions(page);
    }

    /**
     * End-to-end workflow: Login, navigate to Contacts, create new contact, fill all fields, save, verify creation.
     * @param loginData { email: string, password: string }
     * @param contactData { firstName: string, lastName: string, email: string, emailType: string, category: string }
     */
    async createContactEndToEnd(loginData: { email: string, password: string }, contactData: { firstName: string, lastName: string, email: string, emailType: string, category: string }) {
        // Login
        await this.page.fill('input[name="email"]', loginData.email);
        await this.page.fill('input[name="password"]', loginData.password);
        await this.page.click('div.ui.fluid.large.blue.submit.button');
        // Wait for navigation to dashboard/home
        await this.page.waitForSelector('a[href="/contacts"]', { timeout: 10000 });

        // Navigate to Contacts
        await this.page.click('a[href="/contacts"]');
        await this.page.waitForSelector('button.ui.linkedin.button', { timeout: 10000 });

        // Click Create
        await this.page.click('a[href="/contacts/new"] button.ui.linkedin.button');
        await this.page.waitForSelector('input[name="first_name"]', { timeout: 10000 });

        // Fill First Name
        await this.page.fill('input[name="first_name"]', contactData.firstName);
        // Fill Last Name
        await this.page.fill('input[name="last_name"]', contactData.lastName);
        // Fill Email Address
        await this.page.fill('input[name="value"]', contactData.email);
        // Fill Email Type
        await this.page.fill('input[name="name"]', contactData.emailType);
        // Add Email (if button exists)
        const addEmailBtn = this.page.locator('button.ui.tiny.basic.icon.button');
        if (await addEmailBtn.isVisible()) {
            await addEmailBtn.click();
        }
        // Select Category
        await this.page.click('div.ui.selection.dropdown[name="category"]');
        const categoryOption = this.page.locator(`//div[@role='option' and @name='category']//span[text()='${contactData.category}']`);
        await categoryOption.click();
        // Save
        await this.page.click('button.ui.linkedin.button:has-text("Save")');

        // Wait for success or confirmation (placeholder)
        // TODO: Replace with actual success message locator
        await this.page.waitForSelector('i.large.user.red.icon', { timeout: 10000 });
    }

    /**
     * Log out from the application.
     */
    async logout() {
        // Open user/settings menu if needed (placeholder)
        // Click Log Out
        await this.page.click('a.item:has-text("Log Out")');
        // Wait for login page to appear
        await this.page.waitForSelector('input[name="email"]', { timeout: 10000 });
    }

    /**
     * Delete a contact by clicking the trash icon (assumes already navigated to contact details).
     */
    async deleteContact() {
        // Click trash icon button
        await this.page.click('button.ui.button.icon');
        // TODO: Add confirmation dialog handling if present
        // Wait for contact to be removed or confirmation
        // TODO: Replace with actual locator for deletion confirmation
        await this.page.waitForTimeout(2000);
    }
}
