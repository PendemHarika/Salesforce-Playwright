import { Page ,Locator } from 'playwright';
import { WebUserActions } from '../utils/webUserActions';
import locators  from '../locators/locators.json';

export class HomePage {

  private readonly page: Page;
  
  private newTabPage?: Page;
  constructor(page: Page) {
  this.page = page;
  }

  // =============================
  // Locators for (Main Page)
  // =============================

  private get setUpIcon(): Locator {
    return this.page.locator(locators.HomePage.setUpIcon);
  }

  private get setupMenuItemOption(): Locator {
    return this.page.locator(locators.HomePage.setupMenuItemOption);
  }

   // =============================
  // Locators for (New Tab Page)
  // =============================

  private get applicationTitle(): Locator {
    return this.newTabPage!.locator(locators.HomePage.applicationTitle);
  }

  private get appLauncherButton(): Locator {
    return this.newTabPage!.locator(locators.HomePage.appLauncherButton);
  }

  private get appLauncherSearchInputField(): Locator {
    return this.newTabPage!.locator(locators.HomePage.appLauncherSearchInputField);
  }
 
  private get closeTabButtons(): Locator {
    return this.newTabPage!.locator(locators.HomePage.closeTabButtons);//updated new locator value so that any opened existing tabs(reports, opportunities, policy, account) can be closed
  }

  private get switchToUserLoginFrame(): string {
    return locators.HomePage.switchToUserLoginFrame;
  }

  private get showNavigationMenuDropdown(): Locator {
    return this.newTabPage!.locator(locators.HomePage.showNavigationMenuDropdown);
  }

  private navigationMenuOption(menuOption: string) :Locator {
    const xpath = WebUserActions.getDynamicLocator(locators.HomePage.navigationMenuOption,menuOption);
    return this.newTabPage!.locator(xpath);
  }

  private get listViewSelector(): Locator {
    return this.newTabPage!.locator(locators.HomePage.listViewSelector);
  }

  private get listViewSearchInput(): Locator {
    return this.newTabPage!.locator(locators.HomePage.listViewSearchInput);
  }

  private get allClientsListItem(): Locator {
    return this.newTabPage!.locator(locators.HomePage.allClientsListItem);
  }

  private get getclientText():Locator{
    return this.newTabPage!.locator(locators.HomePage.getclientText);
  }

  private get getFirstClientAccount(): Locator {
    return this.newTabPage!.locator(locators.HomePage.getFirstClientAccount).first();
  }

  private userSearchResult(userName: string): Locator {
    const xpath = WebUserActions.getDynamicLocator(locators.HomePage.USER_SEARCH_RESULT_DYNAMIC, userName);
    return this.newTabPage!.locator(xpath);
  }

  /**
   * Clicks on the Setup icon in the Salesforce header to open the setup menu.
   * Triggers the dropdown for setup-related options.
   * @returns {Promise<void>} Resolves when the icon is clicked.
   */
  async clickOnSetUpButton(): Promise<void> {
    await WebUserActions.waitForVisible('setUp Icon', this.setUpIcon, 50000);
    await WebUserActions.clickOnElement('setUp Icon', this.setUpIcon);
  }
  
  /**
   * Opens the "Setup" option in a new browser tab and switches focus to it.
   * Stores reference to the new tab in `newTabPage`.
   * @returns {Promise<Page>} Resolves to the newly opened setup page instance.
   */
  async openSetupTab(): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.setupMenuItemOption.click(),
    ]);

    await newPage.waitForLoadState('domcontentloaded');
    await newPage.bringToFront();
    this.newTabPage = newPage;
    console.log('✔️ New setup tab opened and stored.');
    return this.newTabPage;
  }

  /**
   * Searches for a specific Team Lead (TL) user within the "Setup" page and selects the user from the dropdown results.
   * @param {string} userName - The name of the TL user to search and select.
   * @returns {Promise<void>} Resolves after the user is selected.
   */
  async searchTLUser(userName: string): Promise<void> {
    if (!this.newTabPage) throw new Error('New tab not initialized. Call openSetupTab() first.');
    const { WebUserActions } = await import('../utils/webUserActions');

    await this.newTabPage.getByRole('combobox', { name: 'Search Setup' }).click();
    await this.newTabPage.getByRole('combobox', { name: 'Search Setup' }).fill(userName);

    await WebUserActions.clickOnElement('user Search Result', this.userSearchResult(userName));
  }

  private get iframeLoginButton() : string{
    console.log('Accessing iframe login button locator.');
    return locators.HomePage.iframeLoginButton;
  }

  /**
   * Switches to a user context by logging in from within an iframe on the setup page.
   * @returns {Promise<void>} Resolves when the user login button is clicked successfully.
   * @throws {Error} If `newTabPage` is not initialized.
   */
  async switchToUser(): Promise<void> {
    if (!this.newTabPage) throw new Error('New tab not initialized. Call openSetupTab() first.');
   
    await WebUserActions.isVisible('user Menu', this.newTabPage.locator(this.switchToUserLoginFrame));

    const frame = await WebUserActions.switchToIFrame('user Login Frame',this.newTabPage,this.switchToUserLoginFrame);
    console.log('Switched to iframe.');
    // Click the login button inside the iframe
    await frame.locator(this.iframeLoginButton).first().click();
    console.log('Clicked login inside iframe.');
  }
 
  
  static tabCloseButtons: any;
  
  /**
   * Closes all open tabs within the `newTabPage` context (e.g., Salesforce setup sub-tabs).
   * Iteratively clicks each close button from the last to the first.
   * Exits early if no tabs are visible.
   * @returns {Promise<void>} Resolves after all tabs are closed, or exits early if no tabs are visible.
   * @throws {Error} If `newTabPage` is not initialized.
   */
  async closeAllTabs(): Promise<void> {
  if (!this.newTabPage) throw new Error('New tab not initialized. Call openSetupTab() first.');
  let getCountOfCloseTabButtons = this.closeTabButtons;

  try{
    await getCountOfCloseTabButtons.first().waitFor({state:"visible",timeout:3000});
  } catch(error){
    console.log('No tabs to close.');
    return; // Exit if no tabs are visible
  }
  // Keep closing the first tab until none remain if visible
  
    while (await getCountOfCloseTabButtons.count() > 0) {
      console.log(`closing tabs: ${await getCountOfCloseTabButtons.count()}`);
      try {
        await getCountOfCloseTabButtons.first().click();
      
        await this.newTabPage.waitForTimeout(2000); // refresh to update the DOM
        getCountOfCloseTabButtons = this.closeTabButtons; // get the new locator values to close the tab
        console.log(`Updated remaining tabs: ${await getCountOfCloseTabButtons.count()}`);
      } catch (error) {
        console.warn('Failed to close a tab:', error);
          break; // Prevent infinite loop if something goes wrong
      }
    }
}

private appType(applicationName:string):Locator{
  const xpath = WebUserActions.getDynamicLocator(locators.HomePage.appType,applicationName);
  return this.newTabPage!.locator(xpath);
}

  /**
   * Selects a specific application from the App Launcher in the new setup tab.
   * Checks if the desired application is already selected by comparing the page title.
   * If not selected, opens the app launcher, searches for the application, and clicks it.
   * @param {string} applicatioName - The name of the application to select (e.g., "Sales", "TL Console").
   * @returns {Promise<void>} Resolves once the application is selected or if it is already active.
   * @throws {Error} If `newTabPage` is not initialized or application is not found in App Launcher.
   */
  async selectApplication(applicatioName: string): Promise<void> {
   if (!this.newTabPage) throw new Error('New tab not initialized. Call openSetupTab() first.');
  const titleVisibility=await this.applicationTitle.isVisible();
  if(titleVisibility){
    await this.closeSetupTabAndSwitchBack();
  }

   try {
      // Try to find the app title directly (if already selected)
      const titleText = await WebUserActions.getTextForElement("app Title",this.applicationTitle);
      const originalTitletext = applicatioName;
      const textFound  = titleText===(originalTitletext);
      if (textFound) {
        return;
      } else {
        await this.appLauncherButton.click();
        // Wait for the app name to appear inside selectAppLocator
        await WebUserActions.sendText("application Name",this.appLauncherSearchInputField,applicatioName);
        console.log(this.appType(applicatioName));
        if (await WebUserActions.isVisible(applicatioName,this.appType(applicatioName))) {
          await WebUserActions.clickOnElement("app Name",this.appType(applicatioName));
          console.log(`✔️ Selected application: ${applicatioName}`);
          await this.newTabPage.waitForTimeout(10000); //wait for 10 seconds to load the application properly
        } else {
          throw new Error(`Application "${applicatioName}" not found in App Launcher.`);
        }
    }
  } catch (error) {
      console.log(`App title not visible. Attempting to open App Launcher. Error: ${error}`);
  }
}

  /**
   * Navigates to the "Accounts" tab in the Salesforce application within the newly opened setup tab.
   * Reloads the new tab, opens the navigation menu, selects "Accounts", and chooses "All Clients" list view.
   * Waits for necessary UI elements to be visible at each step.
   * @returns {Promise<void>} Resolves when navigation to the Accounts tab is complete.
   * @throws {Error} If `newTabPage` is not initialized or navigation elements are not found.
   */
  async navigateToAccountsTab(): Promise<void> {
  if (!this.newTabPage) throw new Error('New tab not initialized. Call openSetupTab() first.');

  await this.newTabPage.reload();//just to make sure the page is loaded properly
  await this.newTabPage.waitForTimeout(2000);//added static wait to wait until accounts menu is visible

  await WebUserActions.waitForVisible('show Navigation Menu', this.showNavigationMenuDropdown);
  await WebUserActions.clickOnElement('show Navigation Menu', this.showNavigationMenuDropdown);

  await WebUserActions.waitForVisible('accounts Menu Item', this.navigationMenuOption("Accounts"));
  await WebUserActions.clickOnElement('accounts Menu Item', this.navigationMenuOption("Accounts"));

  await WebUserActions.waitForVisible('list View Element', this.listViewSelector);
  await WebUserActions.clickOnElement('list View Element', this.listViewSelector);

  await WebUserActions.waitForVisible('searchBox ListViewInput',this.listViewSearchInput);
  await WebUserActions.sendText('searchBox ListViewInput',this.listViewSearchInput,"All Clients");

  await WebUserActions.waitForVisible('all Clients In List View',this.allClientsListItem);
  await WebUserActions.clickOnElement('all Clients In List View',this.allClientsListItem);
}

  /**
   * Searches for a client by name in the list view and selects the first matching result.
   * Types the provided client name, triggers search, and clicks the first client account.
   * @param {string} clientName - The full name of the client to search for.
   * @returns {Promise<void>} Resolves once the client is found and selected.
   * @throws {Error} If `newTabPage` is not initialized or client is not found.
   */
  async searchAndSelectClientFromList(clientName: string): Promise<void> {
  if (!this.newTabPage) throw new Error('New tab not initialized. Call openSetupTab() first.');
  await WebUserActions.sendText("client Name",this.getclientText,clientName);
  await this.getclientText.press('Enter');
  await this.getFirstClientAccount.click();//selects the first account name so give full client name
}

 private get globalSearchButton(): Locator {
    return this.newTabPage!.locator(locators.HomePage.globalSearchButton);
 }

 private get globalSearchInputField(): Locator {
    return this.newTabPage!.locator(locators.HomePage.globalSearchInputField);
}

private globalSearchResult(carrierFullName:string): Locator {
  const xpath = WebUserActions.getDynamicLocator(locators.HomePage.globalSearchResult, carrierFullName);
  return this.newTabPage!.locator(xpath);
}

private accountOrCarrier(accountOrCarrierName:string):Locator{
  const xpath = WebUserActions.getDynamicLocator(locators.HomePage.accountOrCarrierName,accountOrCarrierName);
  return this.newTabPage!.locator(xpath);
}
  /**
   * Performs a global search for a carrier and accounts and selects the result.
   * If the result is not immediately visible, presses Enter and selects from fallback.
   * Waits for search results and clicks the appropriate match.
   * @param {string} searchText - The text to search for (carrier or account name).
   * @returns {Promise<void>} Resolves when the search result is selected.
   * @throws {Error} If global search elements are not found or search fails.
   */
  async globalSearch(searchText: string): Promise<void> {
    await this.globalSearchButton.waitFor({state: "visible"});
    await WebUserActions.clickOnElement("global Search Button", this.globalSearchButton);

    await this.globalSearchInputField.waitFor({state: "visible"});
    await WebUserActions.sendText("global Search Input", this.globalSearchInputField, searchText);

    await this.globalSearchResult(searchText).waitFor({state:'visible'})
    const searchResult = this.globalSearchResult(searchText).isVisible();
    if(await searchResult){
       await WebUserActions.clickOnElement("global Search Result", this.globalSearchResult(searchText));
    }else {
      await this.globalSearchInputField.press('Enter');
      await WebUserActions.clickOnElement("Account",this.accountOrCarrier(searchText));
      console.log(`✔️ Selected search result: ${searchText}`);
    }
   }

  private get taxCarriersEmail(): Locator {
    return this.newTabPage!.locator(locators.HomePage.taxCarriersEmail);
  }

  private get taxNDAEmail(): Locator {
    return this.newTabPage!.locator(locators.HomePage.taxNDAEmail);
  }

  private get taxCarriersHeader(): Locator {
    return this.newTabPage!.locator(locators.HomePage.taxCarriersHeader);
  }

  private carrierAbbreviation(carrierAbbreviation:string): Locator {
    const xpath = WebUserActions.getDynamicLocator(locators.HomePage.carrierAbbreviation,carrierAbbreviation);
    return this.newTabPage!.locator(xpath);
  }

  private get isNBILCheckBox(): Locator {   
    return this.newTabPage!.locator(locators.HomePage.isNBILCheckBox);
  }

  private get marketEmails(): Locator {
    return this.newTabPage!.locator(locators.HomePage.marketEmails);
  }

  private get marketEmailEditIcon(): Locator {
    return this.newTabPage!.locator(locators.HomePage.marketEmailEditIcon);
  }

  private get marketEmailInputField(): Locator {
    return this.newTabPage!.locator(locators.HomePage.marketEmailInputField);
  }

  private get taxCarriersEmailEditIcon(): Locator {
    return this.newTabPage!.locator(locators.HomePage.taxCarrierEmailEditIcon);
  }

  private get taxCarriersEmailInputField(): Locator {
    return this.newTabPage!.locator(locators.HomePage.taxCarrierEmailInputField);
  }

  private get taxNDAEmailEditIcon(): Locator {
    return this.newTabPage!.locator(locators.HomePage.taxndaEmailEditIcon);
  } 

  private get taxNDAEmailInputField(): Locator {
    return this.newTabPage!.locator(locators.HomePage.taxndaEmailInputField);
  }

  private get saveCarrierButton(): Locator {
    return this.newTabPage!.locator(locators.OpportunityPage.saveButton);
  }

  static marketEmailsValue: string;
  static taxCarriersEmailValue: string;
  static taxNDAEmailValue: string;
  /**
   * Validates that the carrier abbreviation and related UI elements are visible for NBIL submission.
   * Checks and validates Market Emails, Tax Carrier emails, and Tax NDA emails.
   * Updates any missing or invalid emails with environment variables.
   * @param {string} carrierAbbreviationName - The carrier abbreviation to validate.
   * @returns {Promise<void>} Resolves if validation passes.
   * @throws {Error} If any required element is not found or carrier validation fails.
   */
   
  async validateValidCarrier(carrierAbbreviationName: string): Promise<void> {
    try {
      // Validate Market Emails
      await this.marketEmails.waitFor({state:"visible"});
      HomePage.marketEmailsValue = await WebUserActions.getTextForElement("market Emails", this.marketEmails);
      if(HomePage.marketEmailsValue.includes("@") && !HomePage.marketEmailsValue.includes("invalid")){ 
        console.log("Market Emails is present for the selected carrier.");
      }else {
        await WebUserActions.clickOnElement("market Email Edit Icon",this.marketEmailEditIcon);
        await WebUserActions.sendText("market Email Input Field",this.marketEmailInputField,process.env.MARKET_EMAILS!);
        await WebUserActions.clickOnElement("Save Market Email",this.saveCarrierButton);
        HomePage.marketEmailsValue = await WebUserActions.getTextForElement("market Emails", this.marketEmails);
        console.log("Market Emails was missing or invalid. Updated to: " + HomePage.marketEmailsValue);
      }
      console.log("Market Emails value is: " + HomePage.marketEmailsValue);

      //validate Tax Carrier emails
      await WebUserActions.clickOnElement("taxCarriers Header",this.taxCarriersHeader);
      HomePage.taxCarriersEmailValue = await WebUserActions.getTextForElement("tax Carriers Email", this.taxCarriersEmail)
      if(HomePage.taxCarriersEmailValue.includes("@") && !HomePage.taxCarriersEmailValue.includes("invalid")){ 
        console.log("Tax Carriers Email is present for the selected carrier.");
      }else {
        await WebUserActions.clickOnElement("market Email Edit Icon",this.taxCarriersEmailEditIcon);
        await WebUserActions.sendText("market Email Input Field",this.taxCarriersEmailInputField,process.env.CARRIER_EMAILS!);
        await WebUserActions.clickOnElement("Save Market Email",this.saveCarrierButton);
        HomePage.taxCarriersEmailValue = await WebUserActions.getTextForElement("tax Carriers Email", this.taxCarriersEmail)
        console.log("Tax Carriers Email was missing or invalid. Updated to: " + HomePage.taxCarriersEmailValue);
      }
      console.log("Tax Carriers Email value is: " + HomePage.taxCarriersEmailValue);
      
      //validate Tax NDA emails
      await this.taxNDAEmail.waitFor({ state: "visible" });
      HomePage.taxNDAEmailValue = await WebUserActions.getTextForElement("tax NDA Email", this.taxNDAEmail);
      if(HomePage.taxNDAEmailValue.includes("@") && !HomePage.taxNDAEmailValue.includes("invalid")){ 
        console.log("Tax NDA Email is present for the selected carrier.");
      }else {
        await WebUserActions.clickOnElement("tax NDA Email Edit Icon",this.taxNDAEmailEditIcon);
        await WebUserActions.sendText("tax NDA Email Input Field",this.taxNDAEmailInputField,process.env.TAX_NDA_EMAILS!); 
        await WebUserActions.clickOnElement("Save Market Email",this.saveCarrierButton);
        HomePage.taxNDAEmailValue = await WebUserActions.getTextForElement("tax NDA Email", this.taxNDAEmail);
        console.log("Tax NDA Email was missing or invalid. Updated to: " + HomePage.taxNDAEmailValue);
      }
      console.log("Tax NDA Email value is: " + HomePage.taxNDAEmailValue);

      await this.carrierAbbreviation(carrierAbbreviationName).waitFor({ state: "visible" });
      await this.isNBILCheckBox.isVisible();
    } catch (error) {
      throw new Error(`Carrier validation failed: ${error}, Please choose proper carrier to submit the request`);
    }
    
  }

  
  private get existingOpportunity(): Locator {
    return this.newTabPage!.locator(locators.OpportunityPage.existingOpportunity);
  } 
  /**
   * Opens the existing opportunity from the opportunity list in the new tab.
   * Clicks on the existing opportunity link to navigate to opportunity details.
   * @returns {Promise<void>} Resolves when the opportunity is opened.
   * @throws {Error} If `newTabPage` is not initialized or opportunity link is not found.
   */
  async openTheExistingOpportunity(): Promise<void> {
    if (!this.newTabPage) throw new Error('New tab not initialized. Call openSetupTab() first.');
    await WebUserActions.clickOnElement("existing Opportunity",this.existingOpportunity);
  }

  private get closeMarketTabButton(): Locator {
    return this.newTabPage!.locator(locators.HomePage.closeMarketTabButton);
} 

private get closeLastAccountTabButton():Locator{
  return this.newTabPage!.locator(locators.HomePage.closeLastAccountTabButton);
}
  /**
   * Closes the last account tab and, if visible, the market tab in the new tab context.
   * Checks for market tab visibility before closing account tab.
   * @returns {Promise<void>} Resolves when the tabs are closed.
   * @throws {Error} If `newTabPage` is not initialized or close buttons are not found.
   */
  async closeLastAccountTab(): Promise<void> {
    if (!this.newTabPage) throw new Error('New tab not initialized. Call openSetupTab() first.'); 
    if(await this.closeMarketTabButton.isVisible()){
      await WebUserActions.clickOnElement("Close Market Tab", this.closeMarketTabButton.last());
      await WebUserActions.clickOnElement("Close Last Account Tab", this.closeLastAccountTabButton.last());
    }else{
      await WebUserActions.clickOnElement("Close Last Account Tab", this.closeLastAccountTabButton.last());
    }
  }
  private get opportunityTab(): Locator {
    return this.newTabPage!.locator(locators.HomePage.opportunityTab);  
  }
  /**
   * Navigates to the Opportunity tab in the Salesforce application within the new tab.
   * Clicks on the opportunity tab to open the opportunities view.
   * @returns {Promise<void>} Resolves when the Opportunity tab is opened.
   * @throws {Error} If `newTabPage` is not initialized or opportunity tab is not found.
   */
  async navigateToOpportunityTab(): Promise<void> {
    if (!this.newTabPage) throw new Error('New tab not initialized. Call openSetupTab() first.');
    await WebUserActions.clickOnElement("opportunity Tab", this.opportunityTab);
  }

  private get closeSetUpErrorTabButton():Locator{
    return this.newTabPage!.locator(locators.HomePage.closeSetUpErrorTabButton);
  }

  private get LoginButton() :Locator {
    return this.newTabPage!.locator(locators.HomePage.errorMessageLoginButton);
  }

  /**
   * Closes the setup tab or handles session error by clicking login button.
   * Checks for error message visibility and takes appropriate action.
   * @returns {Promise<void>} Resolves when the setup tab is closed or error is handled.
   * @throws {Error} If `newTabPage` is not initialized.
   */
  async closeSetupTabAndSwitchBack(): Promise<void> {
    if (!this.newTabPage) throw new Error('New tab not initialized. Call openSetupTab() first.');
    const errorMessageVisible = await WebUserActions.isVisible("Close Setup Error Tab", this.closeSetUpErrorTabButton);
    if(errorMessageVisible){
        await WebUserActions.clickOnElement("Close Setup Error Tab", this.LoginButton);
    }else{
        console.log("Session has ended. Please try executing once again.");
        
    }
  }
}