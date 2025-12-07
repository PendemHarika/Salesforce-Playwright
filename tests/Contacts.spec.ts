// Playwright test for 'Test automation' scenario using Page Object Model
// DO NOT use locators directly; use only Page Object methods

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ContactsPage as ContactsPageOriginal } from '../pages/ContactsPage';
import { ContactsPage as ContactsPageNew } from '../github.com_PendemHarika_Salesforce-Playwright/pages/ContactsPage';
import { WebUserActions } from '../utils/webUserActions';
import testData from '../test-data/test-automation-data.json';

// NOTE: No specific test data required as per test case details
// If future test data is needed, import from '../test-data/test-automation-data.json'

test.describe('Contacts Management - Test automation', () => {
  let loginPage: LoginPage;
  let contactsPage: ContactsPageOriginal;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    contactsPage = new ContactsPageOriginal(page);
    // Always use existing login workflow (credentials should be managed securely)
    await loginPage.gotoLoginPage(process.env.BASE_URL || 'https://your-app-url.com');
    await loginPage.loginWithValidCredentials(
      process.env.TEST_USER_EMAIL || 'sivasai.arava@gmail.com',
      process.env.TEST_USER_PASSWORD || 'QAZqaz852@'
    );
  });

  test('should navigate to Contacts page and create, validate, and delete a contact', async ({ page }) => {
    // Step 1: Navigate to Contacts page
    await contactsPage.navigateToContactsPage();

    // Step 2: Create a new contact (with multiple emails)
    const contactData = {
      firstName: 'Harika',
      lastName: 'Pendem',
      emails: [
        { address: 'harika.pendem@example.com', type: 'Personal' },
        { address: 'harika.business@example.com', type: 'Business' }
      ],
      category: 'Lead'
    };
    await contactsPage.createNewContact(contactData);

    // Step 3: Validate that the contact appears in the list
    await contactsPage.validateContactInList(
      contactData.firstName,
      contactData.lastName,
      contactData.emails[0].address
    );

    // Step 4: Delete the contact (assumes contact detail is open)
    await contactsPage.deleteCurrentContact();

    // Step 5: (Optional) Validate the contact is no longer in the list
    // This step is optional as the Page Object validateContactInList throws if not found
    let contactNotFound = false;
    try {
      await contactsPage.validateContactInList(
        contactData.firstName,
        contactData.lastName,
        contactData.emails[0].address
      );
    } catch (e) {
      contactNotFound = true;
    }
    expect(contactNotFound).toBeTruthy();

    // Step 6: Log out
    await contactsPage.logOut();
  });
});

// --------------------- NEW FUNCTIONALITY ADDED BELOW ---------------------

test.describe('Contacts Management', () => {
  let loginPage: LoginPage;
  let contactsPage: ContactsPageNew;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    contactsPage = new ContactsPageNew(page);
    await loginPage.gotoLoginPage(testData.login.url);
    await loginPage.loginWithValidCredentials(testData.login.username, testData.login.password);
    await contactsPage.navigateToContactsPage();
  });

  test('should create a new contact with multiple emails and category', async ({ page }) => {
    const contact = testData.contacts.validContact;
    await contactsPage.createNewContact(contact);
    await contactsPage.validateContactInList(
      contact.firstName,
      contact.lastName,
      contact.emails[0].value
    );
  });

  test('should show required error when First Name is empty', async ({ page }) => {
    const contact = { ...testData.contacts.validContact, firstName: '' };
    await contactsPage.createNewContact(contact);
    expect(await contactsPage.isFirstNameRequiredErrorVisible()).toBeTruthy();
  });

  test('should delete an existing contact', async ({ page }) => {
    const contact = testData.contacts.validContact;
    await contactsPage.deleteContactByName(contact.firstName, contact.lastName);
    // Optionally, validate contact no longer appears in list
    // await expect(await contactsPage.isContactInList(contact.firstName, contact.lastName)).toBeFalsy();
  });

  test('should log out successfully', async ({ page }) => {
    await contactsPage.logOut();
    // Optionally, validate redirected to login page
    // expect(await loginPage.isAtLoginPage()).toBeTruthy();
  });
});