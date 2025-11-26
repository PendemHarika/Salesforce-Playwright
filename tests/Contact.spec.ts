import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ContactPage } from '../pages/ContactPage';
import testData from '../test-data/create-new-contact-data.json';

// Utility: get test data scenarios as array
const scenarios = Object.values(testData);

test.describe('TC-N001: Create a new contact', () => {
  let loginPage: LoginPage;
  let contactPage: ContactPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    contactPage = new ContactPage(page);
    // Login as precondition
    await loginPage.goto();
    await loginPage.login('sivasai.arava@gmail.com', 'QAZqaz852@'); // Use valid credentials as per test case
    // Navigate to Contacts
    await contactPage.navigateToContactsList();
  });

  for (const scenario of scenarios) {
    test(`Should ${scenario.scenarioName}`, async ({ page }) => {
      // Prepare data
      const {
        firstName,
        lastName,
        email,
        phone,
        mobile,
        accountName,
        title,
        department,
        mailingStreet,
        mailingCity,
        mailingState,
        mailingPostalCode,
        mailingCountry,
        description,
        expectedMessage
      } = scenario;

      // Use ContactPage methods (Page Object Model enforced)
      await contactPage.clickCreateContactButton();
      await contactPage.fillContactForm(
        firstName,
        lastName,
        phone || '',
        accountName || '',
        email,
        'Personal', // Default email type for test, can be parameterized
        'Contact'    // Default category for test, can be parameterized
      );
      await contactPage.clickSaveButton();

      // Validate expected message
      await contactPage.validateContactCreatedMessage(expectedMessage);
    });
  }
});
