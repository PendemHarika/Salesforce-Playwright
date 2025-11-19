import { Page } from 'playwright';
import { WebUserActions } from '../utils/webUserActions';
import locators from '../locators/locators.json';
import { RenewalPoliciesPage } from './RenewalPoliciesPage';
import { OpportunityPage } from './OpportunityPage';
import { ManageAssignments } from './ManageAssignments';
import { RandomDataGenerator } from '../utils/randomDataGenerator';
import { Logger } from '../utils/logger';
import { th } from '@faker-js/faker/.';

export class NewPolicyPage {
  page: Page;
  renewalPoliciesPage: RenewalPoliciesPage;
  opportunityPage: OpportunityPage;
  manageAssignments: ManageAssignments;

  constructor(page: Page) {
    this.page = page;
    //WebUserActions.setPage(page);
    this.renewalPoliciesPage = new RenewalPoliciesPage(page);
    this.opportunityPage = new OpportunityPage(page);
    this.manageAssignments = new ManageAssignments(page);
  }

  async editSelectedPolicy(premiumAmount: string, feeDescription: string, feeTypeValue: string, feeCodeValue: string, rateTypeValue: string, rateValue: string, taxOnValue: string, taxCodeValue: string, nxValidations: string, accountName: string ) {

    // Validate Pending status
    const pending = await this.validatePendingPolicyStatus("Pending");
    if (!pending) throw new Error('Failed to validate Pending status');

    // Click Policy Edit
    await WebUserActions.clickOnElement('Policy Edit Button', this.page.locator(locators.NewPolicyPage.policyEditButton));
    await this.closeTheComponentErrorPopUp();
    await WebUserActions.waitForVisible('Edit Save Button', this.page.locator(locators.NewPolicyPage.editSaveButton));

    // Generate and enter Policy Description
    const policyDescription = await RandomDataGenerator.randomString('PolicyDesc', 5);
    console.log('Generated Policy Description:', policyDescription);

    await WebUserActions.sendText('Policy Description', this.page.locator(locators.NewPolicyPage.policyDescription), policyDescription);
    await this.clickAcquiredByBORCheckBox();
    await this.clickSaveButton();

    // Handle Edit Page error popup
    while (await WebUserActions.isVisible('Edit Page Error PopUp', this.page.locator(locators.NewPolicyPage.editPageErrorPopUp))) {
      await WebUserActions.clickOnElement('Edit Page Error PopUp', this.page.locator(locators.NewPolicyPage.editPageErrorPopUp));
      await WebUserActions.clickOnElement('Edit Save Button', this.page.locator(locators.NewPolicyPage.editSaveButton));
    }

    await this.closeTheComponentErrorPopUp();

    // Wait for coverage text
    await WebUserActions.waitForVisible('Coverage Text In Premium', this.page.locator(locators.NewPolicyPage.coverageText));

    console.log('Editing and entering Premium details...');
    await this.renewalPoliciesPage.enterPremiumDetails(premiumAmount);
    await this.renewalPoliciesPage.clickOnPremiumSaveButton();
    await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();
    console.log('Clicked on Premium section Next button.');

    // Enter Producer Allocation
    console.log('Entering Producer Allocation details...');
    await this.renewalPoliciesPage.validatePolicyAssignmentsHeader();
    await this.manageAssignments.fillPrimaryProducerAllocation('100');
    await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();
    console.log('Clicked on Assignments section Next button.');
    await this.renewalPoliciesPage.waitUntilSyncWithNX();

    // Enter Fee Details
    console.log('Entering Fee details...');
    await this.renewalPoliciesPage.enterFeeDetails(feeCodeValue, rateTypeValue, rateValue);
    await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();
    console.log('Clicked on Fee section Next button.');

    // Enter Surplus Lines Tax Details
    console.log('Entering Surplus Lines Tax details...');
    await this.renewalPoliciesPage.enterSurplusTaxDetails(taxOnValue, taxCodeValue);
    await this.renewalPoliciesPage.clickOnSurplusLineTaxNextButton();
    await this.renewalPoliciesPage.waitUntilSyncWithNX();

    // Enter Agency Commission Details
    await this.renewalPoliciesPage.clickOnAgencyNextButton();
    console.log('Clicked on Agency Commissions section Next button.');

    // Add missing producer allocation
    console.log('Add Missing Producer allocation...');
    await this.renewalPoliciesPage.editAndUpdateProducerSplit();
    await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();
    console.log('Clicked on Commissions chevron Next button.');

    // Finalize Policy
    console.log('Finalizing the policy...');
    await this.renewalPoliciesPage.clickOnFinalizePolicyButton();
    await this.closeTheComponentErrorPopUp();
  }

  // --- Other helper methods ---
  async validatePendingPolicyStatus(expectedStatus: string): Promise<boolean> {
    const locator = this.page.locator(locators.NewPolicyPage.editPolicyStatusText);
    await WebUserActions.waitForVisible('Policy Status Text', locator);
    const actualStatus = (await locator.innerText())?.trim();

    if (!actualStatus) {
      Logger.error('Policy status text not found or empty.');
      return false;
    }
    Logger.info(`Policy status found: "${actualStatus}", expected: "${expectedStatus}"`);
    return actualStatus.toLowerCase() === expectedStatus.toLowerCase();
  }


  async closeTheComponentErrorPopUp() {
    const errorLocator = this.page.locator(locators.NewPolicyPage.errorComponentPopup);
    const closeBtn = this.page.locator(locators.NewPolicyPage.closeBtnOfErrorPopUp);

    while (await WebUserActions.isVisible('Component Error Popup', errorLocator)) {
      await WebUserActions.clickOnElement('Close Error PopUp', closeBtn);
    }
  }

  async clickAcquiredByBORCheckBox() {
    const borChecked = this.page.locator(locators.NewPolicyPage.borChecked);
    const borCheckBox = this.page.locator(locators.NewPolicyPage.borCheckBox);

    if (await WebUserActions.isVisible('BOR Checked', borChecked)) {
      console.log('BOR checkbox is already checked');
    } else {
      await WebUserActions.scrollUntilElementVisible(this.page, borCheckBox);
      await WebUserActions.clickOnElement('BOR Checkbox', borCheckBox);
      await WebUserActions.clickOnElement('BOR Checkbox', borCheckBox);
    }
  }

  async clickSaveButton() {
    const saveBtn = this.page.locator(locators.NewPolicyPage.editSaveButton);
    await WebUserActions.clickOnElement('Edit Save Button', saveBtn);
  }
 
  /**
   * Fills policy details including generating and entering a random policy number.
   * Generates random policy number, sets effective and expiration dates, and selects billing options.
   * @returns {Promise<string>} Promise that resolves to the generated policy number.
   * @throws {Error} If policy number input field is not found or text entry fails.
   */
  async fillPolicyDetails() : Promise<string>{
    await WebUserActions.waitForVisible("Policy Number", this.page.locator(locators.NewPolicyPage.policyNumberInput));
    const policyNumber = RandomDataGenerator.randomString('Pol',5);
    await WebUserActions.sendText("Policy Number", this.page.locator(locators.NewPolicyPage.policyNumberInput),policyNumber);

    const effectiveDateLocator = await WebUserActions.getDynamicLocator(locators.NewPolicyPage.policyDateInput, "Policy Effective Date");
    await WebUserActions.sendText("Policy Effective Date", this.page.locator(effectiveDateLocator),RandomDataGenerator.todayDate());
    const expirationDateLocator = await WebUserActions.getDynamicLocator(locators.NewPolicyPage.policyDateInput, "Policy Expiration Date");
    await WebUserActions.sendText("Policy Effective Date", this.page.locator(expirationDateLocator),RandomDataGenerator.getDateYearsFromNow(7));
    await WebUserActions.selectDropdown("Billing Company", this.page.locator(locators.NewPolicyPage.billingCompanyDropdown),"Euclid Managers, LLC");
    await WebUserActions.selectDropdown("Issuing Carrier", this.page.locator(locators.NewPolicyPage.issuingCarrierDropdown),"North American Capacity Insurance");
    await WebUserActions.sendText("Policy Description", this.page.locator(locators.NewPolicyPage.policyDescription), RandomDataGenerator.randomString("Des", 4));
    await this.selectIfValidDropdownOptions(locators.NewPolicyPage.billToStatus, ['BillToContact','BillToLocation']);
    return policyNumber;
  }
 
   /**
    * Selects valid dropdown options for specified field names if they are valid.
    * Checks dropdown validity using aria-invalid attribute and selects first available option that's not "--None--".
    * Processes each field name in the array sequentially.
    * @param {string} locatorTemplate - Template string for building dynamic locators.
    * @param {string[]} fieldNames - Array of field names to process.
    * @returns {Promise<void>} Promise that resolves when all valid dropdowns are processed.
    * @throws {Error} If dropdown elements are not found or selection fails.
    */
   async selectIfValidDropdownOptions(locatorTemplate: string, fieldNames: string[]) {
    for (const fieldName of fieldNames) {
      try {
        const locatorString = await WebUserActions.getDynamicLocator(locatorTemplate,fieldName);
        const dropdownLocator = this.page.locator(locatorString);
        await WebUserActions.waitForVisible(`'${fieldName}' Dropdown`, dropdownLocator);
        const ariaInvalid = await dropdownLocator.getAttribute('aria-invalid');
        if (ariaInvalid === 'false' || ariaInvalid === null) {
          //await WebUserActions.clickOnElement(`'${fieldName}' Dropdown`, dropdownLocator)  
          const optionLocator = this.page.locator(locatorString + "//option[normalize-space(text())!='--None--']");
          const optionCount = await optionLocator.count();

          if (optionCount === 0) {
            Logger.warn(`No valid options found for ${fieldName}`);
            continue;
          }
          await WebUserActions.selectDropDownOption(`'${fieldName}' Dropdown`, dropdownLocator, "selectByIndex", "1");
        } else {
          Logger.warn(`Dropdown '${fieldName}' is already selected (aria-invalid=${ariaInvalid})`);
        }
      } catch (error) {
        Logger.error(`Error handling dropdown '${fieldName}': ${error}`);
      }
    }
  }
 
  /**
   * Adds coverage to the policy by selecting coverage ID from dropdown.
   * Scrolls to the add coverage button and selects the coverage ID option.
   * @returns {Promise<void>} Promise that resolves when coverage is added.
   * @throws {Error} If coverage elements are not found or clicking fails.
   */
  async addCoverage() {
    await WebUserActions.waitForVisible("Policy Description", this.page.locator(locators.NewPolicyPage.policyDescription));
    await WebUserActions.scrollUntilElementVisible(this.page, this.page.locator(locators.NewPolicyPage.addCoverageButton));
    await WebUserActions.clickOnElement("add coverage button", this.page.locator(locators.NewPolicyPage.addCoverageButton));
    await WebUserActions.clickOnElement("Coverage ID Dropdown", this.page.locator(locators.NewPolicyPage.coverageIdDropdown));
    await WebUserActions.clickOnElement("Coverage ID Option", this.page.locator(locators.NewPolicyPage.coverageIdOption));
    }
 
    /**
     * Clicks the "Save For Later" button and waits for synchronization with NX.
     * Saves the policy in draft state and waits for backend sync to complete.
     * @returns {Promise<void>} Promise that resolves when save for later action is complete.
     * @throws {Error} If save for later button is not found or clicking fails.
     */
    async clickSaveForLaterButton() {
        await WebUserActions.waitForVisible("Save For Later Button", this.page.locator(locators.NewPolicyPage.saveForLaterButton));
        await WebUserActions.clickOnElement("Save For Later Button", this.page.locator(locators.NewPolicyPage.saveForLaterButton));
        await this.renewalPoliciesPage.waitUntilSyncWithNX();
    }
 
    /**
     * Verifies that the policy page displays the correct policy number.
     * Compares displayed policy name against expected policy number.
     * @param {string} policyNumber - The expected policy number to verify.
     * @returns {Promise<void>} Promise that resolves when policy verification is complete.
     * @throws {Error} If policy name doesn't match expected policy number or element not found.
     */
    async verifyPolicyPage(policyNumber: string) {
        await this.page.waitForTimeout(10000);
        Logger.info(`🔍 Verifying Policy Page for Policy Number: ${policyNumber}`);
        await WebUserActions.waitForVisible("Policy Name", this.page.locator(locators.NewPolicyPage.policyName),20000);
        const displayedPolicyName = await this.page.locator(locators.NewPolicyPage.policyName).innerText();
        Logger.info(`Displayed Policy Name: ${displayedPolicyName}`);
        if (displayedPolicyName.trim() === policyNumber.trim()) {
            Logger.info(`You are on the expected Policy Page: ${policyNumber}`);
        } else {
            const errorMessage = `Mismatch! Expected Policy Number: "${policyNumber}" but found "${displayedPolicyName}"`;
            Logger.error(errorMessage);
            throw new Error(errorMessage);
        }
    }
 
    /**
     * Clicks the edit policy button to enter policy editing mode.
     * Opens the policy editor interface for making changes.
     * @returns {Promise<void>} Promise that resolves when edit policy button is clicked.
     * @throws {Error} If edit policy button is not found or clicking fails.
     */
    async clickEditPolicyButton() {
        //await WebUserActions.waitForVisible("edit Policy Button", this.page.locator(locators.NewPolicyPage.policyEditButton));
        await WebUserActions.clickOnElement("edit Policy Button", this.page.locator(locators.NewPolicyPage.policyEditButton))
    }
 
    /**
     * Verifies that the policy chevron displays the expected state.
     * Compares current policy state against expected state and logs results.
     * @param {string} expectedState - The expected policy state to verify (e.g., "Pending", "Active").
     * @returns {Promise<void>} Promise that resolves when state verification is complete.
     * @throws {Error} If current state doesn't match expected state or element not found.
     */
    async verifyChevron(expectedState: string) {
        await this.page.waitForTimeout(5000);
        const currentStateLocator = this.page.locator(locators.NewPolicyPage.currentStateText);

        Logger.info("Verifying the current policy state...");

        // Wait for the state element to be visible
        await WebUserActions.waitForVisible("Current State Text", currentStateLocator);

        // Get actual text
        const actualState = (await currentStateLocator.innerText()).trim();

        Logger.info(`Current policy state found: "${actualState}"`);
        Logger.info(`Expected policy state: "${expectedState}"`);

        // Step 2: Compare with expected state
        if (actualState === expectedState) {
            Logger.info(`Policy is in the expected state: "${expectedState}". Continuing execution...`);
        } else {
            Logger.error(`Policy is in an unexpected state! Expected: "${expectedState}", but found: "${actualState}"`);
            throw new Error(`Policy state mismatch — expected "${expectedState}" but found "${actualState}".`);
        }
    }
 
    /**
     * Fills premium details section with default premium amount.
     * Enters premium amount of 10000 and saves the premium details.
     * @returns {Promise<void>} Promise that resolves when premium details are filled.
     * @throws {Error} If premium fields are not found or data entry fails.
     */
    async fillPremiumDetails() {
      await WebUserActions.waitForVisible('Coverage Text In Premium', this.page.locator(locators.NewPolicyPage.coverageText));

      console.log('Editing and entering Premium details...');
      await this.renewalPoliciesPage.enterPremiumDetails("10000");
      await this.renewalPoliciesPage.clickOnPremiumSaveButton();
      //await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();
      //console.log('Clicked on Premium section Next button.');
    }
 
    /**
     * Fills producer allocation assignment details with 100% allocation.
     * Validates policy assignments header and enters rollover allocation.
     * @returns {Promise<void>} Promise that resolves when assignment details are filled.
     * @throws {Error} If assignment fields are not found or data entry fails.
     */
    async fillAssignmentsDetails(){
      console.log('Entering Producer Allocation details...');
      await this.renewalPoliciesPage.validatePolicyAssignmentsHeader();
      await this.manageAssignments.fillPrimaryProducerAllocation('100');
      //await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();
      //console.log('Clicked on Assignments section Next button.');
      //await this.renewalPoliciesPage.waitUntilSyncWithNX();
    }
 
    /**
     * Fills fee details section with specified fee parameters.
     * Enters fee code, rate type, and rate value, then saves the fee details.
     * @param {string} feeCode - Fee code to be applied.
     * @param {string} rateType - Type of rate (percentage or flat).
     * @param {string} rate - Rate value to be applied.
     * @returns {Promise<void>} Promise that resolves when fee details are filled.
     * @throws {Error} If fee fields are not found or data entry fails.
     */
    async fillFeeDetails(feeCode: string, rateType: string, rate: string) {
      console.log('Entering Fee details...');
      await this.renewalPoliciesPage.enterFeeDetails(feeCode, rateType, rate);
      await this.renewalPoliciesPage.clickOnPremiumSaveButton();
      //await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();
      //console.log('Clicked on Fee section Next button.');
    }
 
    /**
     * Closes the new policy tab.
     * Clicks the close button on the new policy tab.
     * @returns {Promise<void>} Promise that resolves when new policy tab is closed.
     * @throws {Error} If close tab button is not found or clicking fails.
     */
    async closeNewPolicytab() {
      await WebUserActions.clickOnElement("Close New Policy tab button", this.page.locator(locators.NewPolicyPage.newPolicyTab));
    }
 
    /**
     * Fills surplus lines tax details with specified tax parameters.
     * Enters tax on value and tax code, then saves the surplus tax details.
     * @param {string} taxOnValue - Tax classification value to be applied.
     * @param {string} taxCodeValue - Tax code for surplus lines tax.
     * @returns {Promise<void>} Promise that resolves when surplus tax details are filled.
     * @throws {Error} If tax fields are not found or data entry fails.
     */
    async fillSurplusTaxDetails(taxOnValue: string, taxCodeValue: string) {
      console.log('Entering Surplus Lines Tax details...');
      await this.renewalPoliciesPage.enterSurplusTaxDetails(taxOnValue, taxCodeValue);
      await this.renewalPoliciesPage.clickOnPremiumSaveButton();
      //await this.renewalPoliciesPage.clickOnSurplusLineTaxNextButton();
      //await this.renewalPoliciesPage.waitUntilSyncWithNX();
    }

    async fillOtherCommissionsDetails() {
      await this.renewalPoliciesPage.editAndUpdateProducerSplit();
      //await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();
    }

    async navigateToPolicyStage(toStage: string) {
      await this.page.waitForLoadState("domcontentloaded");
      await this.page.waitForTimeout(10000);
      const ToStageLocator = await WebUserActions.getDynamicLocator(locators.NewPolicyPage.policyChevronStage,toStage);
      await WebUserActions.clickOnElement("To Stage", this.page.locator(ToStageLocator));
      await this.page.waitForTimeout(6000);
    }
}







