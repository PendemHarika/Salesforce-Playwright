import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
// If there is a SetupPage or similar, import it. Otherwise, use HomePage for navigation.
// import { SetupPage } from '../pages/SetupPage';

// TODO: Replace with actual test data source if available
const testUser = {
  username: 'testuser',
  password: 'password123'
};

test.describe('TC_02: Verify user is able to navigate to setup page', () => {
  test('User can login and navigate through setup workflow', async ({ page }) => {
    // Initialize Page Objects
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    // const setupPage = new SetupPage(page); // If SetupPage exists

    // Step 1: Login
    await loginPage.goto();
    await loginPage.login(testUser.username, testUser.password);
    await expect(homePage.getUserProfileIcon()).toBeVisible(); // Or similar assertion for successful login

    // Step 2: Click on global search
    await homePage.clickGlobalSearch();
    await expect(homePage.isGlobalSearchActive()).resolves.toBeTruthy();

    // Step 3: Click on setup button
    await homePage.clickSetupButton();
    await expect(homePage.isSetupPageVisible()).resolves.toBeTruthy();

    // Step 4: Click on New button
    await homePage.clickNewButtonOnSetup();
    await expect(homePage.isNewSetupModalVisible()).resolves.toBeTruthy();

    // Step 5: Click on import button
    await homePage.clickImportButtonOnSetup();
    await expect(homePage.isImportDialogVisible()).resolves.toBeTruthy();

    // Step 6: Click on sort button
    await homePage.clickSortButtonOnSetup();
    await expect(homePage.isSorted()).resolves.toBeTruthy();
  });
});
