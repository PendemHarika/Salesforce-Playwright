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
     * @param {string} teamUserName - The name of the user to add.
     * @param {string} accessType - The access type to assign to the user.
     * @returns {Promise<void>} Resolves when the user is added and saved.
     */
    async addOpportunityTeamMembers(roleName:string, teamUserName:string, accessType:string): Promise<void>{
        await this.addOpportunityTeamHeader.waitFor({state:"visible"});
        await WebUserActions.clickOnElement("team Role Button",this.teamRoleSelectionDropDownField);
        await WebUserActions.clickOnElement("team Role Drop Down",this.teamRoleDropDown);
        await WebUserActions.clickOnElement("team Role Option",this.teamRoleOption(roleName));
        await WebUserActions.clickOnElement("team User Drop Down",this.teamUserSelectionDropDownField);
        await WebUserActions.clickOnElement("team User Option",this.teamUserOption(teamUserName));
        await WebUserActions.clickOnElement("opportunity Access Button",this.opportunityAccessSelectionField);
        await WebUserActions.clickOnElement("opportunity Access Drop Down",this.opportunityAccessDropDown);
        await WebUserActions.clickOnElement("opportunity Access Option",this.opportunityAccessOption(accessType));
        await WebUserActions.clickOnElement("opportunity Team Save Button",this.opportunityTeamSaveButton);   
    }

    private addedUser(userName :string): Locator {
        const xpath = WebUserActions.getDynamicLocator(locators.OpportunityPage.oppportunityTeamUser, userName);
        return this.page.locator(xpath);
    }

    /**
     * Validates that a user has been added to the Opportunity Team.
     * Waits for the user to appear in the team list.
     *
     * @param {string} userName - The name of the user to validate.
     * @returns {Promise<void>} Resolves when the user is visible in the team.
     */
    async validateAddedUser(userName: string): Promise<void> {
        // Wait for the added user to be visible in the Opportunity Team section
        await this.addedUser(userName).waitFor({ state: 'visible' });
    }
    private get notesShowMoreActionsDropDown(): Locator {
        return this.page.locator(locators.OpportunityPage.notesShowMoreActionsDropDown);    
    }

    private get newNoteOption(): Locator {
        return this.page.locator(locators.OpportunityPage.newNoteOption);    
    }   

    private get notesWindowTitleHeading(): Locator {
        return this.page.locator(locators.OpportunityPage.notesWindowTitleHeading);    
    }

    private get notesTitleInput(): Locator {
        return this.page.locator(locators.OpportunityPage.notesTitleInput);    
    }

    private get notesTextArea(): Locator {
        return this.page.locator(locators.OpportunityPage.notesTextArea);
    }

    private get notesDoneButton(): Locator {
        return this.page.locator(locators.OpportunityPage.notesDoneButton);
    }

    /**
     * Clicks the Notes "Show More Actions" dropdown and selects "New Note".
     * Waits for the notes window to be visible before proceeding.
     * Opens the interface to create a new note for the opportunity.
     * @returns {Promise<void>} Resolves after both actions are completed and window is visible.
     */
    async clickOnNotesShowMoreActionsDropDown(): Promise<void> {
        await WebUserActions.clickOnElement("notes Show More Actions Drop Down", this.notesShowMoreActionsDropDown);
        await WebUserActions.clickOnElement("new Note Option", this.newNoteOption);
        await this.notesWindowTitleHeading.waitFor({ state: "visible" });
    }

    /**
     * Adds note details (title and text) and saves the note.
     * Waits for the Done button to be visible before saving.
     * Fills both the note title and body text areas.
     * @param {string} noteTitle - The title of the note.
     * @param {string} noteText - The body of the note.
     * @returns {Promise<void>} Resolves when the note is added and saved.
     */
    async addNotesDetails(noteTitle: string, noteText: string): Promise<void> {
        await WebUserActions.sendText("notes Title Input", this.notesTitleInput, noteTitle);
        await WebUserActions.sendText("notes Text Area", this.notesTextArea, noteText);
        await this.notesDoneButton.waitFor({ state: "visible" });
        await WebUserActions.clickOnElement("notes Done Button", this.notesDoneButton);
    }

    private notesTitleLocator(noteTitle:string): Locator {
        const xpath = WebUserActions.getDynamicLocator(locators.OpportunityPage.addedNoteTitle, noteTitle);
        return this.page.locator(xpath);
    }

    private addedBodyNote(noteBody:string): Locator {
        const xpath = WebUserActions.getDynamicLocator(locators.OpportunityPage.addedBodyNote, noteBody);
        return this.page.locator(xpath);
    }

    /**
     * Validates that a note with the given title and body has been added.
     * Waits for both the note title and body to be visible in the notes section.
     * Confirms successful note creation by verifying both fields.
     * @param {string} noteTitle - The title of the note to validate.
     * @param {string} noteBody - The body/content of the note to validate.
     * @returns {Promise<void>} Resolves when both title and body are visible.
     */
    async validateNotesAdded(noteTitle: string, noteBody: string): Promise<void> {
        // Wait for the note title to be visible
        await this.notesTitleLocator(noteTitle).waitFor({ state: 'visible' });
        // Wait for the note body to be visible
        await this.addedBodyNote(noteBody).waitFor({ state: 'visible' });
    }

    private emailRequestSentLink(opportunityName:string):Locator {
        const xpath= WebUserActions.getDynamicLocator(locators.OpportunityPage.emailRequestSentLink, opportunityName);
        return this.page.locator(xpath).first();
    }

    /**
     * Opens the sent email request from the activity tab.
     * Waits for the email request link to be visible and clicks it.
     * @returns {Promise<void>} Resolves when the email request is opened.
     */
    async openTheEmailRequestSent() : Promise<void>{
        await this.emailRequestSentLink(OpportunityPage.opportunityName).waitFor({ state: 'visible'});
        await WebUserActions.clickOnElement("Email Request Sent Link", this.emailRequestSentLink(OpportunityPage.opportunityName));
    }

    private get clickOnEmailDetailsTab():Locator {
        return this.page.locator(locators.OpportunityPage.emailDetailsTab);
    }

    /**
     * Navigates to the email details tab in the current view.
     * Clicks on the email details tab to view email information.
     * @returns {Promise<void>} Resolves when navigation to email details tab is complete.
     */
    async navigateToEmailDetailsTab(): Promise<void>{
        await WebUserActions.clickOnElement("Email Details Tab", this.clickOnEmailDetailsTab);
    }

    private get toAddressEmailField():Locator {
        return this.page.locator(locators.OpportunityPage.toAddressEmailField);
    }

    private get ccAddressEmailField():Locator {
        return this.page.locator(locators.OpportunityPage.ccAddressEmailField);
    }

    private get emailSubjectField():Locator {
        return this.page.locator(locators.OpportunityPage.emailSubjectField);
    }

    static toAddressvalueIsVisible:Boolean;
    /**
     * Validates email fields based on insurance type and request type.
     * Checks To Address field value against expected email based on insurance and request type.
     * Supports validation for Reps & Warranties, Contingent Liability, and Tax Liability insurance types.
     * @param {string} insuranceType - The type of insurance (e.g., "Reps & Warranties", "Tax Liability").
     * @param {string} requestType - The type of request (e.g., "NDA", "NBIL").
     * @returns {Promise<void>} Resolves when email field validation is complete.
     */
    async validateEmailFields(insuranceType:string,requestType:string): Promise<void>{
        //await HomePage.marketEmailsValue.isVisible();
        await this.navigateToEmailDetailsTab();
        const toAddressvalue =await WebUserActions.getTextForElement("toAddress Value",this.toAddressEmailField);
        console.log("To Address value is: " + toAddressvalue);
        if((insuranceType==="Reps & Warranties" || insuranceType==="Contigent Liabilty") && (requestType==="NDA" || requestType==="NBIL")){
            OpportunityPage.toAddressvalueIsVisible=(toAddressvalue===HomePage.marketEmailsValue);
            if(OpportunityPage.toAddressvalueIsVisible){
                console.log("To Address value is as expected: " + toAddressvalue);
                return;
            }else {
                console.log("To Address value is NOT as expected. Actual: " + toAddressvalue + ", Expected: " + HomePage.marketEmailsValue);
            }
        }else if (insuranceType==="Tax Liability" && requestType==="NDA"){
           OpportunityPage.toAddressvalueIsVisible=toAddressvalue===HomePage.taxCarriersEmailValue;
            if(OpportunityPage.toAddressvalueIsVisible){
                console.log("To Address value is as expected: " + toAddressvalue);
                return;
            }else {
                console.log("To Address value is NOT as expected. Actual: " + toAddressvalue + ", Expected: " + HomePage.marketEmailsValue);
            }
        }else if (insuranceType==="Tax Liability" && requestType==="NBIL"){
            OpportunityPage.toAddressvalueIsVisible=toAddressvalue===HomePage.taxNDAEmailValue;
            if(OpportunityPage.toAddressvalueIsVisible){
                console.log("To Address value is as expected: " + toAddressvalue);
                return;
            }else {
                console.log("To Address value is NOT as expected. Actual: " + toAddressvalue + ", Expected: " + HomePage.marketEmailsValue);
            }
        } else {
            console.log("No proper insurance type or request type provided.");
        }
    }
    
    
    

    private get lastSubTabCloseButton(): Locator {
        return this.page.locator(locators.OpportunityPage.closeLastSubTabButton);
    }
    /**
     * Closes the last sub-tab in the opportunity view.
     * Clicks the close button for the last opened sub-tab.
     * @returns {Promise<void>} Resolves when the sub-tab is closed.
     */
    async closeLastSubTab(): Promise<void> {
        await this.page.reload({ waitUntil: 'networkidle' });
        await WebUserActions.clickOnElement("Last Sub Tab Close Button", this.lastSubTabCloseButton);
    }

    async editFieldsInSection(section: string, updates: any[]) {
        for (let i = 0; i < updates.length; i++) {
            const fieldData = updates[i];
            const { field, type } = fieldData;

            console.log(`\nEditing field: ${field} (${type})`);

            await this.clickEditButtonForField(section, field);

            //Special handling for Diligence Advisors
            if (section === "Diligence Advisors" && type === "dropdown") {
                // Edit dropdown and get selected value
                const selectedValue = await this.editDropdownField(field);
                fieldData.value = selectedValue;

                // Click Save and verify dropdown field
                await this.clickOnSaveButton();
                await this.page.waitForTimeout(1500);
                await this.verifySingleField(section, fieldData);

                // Determine corresponding "Other ..." field
                const otherFieldName = `Other ${field}`;
                const nextField = updates[i + 1];

                // Scenario 2: Dropdown value is "Other"
                if (selectedValue?.toLowerCase() === "other") {
                    console.log(`"${field}" is set to 'Other' — editing "${otherFieldName}" field...`);

                    if (nextField && nextField.field === otherFieldName) {
                    await this.clickEditButtonForField(section, otherFieldName);
                    const otherValue = nextField.value || await RandomDataGenerator.randomString("Other", 5);
                    await this.editTextOrNumberField(otherFieldName, otherValue);
                    nextField.value = otherValue;

                    await this.clickOnSaveButton();
                    await this.page.waitForTimeout(1500);
                    await this.verifySingleField(section, nextField);

                    // Skip next iteration (we already handled the Other field)
                    i++;
                    continue;
                    }
                } 
                // Scenario 1: Dropdown value is NOT "Other"
                else {
                    console.log(`"${field}" is NOT 'Other' — running validation flow for "${otherFieldName}" error handling.`);

                    if (nextField && nextField.field === otherFieldName) {
                    await this.clickEditButtonForField(section, otherFieldName);
                    const tempValue = nextField.value || await RandomDataGenerator.randomString("InvalidOther", 5);
                    await this.editTextOrNumberField(otherFieldName, tempValue);
                    await this.clickOnSaveButton();

                    const errorLocator = this.page.locator(locators.OpportunityPage.otherErrorMessage);
                    try {
                        await WebUserActions.waitForVisible("Field Error Popup", errorLocator);
                        await WebUserActions.clickOnElement(
                        "Field Error Close Button",
                        this.page.locator(locators.OpportunityPage.closeBtnOfErrorPopUp)
                        );
                        console.log(`Validation error displayed for "${otherFieldName}" as expected.`);
                    } catch {
                        console.error(`Expected validation error for "${otherFieldName}" not found!`);
                    }

                    // Step 3: Clear the field and save again (no error expected)
                    await this.editTextOrNumberField(otherFieldName, "");
                    await this.clickOnSaveButton();
                    await this.page.waitForTimeout(1000);
                    await this.verifySingleField(section, fieldData);

                    console.log(`Cleared "${otherFieldName}" and saved successfully.`);

                    // Skip next field and continue
                    i++;
                    continue;
                    }
                }

                continue; 
            }

            // Special handling for Deal Overview (Insurance Type + Insurance Sub-Type)
            if (section === "Deal Overview" && field === "Insurance Type") {
                console.log(`Special handling for Insurance Type + Insurance Sub-Type`);

                const selectedType = await this.editDropdownField(field);
                fieldData.value = selectedType;

                // Find corresponding Insurance Sub-Type field
                const nextField = updates[i + 1];
                if (nextField && nextField.field === "Insurance Sub-Type") {
                    console.log(`🧩 Editing dependent field: Insurance Sub-Type`);
                    const selectedSubType = await this.editDropdownField(nextField.field);
                    nextField.value = selectedSubType;
                }
                await this.clickOnSaveButton();
                await this.page.waitForTimeout(1500);

                await this.verifySingleField(section, fieldData);

                // Skip next iteration (we already processed Insurance Sub-Type)
                if (nextField && nextField.field === "Insurance Sub-Type") {
                    i++;
                }

                continue;
            }

            // Default behavior for all other sections and field types
            const updatedValue = await this.editFieldBasedOnType(fieldData);
            if (updatedValue !== undefined) fieldData.value = updatedValue;

            await this.clickOnSaveButton();
            await this.page.waitForTimeout(1500);
            await this.verifySingleField(section, fieldData);
        }
    }

    async clickEditButtonForField(section: string, field: string) {
        const editButton = await WebUserActions.getDynamicLocator(
        locators.OpportunityPage.editSpecificFieldButton,
        field
        );
        await this.page.locator(editButton).click();
    }

    private async editFieldBasedOnType({ field, type, value }: any) {
        switch (type) {
            case "text":
            case "number":
                return await this.editTextOrNumberField(field, String(value));

            case "textarea":
                await this.editTextareaField(field, String(value));
                return value;

            case "dropdown":
                return await this.editDropdownField(field);

            case "checkbox":
                return await this.editCheckboxField(field);

            case "date":
                await this.editDateField(field, String(value));
                return value;

            case "list":
                return await this.editListField(field);

            case "search":
                return await this.editSearchField(field);

            default:
                console.warn(`Unsupported field type: ${type}`);
                return value;
        }
    }

    private async editTextOrNumberField(field: string, value: string) {
        const input = await WebUserActions.getDynamicLocator(locators.OpportunityPage.textFieldInputBox, field);
        await WebUserActions.sendText("Text Field Input", this.page.locator(input), value);
        return value;
    }

    private async editTextareaField(field: string, value: string) {
        const input = await WebUserActions.getDynamicLocator(locators.OpportunityPage.textAreaInputBox, field);
        await this.page.locator(input).fill(value);
    }

    private async editDropdownField(field: string) {
        const dropdown = await WebUserActions.getDynamicLocator(locators.OpportunityPage.dropdownfieldxpath, field);
        await this.page.locator(dropdown).click();

        const optionsLocator = await WebUserActions.getDynamicLocator(locators.OpportunityPage.dropdownOptions, field);
        const options = this.page.locator(optionsLocator);
        const count = await options.count();

        const optionValues = await WebUserActions.getDynamicLocator(locators.OpportunityPage.dropdownOptionsValues, field);

        for (let i = 0; i < count; i++) {
            const option = options.nth(i);
            const selected = await option.getAttribute("aria-selected");
            const optionValue = await this.page.locator(optionValues).nth(i).textContent();

            if (selected !== "true" && optionValue?.trim() !== "--None--") {
                const selectedText = (await option.textContent())?.trim() ?? "";
                await option.click();
                console.log(`Selected dropdown option: ${selectedText}`);
                return selectedText;
            }
        }
    }

    private async editCheckboxField(field: string) {
        const checkbox = await WebUserActions.getDynamicLocator(locators.OpportunityPage.checkboxInputBox, field);
        const checkboxLocator = this.page.locator(checkbox);
        const checked = await checkboxLocator.isChecked();

        if (!checked) {
            await checkboxLocator.check();
            console.log(`Checked the checkbox for ${field}`);
            return "true";
        } else {
            await checkboxLocator.uncheck();
            console.log(`Unchecked the checkbox for ${field}`);
            return "false";
        }
    }

    private async editDateField(field: string, value: string) {
        const dateInput = await WebUserActions.getDynamicLocator(locators.OpportunityPage.textFieldInputBox, field);
        await this.page.locator(dateInput).fill(value);
        console.log(`Entered date: ${value}`);
    }

    private async editListField(field: string) {
        console.log(`Editing list field: ${field}`);

        const listOptionLocator = await WebUserActions.getDynamicLocator(locators.OpportunityPage.listOptions, field);
        const selectedListLocator = await WebUserActions.getDynamicLocator(locators.OpportunityPage.selectedListValues, field);

        const options = this.page.locator(listOptionLocator);
        await options.first().waitFor({ state: 'visible', timeout: 10000 });

        console.log(`Clicking first available list option for "${field}"`);
        await WebUserActions.clickOnElement("First List Option", options.first());

        console.log(`Clicking 'Move to Chosen' button`);
        await WebUserActions.clickOnElement("Move to Chosen Button", this.page.locator(locators.OpportunityPage.moveToChosenButton));

        const selectedValuesLocator = this.page.locator(selectedListLocator);
        await selectedValuesLocator.first().waitFor({ state: 'visible', timeout: 10000 });

        const selectedCount = await selectedValuesLocator.count();
        const selectedTexts: string[] = [];

        for (let i = 0; i < selectedCount; i++) {
            const text = (await selectedValuesLocator.nth(i).textContent())?.trim();
            if (text) selectedTexts.push(text);
        }

        const finalValue = selectedTexts.join(';');
        console.log(`Selected list values for "${field}": ${finalValue}`);

        return finalValue;
    }

    private async editSearchField(field: string) {
        console.log(`Editing search field: ${field}`);

        const inputLocator = await WebUserActions.getDynamicLocator(locators.OpportunityPage.textFieldInputBox, field);
        const input = this.page.locator(inputLocator);

        await WebUserActions.waitForVisible("Search Input Box", input);
        console.log(`Typing 'test' in search box for "${field}"`);
        await WebUserActions.sendText("Search Input", input, "test");

        const optionLocator = await WebUserActions.getDynamicLocator(locators.OpportunityPage.searchOptionValue, field);
        const options = this.page.locator(optionLocator);

        await WebUserActions.waitForVisible("Search Option Value", options.first());

        const selectedText = (await options.first().textContent())?.trim() || "";
        console.log(`Selecting search result: ${selectedText}`);

        await WebUserActions.clickOnElement("Search Option", options.first());

        console.log(`Selected value for "${field}": ${selectedText}`);
        return selectedText;
    }

    private async verifySingleField(section: string, { field, type, value }: any) {
        const displayedValue = await this.getFieldValue(section, field, type);

        const clean = (str: string) => str.replace(/[^\w\s%.-]/g, "").trim();

        let isMatch = false;

        switch (type) {
            case "checkbox": {
                const normalizedDisplayed = String(displayedValue).toLowerCase();
                const normalizedExpected = String(value).toLowerCase();
                isMatch = normalizedDisplayed === normalizedExpected;
                break;
            }
            case "dropdown": {
                isMatch = displayedValue?.includes(value);
                break;
            }
            default: {
                const normalizeNumber = (str: string) => {
                    const cleaned = str.replace(/[^\d.-]/g, "");
                    return cleaned === "" || isNaN(Number(cleaned)) ? null : Number(cleaned);
                };

                const displayedNum = normalizeNumber(displayedValue);
                const expectedNum = normalizeNumber(String(value));

                if (displayedNum !== null && expectedNum !== null) {
                    isMatch = displayedNum === expectedNum;
                } else {
                    const normalizedDisplayed = clean(displayedValue);
                    const normalizedExpected = clean(String(value));
                    isMatch = normalizedDisplayed === normalizedExpected;
                }
            }
        }
    }

    async getFieldValue(section: string, field: string, type: string): Promise<string> {

        let fieldLocator: string;

        if (type === "number") {
            fieldLocator = await WebUserActions.getDynamicLocator(
                locators.OpportunityPage.numberFieldValueInOpportunity,
                field
            );
        }
        else if (type === "checkbox") {
            fieldLocator = await WebUserActions.getDynamicLocator(
                locators.OpportunityPage.checkboxFieldValueInOpportunity,
                field
            );
        }
        else if (type === "search") {
            fieldLocator = await WebUserActions.getDynamicLocator(
                locators.OpportunityPage.searchFieldValueInOpportunity,
                field
            );
        }

        else {
            fieldLocator = await WebUserActions.getDynamicLocator(
                locators.OpportunityPage.fieldValueInOpportunity,
                field
            );
        }
        const element = this.page.locator(fieldLocator);
        await WebUserActions.waitForVisible(`Field Value for ${field}`, element);

        return type === "checkbox"
            ? (await element.isChecked()) ? "true" : "false"
            : (await element.textContent())?.trim() ?? "";
    }

    async clickOnNewPolicyButton() {
        //await WebUserActions.waitForVisible('New Policy dropdown', this.page.locator(locators.OpportunityPage.policyDropdown), 5000);
        await this.page.waitForTimeout(5000);
        await WebUserActions.scrollUntilElementVisible(this.page, this.page.locator(locators.OpportunityPage.policyDropdown));
        await WebUserActions.clickOnElement('New Policy dropdown', this.page.locator(locators.OpportunityPage.policyDropdown));
        await WebUserActions.clickOnElement('New Policy Button', this.page.locator(locators.OpportunityPage.newPolicyoption))
        await WebUserActions.waitForVisible('Policy Page Header', this.page.locator(locators.NewPolicyPage.editPolicyPageHeader));
        console.log('Navigated to New Policy page.');
    }

    async changeOpportunityStage(stage: string) {
        const underwritingStageLocator = await WebUserActions.getDynamicLocator(locators.OpportunityPage.opportunityChevronStages, stage);
        const currentStageLocator = await WebUserActions.getDynamicLocator(locators.OpportunityPage.opportunityCurrentStage, stage);

        const currentStage = this.page.locator(currentStageLocator);
        const isCurrentStageVisible = await currentStage.isVisible();

        if (isCurrentStageVisible) {
            Logger.info(`Stage "${stage}" is already the current stage. No action needed.`);
        } else {
            Logger.info(`Stage "${stage}" is not current. Updating stage...`);
            await WebUserActions.clickOnElement("Stage", this.page.locator(underwritingStageLocator));
            await WebUserActions.clickOnElement("Mark As Current State Button", this.page.locator(locators.OpportunityPage.markAsCurrentStateButton));
            await WebUserActions.waitForVisible("Current Stage", currentStage);
            Logger.info(`Stage "${stage}" has been successfully marked as current.`);
        }
    }

}
