import { Locator, Page } from 'playwright';
import { Logger } from '../utils/logger';
import { WebUserActions } from '../utils/webUserActions';
import locators from '../locators/locators.json';

/**
 * Page Object Model for the Login Page of Lockton Salesforce Application
 * URL: https://test.salesforce.com
 */

export class LoginPage {
  
  private readonly page: Page;

  
  // Define locators using getter methods for better encapsulation and flexibility
  private get userNameInputField(): Locator {
    return this.page.locator(locators.LoginPage.userNameInputField);
  }

  private get passwordInputField(): Locator {
    return this.page.locator(locators.LoginPage.passwordInputField);
  }

  private get loginButton(): Locator {
    return this.page.locator(locators.LoginPage.loginButton);
  }

  private get errorMessage(): Locator {
    return this.page.locator(locators.LoginPage.errorMessage);
  }

  /**
   * Constructor for LoginPage
   * @param page Playwright Page object
   */
  constructor(page: Page) {
  this.page = page;
  }

  /**
   * Navigates to the Salesforce login page.
   * 
   * @param {string} url - The URL of the login page (e.g., https://test.salesforce.com).
   * @returns {Promise<void>} A promise that resolves when navigation is complete.
   * @throws Will throw an error if navigation fails.
   */
  async gotoLoginPage(url: string) : Promise<void>{
    try {
      console.log(`Navigating to login page at ${url}`);
      await this.page.goto(url, { waitUntil: 'domcontentloaded'});
    } catch (error) {
      console.error('Failed to navigate to login page', error);
      throw error;
    }
  }

  /**
   * Logs in using the provided username and password.
   * 
   * @param {string} username - The Salesforce username.
   * @param {string} password - The Salesforce password.
   * @returns {Promise<void>} A promise that resolves after the login attempt.
   * @throws Will throw an error if login interactions fail.
   */
  async loginWithValidCredentials(username: string, password: string): Promise<void> {
    try {
      await WebUserActions.sendText('username Input Value', this.userNameInputField, username);
      await WebUserActions.sendText('password Input Value', this.passwordInputField, password);
      await WebUserActions.clickOnElement('login Button', this.loginButton);
      console.log('Login attempted');
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  /**
   * Retrieves the login error message, if present.
   * 
   * @returns {Promise<string | null>} The error message text or `null` if not found.
   * @throws Will throw an error if the error element is not accessible.
   */
  async getErrorMessage(): Promise<string | null> {
    try {
      return await WebUserActions.getTextForElement('Error Message', this.errorMessage);
    } catch (error) {
      console.error('Failed to get error message', error);
      throw error;
    }
  }
}