// tests/Contact.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ContactPage } from '../pages/ContactPage';
import contactTestData from '../test-data/contact-data.json';

// Test Case: TC-N001 - Create a new contact

test.describe('Contact Management', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let contactPage: ContactPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    contactPage = new ContactPage(page);
    // Login (assume credentials are managed in env or config)
    await loginPage.goto();
    await loginPage.loginWithDefaultCredentials();
    await homePage.waitForHomePageLoaded();
  });

  test('TC-N001: Create a new contact with valid data', async ({ page }) => {
    // Step 1: Navigate to contact creation screen
    await contactPage.navigateToContactCreation();

    // Step 2: Fill the contact form with valid data
    await contactPage.fillContactForm(contactTestData.validContact);

    // Step 3: Submit the form
    await contactPage.submitContactForm();

    // Step 4: Verify system displays appropriate success message
    const successMsg = await contactPage.getSuccessMessage();
    expect(successMsg).toContain('Contact was created'); // Adjust message as per actual system

    // Step 5: Verify new contact is saved in the CRM system
    const isSaved = await contactPage.isContactSaved(contactTestData.validContact);
    expect(isSaved).toBeTruthy();
  });
});
