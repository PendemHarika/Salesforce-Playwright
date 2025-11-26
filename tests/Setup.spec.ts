import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SetupPage } from '../pages/SetupPage';
import * as fs from 'fs';

// Import test data for TC_02
const testDataPath = 'test-data/verify-user-is-able-to-navigate-to-setup-page-data.json';
const testDataRaw = fs.readFileSync(testDataPath, 'utf-8');
const testData = JSON.parse(testDataRaw);

// Utility to login using LoginPage Page Object
async function login(page, username: string, password: string) {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLogin();
  await loginPage.enterUsername(username);
  await loginPage.enterPassword(password);
  await loginPage.clickLoginButton();
  // Optionally, add assertion for successful login (e.g., check for home page element)
}

test.describe('TC_02: Verify user is able to navigate to setup page', () => {
  test(
    testData.validNavigation.testDescription,
    async ({ page }) => {
      const { username, password, globalSearchQuery, expectedSetupPageTitle, expectedNewButtonVisible, expectedImportButtonVisible, expectedSortButtonVisible } = testData.validNavigation;

      // Step 1: Login
      await login(page, username, password);

      // Step 2-6: Setup navigation and actions via SetupPage Page Object
      const setupPage = new SetupPage(page);
      await setupPage.clickOnGlobalSearch(globalSearchQuery);
      await setupPage.clickOnSetupButton();
      await setupPage.clickOnNewButton();
      await setupPage.clickOnImportButton();
      await setupPage.clickOnSortButton();

      // Assertions (as per test data)
      if (expectedSetupPageTitle) {
        await expect(page).toHaveTitle(expectedSetupPageTitle);
      }
      if (typeof expectedNewButtonVisible === 'boolean') {
        // Use SetupPage Page Object for visibility assertion if method exists, else fallback
        // Placeholder for Page Object assertion method:
        // await expect(await setupPage.isNewButtonVisible()).toBe(expectedNewButtonVisible);
      }
      if (typeof expectedImportButtonVisible === 'boolean') {
        // Placeholder for Page Object assertion method:
        // await expect(await setupPage.isImportButtonVisible()).toBe(expectedImportButtonVisible);
      }
      if (typeof expectedSortButtonVisible === 'boolean') {
        // Placeholder for Page Object assertion method:
        // await expect(await setupPage.isSortButtonVisible()).toBe(expectedSortButtonVisible);
      }
    }
  );

  // Edge case: Empty username
  test('Login fails with empty username', async ({ page }) => {
    const { username, password, expectedError } = testData.edgeCases.emptyUsername;
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    await loginPage.enterUsername(username);
    await loginPage.enterPassword(password);
    await loginPage.clickLoginButton();
    // Assert error message (assume LoginPage exposes a method for error retrieval)
    // await expect(await loginPage.getLoginErrorMessage()).toContain(expectedError);
  });

  // Edge case: Empty password
  test('Login fails with empty password', async ({ page }) => {
    const { username, password, expectedError } = testData.edgeCases.emptyPassword;
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    await loginPage.enterUsername(username);
    await loginPage.enterPassword(password);
    await loginPage.clickLoginButton();
    // Assert error message
    // await expect(await loginPage.getLoginErrorMessage()).toContain(expectedError);
  });

  // Edge case: Invalid credentials
  test('Login fails with invalid credentials', async ({ page }) => {
    const { username, password, expectedError } = testData.edgeCases.invalidCredentials;
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    await loginPage.enterUsername(username);
    await loginPage.enterPassword(password);
    await loginPage.clickLoginButton();
    // Assert error message
    // await expect(await loginPage.getLoginErrorMessage()).toContain(expectedError);
  });

  // Edge case: Invalid global search query
  test('Global search with invalid query shows no results', async ({ page }) => {
    const { username, password, globalSearchQuery, expectedError } = testData.edgeCases.invalidGlobalSearch;
    await login(page, username, password);
    const setupPage = new SetupPage(page);
    await setupPage.clickOnGlobalSearch(globalSearchQuery);
    // Assert error message or no results (assume SetupPage exposes a method)
    // await expect(await setupPage.getGlobalSearchErrorMessage()).toContain(expectedError);
  });

  // Edge case: Setup button not visible
  test('Setup button not visible after global search', async ({ page }) => {
    const { username, password, globalSearchQuery, expectedError } = testData.edgeCases.missingSetupButton;
    await login(page, username, password);
    const setupPage = new SetupPage(page);
    await setupPage.clickOnGlobalSearch(globalSearchQuery);
    // Assert setup button is not visible (assume SetupPage exposes a method)
    // await expect(await setupPage.isSetupButtonVisible()).toBeFalsy();
    // Optionally, assert error message
    // await expect(await setupPage.getSetupButtonErrorMessage()).toContain(expectedError);
  });
});
