import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ContactCreationPage } from '../pages/ContactCreationPage';
import * as invalidEmailData from '../test-data/invalid-email-format-rejection-data.json';

// Test Case: TC-N002 - Invalid Email Format Rejection
// Objective: Verify system rejects invalid email formats and displays appropriate error message.

test.describe('TC-N002: Invalid Email Format Rejection', () => {
  let loginPage: LoginPage;
  let contactCreationPage: ContactCreationPage;

  // Sample valid data for required fields except email
  const validContactData = {
    name: 'John Doe',
    phone: '123-456-7890',
    company: 'Example Corp',
    position: 'Manager',
  };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    contactCreationPage = new ContactCreationPage(page);
    // Login using the existing login workflow
    await loginPage.gotoLoginPage(process.env.BASE_URL || 'https://crm.example.com');
    await loginPage.loginWithValidCredentials(process.env.CRM_USERNAME || '', process.env.CRM_PASSWORD || '');
    // Navigate to the contact creation screen
    // This should be replaced with the actual navigation steps if required
    // For example: await homePage.navigateToContactCreation();
    // For now, assume user lands on contact creation after login or add navigation here if needed
  });

  for (const emailTest of (invalidEmailData as any).emailFieldTestData) {
    test(`should reject invalid email: ${emailTest.description} (${emailTest.input})`, async ({ page }) => {
      // Fill all required fields except email
      await contactCreationPage.fillContactDetailsExceptEmail(
        validContactData.name,
        validContactData.phone,
        validContactData.company,
        validContactData.position
      );
      // Enter invalid email
      await contactCreationPage.enterInvalidEmail(emailTest.input);
      // Attempt to save
      await contactCreationPage.clickSaveButton();
      // Assert error message
      const errorMsg = await contactCreationPage.getInvalidEmailErrorMessage();
      expect(errorMsg).not.toBeNull();
      expect(errorMsg).toContain(emailTest.expectedError);
      // Optionally, verify no contact is saved (out of scope for UI test unless there's a confirmation)
    });
  }
});
