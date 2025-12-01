```ts
// ...existing code...
import { Locator, Page } from 'playwright';
import { WebUserActions } from '../utils/webUserActions';
import { RandomDataGenerator } from '../utils/randomDataGenerator';
import locators from '../locators/locators.json';
import { HomePage } from './HomePage';
import test from 'node:test';
import { CommonPage } from './CommonPage';
import { Logger } from '../utils/logger';


export class OpportunityPage {

    private readonly page: Page;
    static opportunityName: string;
    private commonPage: CommonPage;
    constructor(page: Page) {
    this.page = page;
    this.commonPage = new CommonPage(page);
    }

    private get newOpportunityButton(): Locator {
        return this.page.locator(locators.OpportunityPage.newOpportunityButton);
    }
    private get intialIntakeRadioButton(): Locator {
        return this.page.locator(locators.OpportunityPage.intialIntakeRadioButton);
    }
    private get opportunityNextButton(): Locator {
        return this.page.locator(locators.OpportunityPage.opportunityNextButton);
    }
    private get intialIntakeHeader(): Locator {
        return this.page.locator(locators.OpportunityPage.intialIntakeHeader);
    }
    private get opportunityName(): Locator {
        return this.page.locator(locators.OpportunityPage.opportunityName);
    }
    private get currencyType(): Locator {
        return this.page.locator(locators.OpportunityPage.currencyType);
    }
    private get stageDropDown(): Locator {
        return this.page.locator(locators.OpportunityPage.stageDropDown);
    }
    static get dynamicStageValue(): (stageValue: string) => string {
        return (stageValue: string) => `//span[text()='${stageValue}']`;
    }
    private get signingDateInputField(): Locator {
        return this.page.locator(locators.OpportunityPage.signingDateInputField);
    }
    private get closeDateInputField(): Locator {
        return this.page.locator(locators.OpportunityPage.closeDateInputField);
    }

    private get insuranceDropdownButton(): Locator {
      return this.page.locator(locators.OpportunityPage.insuranceDropdownButton);
    
    }

    private get selectedValueLocator():(value: string) => string {
        return (value: string) => `//lightning-base-combobox//button[@data-value='${value}']`;
    }    

    private get insuranceSubType(): Locator {
        return this.page.locator(locators.OpportunityPage.insuranceSubTypeDropDown);
    }

    /**
     * Creates a new Opportunity.
     * 
     * This includes:
     * 1. Clicking the "New Opportunity" button.
     * 2. Selecting the "Initial Intake" radio option.
     * 3. Clicking the "Next" button to proceed.
     * 
     * @returns {Promise<void>} A promise that resolves once all interactions are completed.
    */
    async clickOnOpportunityNewButton() : Promise<void>{
    await WebUserActions.clickOnElement("new Opportunity Button",this.newOpportunityButton);
    await WebUserActions.clickOnElement("intial Intake Button",this.intialIntakeRadioButton);
    await WebUserActions.clickOnElement("opportunity Next Button",this.opportunityNextButton);
    }

      
    private insuranceOption(insuranceValue:string): Locator {
        const xpath = WebUserActions.getDynamicLocator(locators.OpportunityPage.insuranceTypeValueLocator, insuranceValue);
        return this.page.locator(xpath);
    }

    private insuranceSubTypeOption(insuranceValue:string): Locator {
        const xpath = WebUserActions.getDynamicLocator(locators.OpportunityPage.insuranceSubTypeValueLocator, insuranceValue);
        return this.page.locator(xpath);
    }

    /**
     * Enters opportunity details such as opportunity name, stage, dates,
     * insurance type and subtype by interacting with respective UI elements.
     * Generates random opportunity name and uses random dates.
     * Validates and selects insurance type and subtype dropdowns.
     * @param {string} insuranceValue - The insurance type to select.
     * @param {string} insuranceSubtypeValue - The insurance subtype to select.
     * @returns {Promise<void>} Resolves after filling all fields.
     */     
    async enterOpportunityDetails(insuranceValue : string,insuranceSubtypeValue : string){
        await this.page.waitForLoadState('domcontentloaded');
        OpportunityPage.opportunityName =  RandomDataGenerator.randomOpportunityName();
        await WebUserActions.isVisible("opportunity Name",this.opportunityName);
        await WebUserActions.sendText("opportunity Name",this.opportunityName,OpportunityPage.opportunityName);
        await this.currencyType.isVisible();
        await WebUserActions.clickOnElement("stage DropDown",this.stageDropDown);
        const stageDropDownValue = await this.page.locator(OpportunityPage.dynamicStageValue("Intake"));
        await WebUserActions.isVisible("stage Value",stageDropDownValue);
        await WebUserActions.clickOnElement("stage Value",stageDropDownValue);
        const signingDate = RandomDataGenerator.todayDate();
        await this.signingDateInputField.fill(signingDate);
        const closedDate =RandomDataGenerator.randomcloseDate();
        await this.closeDateInputField.fill(closedDate);

        if (!(await this.page.locator(this.selectedValueLocator(insuranceValue)).isVisible())) {
            console.log(`Insurance value "${insuranceValue}" not selected yet. Proceeding to select...`);

            await this.insuranceDropdownButton.click({ force: true });
            await this.insuranceDropdownButton.waitFor({ state: 'visible' });

            await WebUserActions.clickOnElement("insurance DropDown", this.insuranceDropdownButton);
            // Wait for dropdown options to render
            await this.insuranceOption(insuranceValue).waitFor({ state: 'visible', timeout: 2000 });

            const optionElement = this.insuranceOption(insuranceValue);
            await WebUserActions.waitForVisible("Insurance Type Option", optionElement, 2000);

            // Click the desired option
            await WebUserActions.clickOnElement("Insurance Type Option", optionElement);
        } else {
            console.log(`Insurance type "${insuranceValue}" is already selected.`);
        }

        await WebUserActions.clickOnElement("insurance Sub Type Drop Down", this.insuranceSubType);
        await WebUserActions.clickOnElement("insurance Type field",this.insuranceSubTypeOption(insuranceSubtypeValue));
   }

    /**
     * Creates a new opportunity by opening the new opportunity tab,
     * waiting for UI readiness, and entering required details.
     *
     * @param {string} insuranceValue - Insurance type to select.
     * @param {string} insuranceSubtypeValue - Insurance subtype to select.
     * @returns {Promise<void>} Resolves after opportunity is created.
     */
    async createNewOpportunity(insuranceValue : string,insuranceSubtypeValue : string): Promise<void>{   
        await this.clickOnOpportunityNewButton(); 
        console.log("successfully opened the tab");
        await this.intialIntakeHeader.waitFor({state:"visible"});// waits for the initial intake header to be visible
        await this.enterOpportunityDetails(insuranceValue,insuranceSubtypeValue);
    }

    private get saveButton(): Locator {
        return this.page.locator(locators.OpportunityPage.saveButton);
    }

    /**
     * Clicks the Save button on the opportunity form to save changes.
     *
     * @returns {Promise<void>} Resolves after clicking the save button.
     */
    async clickOnSaveButton(): Promise<void>{
        await this.page.waitForTimeout(2000);
        await WebUserActions.clickOnElement("save Button",this.saveButton);
     }
    
    private get ndaNewButton(): Locator {
        return this.page.locator(locators.OpportunityPage.ndaNewButton);
    }
    private get nbilNewButton(): Locator {
        return this.page.locator(locators.OpportunityPage.nbilNewButton);   
    }

    /**
     * Clicks the "New NDA" button to initiate a new NDA request.
     *
     * @returns {Promise<void>} Resolves after clicking the button.
     */
    async clickOnNewNDAButton(): Promise<void>{
        await WebUserActions.clickOnElement("NDA New Button", this.ndaNewButton);
    }

     private get opportunityStageAfterNdaOrNbil(): Locator {
        return this.page.locator(locators.OpportunityPage.quotingStatus);
    }

    /**
     * Validates that the opportunity stage after NDA or NBIL is visible.
     * Reloads the page and waits for the "Quoting" stage to appear.
     *
     * @returns {Promise<void>} Resolves when stage is visible.
     */
    async validateStageAfterNDAOrNbil(): Promise<void>{
    await this.page.reload({ waitUntil: 'networkidle' }); // reloads the page and waits until the page is stable
    await this.opportunityStageAfterNdaOrNbil.waitFor({ state: 'visible' });
    }

    /**
     * Clicks the "New NBIL Request" button to initiate a new NBIL request.
     *
     * @returns {Promise<void>} Resolves after clicking the button.
     */
    async clickOnNewNBILButton(): Promise<void>{
        await this.commonPage.verifyTab("Opportunity");
        await WebUserActions.clickOnElement("NBIL New Button",this.nbilNewButton);
    }

    private get activityTab(): Locator {
       return this.page.locator(locators.OpportunityPage.activityTab);
     }
    
    /**
     * Navigates to the Activity tab in the opportunity view.
     *
     * @returns {Promise<void>} Resolves after navigation.
     */
    async navigateToActivityTab(): Promise<void>{
        await this.commonPage.verifyTab("Opportunity");
        await WebUserActions.clickOnElement("activity Tab",this.activityTab);
    }

    private get ndaOrNbilActivityValidation(): Locator {
        return this.page.locator(locators.OpportunityPage.ndaOrNbilActivityValidation);
    }

    private get ndaFileValidation():Locator {
        return this.page.locator(locators.OpportunityPage.NDAFileValidation);
    }

    private get fileSection():Locator {
        return this.page.locator(locators.OpportunityPage.fileSection);
    } 
    /**
     * Validates that an NDA file is uploaded by checking visibility
     * of the appropriate elements in the file section.
     *
     * @returns {Promise<void>} Resolves when file upload is confirmed.
     */
    async validateNDAorNBILUploadedFile(fileSet?: string): Promise<void>{
     await this.ndaOrNbilActivityValidation.waitFor({ state: 'visible' });
        // Map fileSet to expected filenames. Default to doc1/doc3 if not provided.
        const map: Record<string, string[]> = {
            set1: ['set1_a.docx','set1_b.jpg','set1_c.md'],
            set2: ['set2_a.docx','set2_b.png','set2_c.pdf'],
            set3: ['set3_a.docx','set3_b.jpg','set3_c.md'],
            set4: ['set4_a.docx','set4_b.webp','set4_c.pdf'],
            set5: ['set5_a.pdf','set5_b.docx','set5_c.png'],
            set6: ['set6_a.docx','set6_b.jpg','set6_c.md']
        };
        let files: string[] = ['doc1.docx','doc3.docx'];
        if (fileSet) {
            const key = fileSet.trim().toLowerCase();
            if (key in map) files = map[key];
        }
        await this.commonPage.validateFilesInRelatedListAfterUploadAndDelete(files);
    }

    private get nbilFileValidation():Locator {
        return this.page.locator(locators.OpportunityPage.NBILFileValidation);
    }
    /**
     * Validates that an NBIL file is uploaded by checking visibility
     * of the appropriate elements in the file section.
     *
     * @returns {Promise<void>} Resolves when file upload is confirmed.
     */
    async validateNBILUploadedFile(): Promise<void>{
         await this.ndaOrNbilActivityValidation.waitFor({ state: 'visible' });
        await WebUserActions.clickOnElement("file Section",this.fileSection);
        await this.nbilFileValidation.waitFor({ state: 'visible' });
    }

    private get showMoreActionsDropDown(): Locator {
        return this.page.locator(locators.OpportunityPage.showMoreActionsDropDown);
    }
    
    /**
     * Clicks the "Show more actions" dropdown button.
     * Triggers the dropdown menu for additional opportunity actions.
     * @returns {Promise<void>} Resolves after clicking the dropdown.
     */
    async clickOnShowMoreActionsDropDown() :Promise<void>{
        await WebUserActions.clickOnElement("show More Actions DropDown",this.showMoreActionsDropDown);
    }

    private get manageOpportunityAssignmentOption(): Locator {
        return this.page.locator(locators.OpportunityPage.manageOpportunityAssignmentOption);
    }
    
    /**
     * Clicks the "Manage Opportunity Assignments" button from the ShowMore Action dropdown menu.
     * Opens the assignment management interface for the opportunity.
     * @returns {Promise<void>} Resolves after clicking the button.
     */
    async clickOnManageOpportunityAssignment(){
     await WebUserActions.clickOnElement("manage Opportunity Assignment Option",this.manageOpportunityAssignmentOption);
    }
    
    private get coverageBuilderOption(): Locator {
        return this.page.locator(locators.OpportunityPage.coverageBuilderOption);
    }

    /**
     * Clicks the "Coverage Builder" button from the ShowMore Action dropdown menu.
     *
     * @returns {Promise<void>} Resolves after clicking the button.
     */
    async clickOnCoverageBuilderOption(): Promise<void>{
        await WebUserActions.clickOnElement("coverage Builder Option",this.coverageBuilderOption);
    }

    /**
     * Opens an existing opportunity by its name.
     * Waits for the opportunity link to be visible, then clicks it.
     * @param {string} opportunityName - The name of the opportunity to open.
     * @returns {Promise<void>} Resolves after navigation to the opportunity.
     */
    async openExistingOpportunity(opportunityName: string): Promise<void> {
        const opportunityLink = this.page.locator(`a[title='${opportunityName}']`);
        await opportunityLink.waitFor({ state: 'visible', timeout: 10000 });
        await WebUserActions.clickOnElement("Opportunity Link", opportunityLink);
    }

    private coverageValue(coverageType:string):Locator{
        const xpath = WebUserActions.getDynamicLocator(locators.OpportunityPage.selectedCoverageType, coverageType);
        return this.page.locator(xpath);
    }

    private lineOfCoveragesValue(lineOfCoverage:string):Locator{ 
        const xpath = WebUserActions.getDynamicLocator(locators.OpportunityPage.selectedLineOfCoveragesValue, lineOfCoverage);
        return this.page.locator(xpath);
    }

    private get coverageSection():Locator{
        return this.page.locator(locators.OpportunityPage.coverageSection);
    }

    /**
     * Validates coverage details for a given coverage type and line of coverage.
     * Clicks the Coverages tab, then waits for both coverage type and line of coverage to be visible.
     * @param {string} coverageType - The coverage type to validate.
     * @param {string} lineOfCoverage - The line of coverage to validate.
     * @returns {Promise<void>} Resolves when both coverage type and line of coverage are visible.
     */
    async validateCoverageDetails(coverageType:string, lineOfCoverage:string): Promise<void>{
        await WebUserActions.clickOnElement("Coverages Tab",this.coverageSection);
        await this.coverageValue(coverageType).waitFor({ state: 'visible' });
        await this.lineOfCoveragesValue(lineOfCoverage).waitFor({ state: 'visible' });
    }

    private get opportunityTeamShowMoreActionsDropDown(): Locator {
        return this.page.locator(locators.OpportunityPage.opportunityTeamShowMoreActionsDropDown);
    }

    private get addOpportunityTeamMembersOption()   : Locator {
        return this.page.locator(locators.OpportunityPage.addOpportunityTeamMembersOption);
    }
    
    private get addOpportunityTeamHeader(): Locator {
        return this.page.locator(locators.OpportunityPage.addOpportunityTeamHeader);
    }

    private get teamRoleSelectionDropDownField()   : Locator {
        return this.page.locator(locators.OpportunityPage.teamRoleSelectionDropDownField);
    }

    private get teamRoleDropDown(): Locator {
        return this.page.locator(locators.OpportunityPage.teamRoleDropDown);
    }

    private teamRoleOption(roleName:string)   : Locator {
        const xpath = WebUserActions.getDynamicLocator(locators.OpportunityPage.teamRoleOption, roleName);
        return this.page.locator(xpath);
    }

    private get teamUserSelectionDropDownField(): Locator {
        return this.page.locator(locators.OpportunityPage.teamUserSelectionDropDownField);
    }

    private teamUserOption(teamUserName:string)   : Locator {
       const xpath = WebUserActions.getDynamicLocator(locators.OpportunityPage.teamUserOption, teamUserName);
        return this.page.locator(xpath);
    }

    private get opportunityAccessSelectionField(): Locator {
        return this.page.locator(locators.OpportunityPage.opportunityAccessSelectionField);
    }

    private get opportunityAccessDropDown(): Locator {
        return this.page.locator(locators.OpportunityPage.opportunityAccessDropDown);
    }

    private opportunityAccessOption(accessType:string): Locator {
        const xpath = WebUserActions.getDynamicLocator(locators.OpportunityPage.opportunityAccessOption, accessType);
        return this.page.locator(xpath);
    }

    private get opportunityTeamSaveButton() : Locator {
        return this.page.locator(locators.OpportunityPage.opportunityTeamSaveButton);
    }

    /**
     * Clicks the Opportunity Team "Show More Actions" dropdown and selects "Add Opportunity Team Members".
     * Opens the interface to add new team members to the opportunity.
     * @returns {Promise<void>} Resolves after both actions are completed.
     */
    async clickOnOpportunityTeamShowMoreActionsDropDown(): Promise<void>{
        await WebUserActions.clickOnElement("opportunity Team Show More Actions Drop Down",this.opportunityTeamShowMoreActionsDropDown);
        await WebUserActions.clickOnElement("add Opportunity Team Members Option",this.addOpportunityTeamMembersOption);
    }
    
    /**
     * Adds a user to the Opportunity Team with the specified role and access type.
     * Waits for the team header to be visible, then selects role, user, access type, and saves.
     * Validates the team header visibility before performing any actions.
     * @param {string} roleName - The role to assign to the user.
     * @param {string} teamUserName - The name of the user to add