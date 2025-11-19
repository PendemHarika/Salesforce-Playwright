import { Page } from '@playwright/test';
import { WebUserActions } from '../utils/webUserActions';
import { Logger } from '../utils/logger';
import locators from '../locators/locators.json';
import { threadId } from 'worker_threads';
import { th } from '@faker-js/faker/.';

export class RenewalPoliciesPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ===================================================
  // PREMIUM SECTION
  // ===================================================
  async clickOnPremiumAddButton() {
    //await WebUserActions.waitForVisible('Coverage Text', this.page.locator(locators.RenewalPoliciesPage.coverageText));
    await WebUserActions.clickOnElement('Premium Add Button', this.page.locator(locators.RenewalPoliciesPage.premiumAddButton));
  }

  async enterPremiumDetails(premiumAmount: string) {
    await this.clickOnPremiumAddButton();

    await WebUserActions.sendText('Est. Premium Amount Text Box', this.page.locator(locators.RenewalPoliciesPage.premiumEstimatedAmountTextBox), premiumAmount);
    await WebUserActions.clickOnElement('Coverage Drop Down', this.page.locator(locators.RenewalPoliciesPage.coverageDropDown));
    await WebUserActions.selectDropDownOption('Coverage Option', this.page.locator(locators.RenewalPoliciesPage.premiumCoverageOption),"selectByIndex", "1");

    Logger.info('Premium details entered successfully.');
  }

  async clickOnPremiumSaveButton() {
    await this.page.waitForTimeout(7000);
    //await WebUserActions.waitForVisible('Premium Save Button', this.page.locator(locators.RenewalPoliciesPage.premiumSaveButton));

    await WebUserActions.clickOnElement('Premium Save Button', this.page.locator(locators.RenewalPoliciesPage.premiumSaveButton));
  }

  // ===================================================
  // FEE SECTION
  // ===================================================
  async clickOnFeeAddButton() {
    await WebUserActions.waitForVisible('Fee Code Text', this.page.locator(locators.RenewalPoliciesPage.feeCodeText), 30000);
    await WebUserActions.waitForVisible('Fee Add Button', this.page.locator(locators.RenewalPoliciesPage.feeAddButton));
    await WebUserActions.clickOnElement('Fee Add Button', this.page.locator(locators.RenewalPoliciesPage.feeAddButton));
  }

  async enterFeeDetails(feeCode: string, rateType: string, rate: string) {
    await this.clickOnFeeAddButton();

    await WebUserActions.selectDropDownOption('Coverage Dropdown',this.page.locator(locators.RenewalPoliciesPage.coverageDropDown),"selectByIndex", "1");
    
    await WebUserActions.clickOnElement('Fee Code Drop Down', this.page.locator(locators.RenewalPoliciesPage.feeCodeDropDown));
    await WebUserActions.clickDynamicElement(feeCode, locators.RenewalPoliciesPage.feeCodeOption, 'Fee Code Option', this.page);

    await WebUserActions.selectDropDownOption('Rate Type Dropdown',this.page.locator(locators.RenewalPoliciesPage.rateTypeDropDown),"selectByValue", rateType);

    await WebUserActions.sendText('Rate Text Box', this.page.locator(locators.RenewalPoliciesPage.rateTextBox), rate);
    await WebUserActions.selectDropDownOption('Premium Dropdown',this.page.locator(locators.RenewalPoliciesPage.premiumDropDown),"selectByIndex", "1");
    
    Logger.info('Fee details entered successfully.');
  }

  // ===================================================
  // SURPLUS TAX SECTION
  // ===================================================
  async clickOnAddSurplusButton() {
    await WebUserActions.waitForVisible('Tax On Text', this.page.locator(locators.RenewalPoliciesPage.taxOnText));
    await WebUserActions.clickOnElement('Surplus Line Tax Add Button', this.page.locator(locators.RenewalPoliciesPage.surplusLineTaxAddButton));
  }

  async validateSurplusTaxDataTable() {
    await WebUserActions.waitForVisible('Surplus Tax Table', this.page.locator(locators.RenewalPoliciesPage.taxOnDropDown));
  }

  async enterSurplusTaxDetails(taxOn: string, taxCode: string) {
    await this.clickOnAddSurplusButton();
    await WebUserActions.waitForVisible('Surplus Tax Table', this.page.locator(locators.RenewalPoliciesPage.taxOnDropDown));

    if (taxOn) {
      await this.page.locator(locators.RenewalPoliciesPage.taxOnDropDown).click();
      await WebUserActions.clickDynamicElement(taxOn, locators.RenewalPoliciesPage.taxOnOption, 'Tax On Option', this.page);
    }

    if (taxCode) {
      await this.page.locator(locators.RenewalPoliciesPage.taxCodeDropDown).click();
      //await WebUserActions.clickDynamicElement(taxCode,  'Tax Code Option', this.page);
      await WebUserActions.selectDropdown('Tax Code Option',this.page.locator(locators.RenewalPoliciesPage.taxCodeOption), taxCode);
    }
    Logger.info('Surplus Tax details entered successfully.');
  }

  // ===================================================
  // EDIT & UPDATE PRODUCER SPLIT
  // ===================================================
  /**
   * Edits and updates producer split with specified percentage.
   * Currently a placeholder method that needs implementation.
   * @returns {Promise<void>} Promise that resolves when producer split is updated.
   */
  async editAndUpdateProducerSplit() {
    //add logic
    Logger.info("Starting to edit and update Producer Split...");

    await WebUserActions.waitForVisible("Production Split Header", this.page.locator(locators.RenewalPoliciesPage.productionSplitHeader));
    await WebUserActions.waitForVisible("Commision Production Splits", this.page.locator(locators.RenewalPoliciesPage.commisionProductionSplits).nth(1));
    const count = await this.page.locator(locators.RenewalPoliciesPage.commisionProductionSplits).count();
    Logger.info(`Found ${count} commission production splits.`);

    for (let i = 0; i < count; i++) {
        const valueText = (await this.page.locator(locators.RenewalPoliciesPage.commisionProductionSplits).nth(i).innerText()).trim();

        if (valueText !== "100%") {
            Logger.info(`Updating row ${i + 1} with value "${valueText}" to 100%...`);

            await WebUserActions.clickOnElement("Actions Dropdown", this.page.locator(locators.RenewalPoliciesPage.commisionsActionsDropdowns).nth(i));
            const editButtonLocator = await WebUserActions.getDynamicLocator(locators.RenewalPoliciesPage.commisionsEditButton, (i + 1).toString());

            try {
                await WebUserActions.waitForVisible(`Edit Button for row ${i + 1}`, this.page.locator(editButtonLocator));
                await WebUserActions.clickOnElement(`Edit Button for row ${i + 1}`, this.page.locator(editButtonLocator));
                await WebUserActions.waitForVisible("Commissions Edit Page Header", this.page.locator(locators.RenewalPoliciesPage.commisionsEditPageHeader));
                await WebUserActions.sendText("Producer Split TextBox", this.page.locator(locators.RenewalPoliciesPage.producerSplitTextBox), "100");
                await WebUserActions.clickOnElement("Save Button", this.page.locator(locators.RenewalPoliciesPage.saveButton));
                Logger.info(`Row ${i + 1} updated to 100%.`);
            } catch (error) {
                Logger.warn(`Failed to update row ${i + 1}. Skipping. Reason: ${error}`);
            }
        } else {
            Logger.info(`Row ${i + 1} already at 100%. Skipping.`);
        }
    }

    Logger.info("Completed updating all Producer Splits.");
  }

  // ===================================================
  // NAVIGATION NEXT BUTTONS
  // ===================================================
  /**
   * Clicks the agency next button to proceed to the next section.
   * Currently a placeholder method that needs implementation.
   * @returns {Promise<void>} Promise that resolves when agency next button is clicked.
   * @throws {Error} If agency next button is not found or clicking fails.
   */
  async clickOnAgencyNextButton() {
    //add logic
  }
 
  /**
   * Clicks the finalize policy button and waits for NX synchronization.
   * Handles multiple clicks if needed and waits for sync completion.
   * Scrolls to the finalize button before clicking.
   * @returns {Promise<void>} Promise that resolves when policy is finalized.
   * @throws {Error} If finalize policy button is not found or process fails.
   */
  async clickOnFinalizePolicyButton() {
    await WebUserActions.waitForVisible('Premiums Link Text', this.page.locator(locators.RenewalPoliciesPage.premiumsLinkText), 20000);
    await WebUserActions.scrollUntilElementVisible(this.page, this.page.locator(locators.RenewalPoliciesPage.finalizePolicy));
    await WebUserActions.clickOnElement('Finalize Policy Button', this.page.locator(locators.RenewalPoliciesPage.finalizePolicy));

    await this.waitUntilSyncWithNX();

    if (await WebUserActions.isVisible('Finalize Policy Button', this.page.locator(locators.RenewalPoliciesPage.finalizePolicy))) {
      await WebUserActions.clickOnElement('Finalize Policy Button', this.page.locator(locators.RenewalPoliciesPage.finalizePolicy));
      Logger.info('Clicked Finalize Policy again after wait.');
    }
  }
 
  /**
   * Waits for the NX synchronization spinner to disappear.
   * Monitors the sync spinner element until it becomes hidden (max 120 seconds).
   * @returns {Promise<void>} Promise that resolves when NX sync is complete.
   * @throws {Error} If sync timeout occurs or spinner does not disappear.
   */
  async waitUntilSyncWithNX() {
    const spinner = this.page.locator(locators.RenewalPoliciesPage.policySyncSpinnerMessage);
    Logger.info('Waiting for NX sync spinner to disappear...');

    try {
      await WebUserActions.waitForHidden('NX Sync Spinner', spinner, 90000);
      const stillVisible = await spinner.isVisible();
      if (stillVisible) {
        Logger.warn('NX Sync spinner still visible after 90s — waiting an extra 10s...');
        await this.page.waitForTimeout(10000);
      }

      Logger.info('NX policy sync completed successfully.');
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('Timeout')) {
          Logger.error('NX Sync did not complete within expected time. Spinner still visible.');
          throw new Error('NX sync did not finish — aborting policy creation.');
        }
        if (error.message.includes('Target closed')) {
          Logger.error('Page was closed while waiting for NX Sync spinner.');
          return;
        }
        throw error;
      } else {
        // handle non-Error cases safely
        Logger.error(`Unknown error while waiting for NX Sync: ${String(error)}`);
        throw new Error(`Unknown error: ${String(error)}`);
      }
    }
  }
 
  /**
   * Clicks the edit policy chevron next button to proceed to the next section.
   * Waits for the next button to be visible before clicking.
   * @returns {Promise<void>} Promise that resolves when next button is clicked.
   * @throws {Error} If next button is not found or clicking fails.
   */
  async clickOnEditPolicyChevronNextButton() {
    //await WebUserActions.waitForVisible('Edit Policy Chevron Next Button', this.page.locator(locators.RenewalPoliciesPage.nextButton));
    await WebUserActions.clickOnElement('Edit Policy Chevron Next Button', this.page.locator(locators.RenewalPoliciesPage.nextButton));
    Logger.info('Clicked on Edit Policy Chevron Next Button.');
  }
 
  /**
   * Validates if the policy assignments header is visible.
   * Waits for the policy assignments header element to be visible.
   * @returns {Promise<boolean>} Promise that resolves to true if header is visible, false otherwise.
   * @throws {Error} If validation fails or element check encounters an error.
   */
  async validatePolicyAssignmentsHeader(): Promise<boolean> {
    const locator = this.page.locator(locators.RenewalPoliciesPage.policyAssignmentsPageHeader);
    await WebUserActions.waitForVisible('Policy Assignments Header', locator);
    return await WebUserActions.isVisible('Policy Assignments Header', locator);
  }
 
  /**
   * Clicks the surplus line tax next button and handles potential sync warnings.
   * Validates invoice total text before proceeding and handles up to 2 sync warning popups.
   * Automatically clicks "Stay" button on sync warnings and retries next button.
   * @returns {Promise<void>} Promise that resolves when surplus line tax next action is complete.
   * @throws {Error} If invoice total is not visible or next button interaction fails.
   */
  async clickOnSurplusLineTaxNextButton() {
    const invoiceTotal = this.page.locator(locators.RenewalPoliciesPage.invoiceTotalText);
    const nextBtn = this.page.locator(locators.RenewalPoliciesPage.nextButton);
    const warningStayBtn = this.page.locator(locators.RenewalPoliciesPage.warningPolicySyncToNexsureStayButton);

    // Validate invoice total text
    const visible = await WebUserActions.isVisible('Invoice Total Text', invoiceTotal);
    if (!visible) throw new Error('Invoice Total Text is not visible');
    console.log('Validated the surplus line tax details');

    // Click Next button
    await WebUserActions.clickOnElement('Surplus Lines Tax Next Button', nextBtn);

    // Handle potential sync warning pop-ups (up to 2 times)
    for (let i = 0; i < 2; i++) {
      if (await WebUserActions.isVisible('Warning Policy Sync To Nexsure Stay Button', warningStayBtn)) {
        await WebUserActions.clickOnElement('Warning Policy Sync To Nexsure Stay Button', warningStayBtn);
        await WebUserActions.clickOnElement('Handled Sync Issue and clicked Surplus Lines Tax Next Button', nextBtn);
      }
    }
  }

}
