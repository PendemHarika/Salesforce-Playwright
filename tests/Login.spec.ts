//import { test, Page, expect} from '@playwright/test';
import { test, expect } from '../pages/pageObjectManager.ts';
//import { test, Page, expect } from '@playwright/test';
import { TestConfig } from '../test.config';


// Use values from test.config.ts
const config = new TestConfig();
const validUsername = config.email;
const validPassword = config.password;
const appUrl = config.appUrl;
const invalidUsername = 'invalid.user@example.com';
const invalidPassword = 'WrongPassword';
const empty = '';



  test('should login successfully with valid credentials', async ({ loginPage, homePage }) => {

    //test.setTimeout(60000)
    await loginPage.gotoLoginPage(appUrl);
    await loginPage.loginWithValidCredentials(validUsername, validPassword);
    // Add an assertion for successful login, e.g., check for a dashboard element
    //expect(await page.locator('selector-for-dashboard').isVisible()).toBeTruthy();
    await homePage.selectSettings();
    await homePage.openSetupTab();

    await homePage.searchTLUser('Amy Wright');
    await homePage.switchToUser();
    //await homePage.createNewAccount();
  
  //  await userProfile.switchToUser('Amy Wright');
    //await userProfile.switchToUserLoginIFrame(); // Example search

  });
  
 /*
  test('should show error for invalid username and valid password', async () => {
    await loginPage.login(invalidUsername, validPassword);
    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy(); // Adjust timeout as needed
  });

  test('should show error for valid username and invalid password', async () => {
    await loginPage.login(validUsername, invalidPassword);
    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy();
  });

  test('should show error for invalid username and invalid password', async () => {
    await loginPage.login(invalidUsername, invalidPassword);
    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy();
  });

  test('should show error for empty username and valid password', async () => {
    await loginPage.login(empty, validPassword);
    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy();
  });

  test('should show error for valid username and empty password', async () => {
    await loginPage.login(validUsername, empty);
    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy();
  });

  test('should show error for empty username and empty password', async () => {
    await loginPage.login(empty, empty);
    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy();
  });

  test('should show error for whitespace username and password', async () => {
    await loginPage.login('   ', '   ');
    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy();
  });

  test('should show error for special characters in username and password', async () => {
    await loginPage.login('!@#$%^&*()', '!@#$%^&*()');
    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy();
  });
*/
  // Add more edge cases as needed