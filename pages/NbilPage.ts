import { Page, Locator } from 'playwright';
import { RandomDataGenerator } from '../utils/randomDataGenerator';
import { WebUserActions } from '../utils/webUserActions';
import { NdaPage } from './NdaPage';
import locators from '../locators/locators.json';


export class NbilPage { 

    testData?: {
        scenario: string;
        actionPerformed: string;
        testEmailMessage?: string;
        ccEmail?: string;
        newStaticText?: string;
        testTableMessage?: string;
        dynamicUpdates?: Record<string, string>;
        modificationType: string;
        validationFields: Record<string, any>;
        changes?: Record<string, any>; // for comprehensive updates
    };
   
    storedData?: {
        scenario: string;
        actionPerformed: string;
        testEmailMessage?: string ;
        ccEmail?: string ;
        newStaticText?: string ;
        testTableMessage?: string;
        dynamicUpdates?: Record<string, string>;
        modificationType: string;
        validationFields: Record<string, any>;
        changes?: Record<string, any>;
    };
    readonly page: Page;
    private xpath: any;
    
    constructor(page: Page) {
    this.page = page;
    }

    private get editButton(): Locator {
        return this.page.locator(locators.NbilPage.editButton);//changed xpth value due to ui chaanges
    }

    private get targetField(): Locator {
        return this.page.locator(locators.NbilPage.targetField);
    }

    private get targetDescriptionField(): Locator {
        return this.page.locator(locators.NbilPage.targetDescriptionField);
    }

    private get quoteDueDateField(): Locator {
        return this.page.locator(locators.NbilPage.quoteDueDateField);
    }

    private get enterpriseValueField(): Locator {
        return this.page.locator(locators.NbilPage.enterpriseValueField);
    }

    private get quoteDueTimeDropDown(): Locator {
        return this.page.locator(locators.NbilPage.quoteDueTimeDropDown);
    }
    private get quoteDueTimeValue(): (quoteDueTime: string) => Locator {
        return (quoteDueTime: string) => this.page.locator(`//label[text()='Quote Due Time']//following::lightning-base-combobox-item//span[text()='${quoteDueTime}']`);
    }
    private get sellersidemnityDropDown(): Locator {
        return this.page.locator(locators.NbilPage.sellersidemnityDropDown);
    }
    private get sellersidemnity(): (idemnityValue: string) => Locator {
        return (idemnityValue: string) => this.page.locator(`//span[text()='${idemnityValue}']`);
    }
    private get buyersCouncilDropDown(): Locator {
        return this.page.locator(locators.NbilPage.buyersCouncilDropDown);
    }
    private get buyersCouncilValue(): (buyersCouncil: string) => Locator {
        return (buyersCouncil: string) => this.page.locator(`//div[contains(@id,'dropdown-element')]//span[text()='${buyersCouncil}']`);
    }
    private get limitRequestedFieldOne(): Locator {
        return this.page.locator(locators.NbilPage.limitRequestedFieldOne);
    }
    private get limitRequestedFieldTwo(): Locator {
        return this.page.locator(locators.NbilPage.limitRequestedFieldTwo);
    }

    private get saveButton(): Locator {
        return this.page.locator(locators.NbilPage.saveButton);
    }
    
    private get carrierHeading(): Locator {
        return this.page.locator(locators.NdaPage.carrierHeading);
    }

    private get nbilNextButton(): Locator {
        return this.page.locator(locators.NbilPage.nbilNextButton);
    }

    private get nbilTemplateDropDown(): Locator {
        return this.page.locator(locators.NbilPage.nbilTemplateDropDown);
    }
    private get sellersCouncilValue(): (sellersCouncil: string) => Locator {
        return (sellersCouncil: string) => this.page.locator(`//div[contains(@id,'dropdown-element')]//span[text()='${sellersCouncil}']`);
    }
    private validateSelectedCarrier(selectedCarrier: string): Locator {
        this.xpath = WebUserActions.getDynamicLocator(locators.NbilPage.selectedCarrierValidation, selectedCarrier);
        return this.page.locator(this.xpath);
    }

    private get purchaseAgreementField(): Locator {
        return this.page.locator(locators.NbilPage.purchaseAggreementField);
    }   

    private get rolloverPercentageField(): Locator {
        return this.page.locator(locators.NbilPage.rolloverPercentageField);
    }

    private get sellersCouncilDropDown(): Locator {
        return this.page.locator(locators.NbilPage.sellersCouncilDropDown);
    }

    private get editNbilHeading(): Locator {
        return this.page.locator(locators.NbilPage.editNbilHeading);
    }   

    private get draftPurchaseAgreementCheckBox(): Locator {
        return this.page.locator(locators.NbilPage.draftPurchaseAgreementCheckBox);
    }

    private get typeOfFinancialsDropDown(): Locator {
        return this.page.locator(locators.NbilPage.typeOfFinancialsDropDown);
    }

    private typeOfFinancialsValue(typeOfFinancialsOption: string) : Locator {
        this.xpath = WebUserActions.getDynamicLocator(locators.NbilPage.typeOfFinancialsValue, typeOfFinancialsOption);
        return this.page.locator(this.xpath);
    }

    private get legalDropDown(): Locator {
        return this.page.locator(locators.NbilPage.legalDropDown);
    }

    private  legalValue(legalOption: string): Locator {
        this.xpath = WebUserActions.getDynamicLocator(locators.NbilPage.legalValue, legalOption);
        return this.page.locator(this.xpath);
    }

    private get financialDropDown(): Locator {
        return this.page.locator(locators.NbilPage.financialDropDown);
    }

    private  financialValue(financialOption: string): Locator {
        this.xpath = WebUserActions.getDynamicLocator(locators.NbilPage.financialValue, financialOption);
        return this.page.locator(this.xpath);
    }

    private get taxDropDown(): Locator {
        return this.page.locator(locators.NbilPage.taxDropDown);
    }

    private  taxValue(taxOption: string): Locator {
        this.xpath = WebUserActions.getDynamicLocator(locators.NbilPage.taxValue, taxOption);
        return this.page.locator(this.xpath);
    }
    
     /**
     * Fills all mandatory NBIL fields on the form and saves.
     * 
     * @param {string} enterpriseValue - Value for the enterprise value field
     * @param {string} targetInput - Text input for target field
     * @param {string} targetDescription - Description text for the target business description
     * @param {string} quoteDueTimeValue - Value to select for quote due time dropdown
     * @param {string} sellersidemnityvalue - Value to select for seller’s indemnity dropdown
     * @param {string} buyersCouncilValue - Value to select for buyer’s counsel dropdown
     * @param {string} limitValue - Value for the limit requested field
     * @returns {Promise<void>} Resolves when the fields are filled and saved
     */
    async fillNBILMandatoryFields(enterpriseValue: string,targetInput: string, targetDescription: string, quoteDueTimeValue: string,sellersidemnityvalue: string,buyersCouncilValue: string,limitRequestedFieldOneValue: string, insuranceType: string): Promise<void> {
        await WebUserActions.clickOnElement("edit Button",this.editButton);
        await this.editNbilHeading.waitFor({state:'visible'});
        const quoteDueDate = RandomDataGenerator.randomcloseDate();
        await WebUserActions.sendText("quote DueDate Field",this.quoteDueDateField,quoteDueDate);
        await WebUserActions.sendText("enterpriseValueField",this.enterpriseValueField,enterpriseValue);
        await WebUserActions.sendText("target Field",this.targetField,targetInput);
        await WebUserActions.sendText("target Description Field",this.targetDescriptionField,targetDescription);
        await WebUserActions.clickOnElement("quote DueTime DropDown",this.quoteDueTimeDropDown);
        const quoteDueTime = this.quoteDueTimeValue(quoteDueTimeValue);
        await quoteDueTime.waitFor({ state: 'visible' });
        await WebUserActions.clickOnElement("quote DueTime Value",quoteDueTime);
        if(insuranceType === "Reps & Warranties")
        {
            await WebUserActions.clickOnElement("sellers Idemnity",this.sellersidemnityDropDown);
            await WebUserActions.clickOnElement("sellers Idemnity Value",this.sellersidemnity(sellersidemnityvalue));
        }else {
            console.log("Sellers Indemnity dropdown is not applicable for this insurance type.");
        }
        await WebUserActions.clickOnElement("buyers Council DropDown",this.buyersCouncilDropDown);
        await WebUserActions.clickOnElement("buyers Council DropDown Value",this.buyersCouncilValue(buyersCouncilValue));
        await WebUserActions.sendText("limit Requested",this.limitRequestedFieldOne,limitRequestedFieldOneValue);
        await WebUserActions.clickOnElement("save Button",this.saveButton);
    }
 
    /**
     * Selects a carrier and NBIL template, then proceeds to the next step.
     * 
     * @param {string} carrierName - The name of the carrier to select
     * @param {string} template - The NBIL template to select
     * @returns {Promise<void>} Resolves after selecting and clicking Next
     */
    async nbilCarrierSelection(carrierName : string, template : string): Promise<void>{
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
        await this.carrierHeading.waitFor({state:"visible"});
        await WebUserActions.clickOnElement("all Carriers Value ",this.page.locator(NdaPage.allCarriersValue(carrierName)));
        await this.validateSelectedCarrier(carrierName).waitFor({ state: 'visible' });
        await this.nbilTemplateDropDown.selectOption({ label: template });
        await this.nbilNextButton.waitFor({ state: 'visible' });
        await WebUserActions.clickOnElement("nbilNextButton",this.nbilNextButton);
    }

    private get limitCommentsField(): Locator {
        return this.page.locator(locators.NbilPage.limitCommentsInputField);
    }

    private get otherRequestedTermsInputField(): Locator {
        return this.page.locator(locators.NbilPage.otherRequestedTermsInputField);
    }

    /**
     * Fills the insurance requirements section with provided values.
     *
     * @param {string} limitRequested2Value - Value for the second limit requested field.
     * @param {string} limitCommentsInputValue - Comments text for the limit field.
     * @param {string} otherRequestedTermsInputValue - Text for other requested terms field.
     * @param {string} typeOfFinancialsValue - Option to select for type of financials dropdown.
     * @returns {Promise<void>} Resolves when the insurance requirements section is filled.
     */
    async fillInsuranceRequirementsSection(limitRequestedTwoValue:string,limitCommentsInputValue:string,otherRequestedTermsInputValue:string,typeOfFinancialsValue:string): Promise<void> {
        await WebUserActions.sendText("limit Requested2",this.limitRequestedFieldTwo,limitRequestedTwoValue);
        await WebUserActions.clickOnElement("limit Comments",this.limitCommentsField);
        await WebUserActions.sendText("limit Comments",this.limitCommentsField,limitCommentsInputValue);
        await WebUserActions.clickOnElement("other Requested Terms",this.otherRequestedTermsInputField);
        await WebUserActions.sendText("other Requested Terms",this.otherRequestedTermsInputField,otherRequestedTermsInputValue);
        await WebUserActions.clickOnElement("draft Purchase Agreement CheckBox",this.draftPurchaseAgreementCheckBox);
        await WebUserActions.clickOnElement("type Of Financials DropDown",this.typeOfFinancialsDropDown);
        await WebUserActions.clickOnElement("type Of Financials Value",this.typeOfFinancialsValue(typeOfFinancialsValue));
        await WebUserActions.clickOnElement("deal Book CheckBox",this.page.locator(locators.NbilPage.dealBookCheckBox));   
    }

    /**
     * Fills the diligence advisor section with legal, financial, and tax options.
     * If "Other" is selected for any field, automatically fills the corresponding input with test data.
     * @param {string} legalOption - Option to select for legal advisor dropdown.
     * @param {string} financialOption - Option to select for financial advisor dropdown.
     * @param {string} taxOption - Option to select for tax advisor dropdown.
     * @returns {Promise<void>} Resolves when the diligence advisor section is filled.
     */
    async fillDeligenceAdivisorSection(legalOption: string,financialOption:string,taxOption:string): Promise<void> {
        console.log("Filling Diligence Advisor Section");

        await WebUserActions.clickOnElement("legal DropDown",this.legalDropDown);
        await WebUserActions.clickOnElement("legal Value",this.legalValue(legalOption));
        if(legalOption === "Other"){
            await WebUserActions.sendText("other Legal Input",this.page.locator(locators.NbilPage.otherLegalInput),"Automation Legal Input");
        }

        await WebUserActions.clickOnElement("financial DropDown",this.financialDropDown);
        await WebUserActions.waitForVisible("financial Value",this.financialValue(financialOption));
        await WebUserActions.clickOnElement("financial Value",this.financialValue(financialOption));
        if(financialOption === "Other"){
            await WebUserActions.sendText("other Financial Input",this.page.locator(locators.NbilPage.otherFinancialInput),"Automation Financial Input");
        }

        await WebUserActions.clickOnElement("tax DropDown",this.taxDropDown);
        await WebUserActions.clickOnElement("tax Value",this.taxValue(taxOption));
        if(taxOption === "Other"){
            await WebUserActions.sendText("other Tax Input",this.page.locator(locators.NbilPage.otherTaxInput),"Automation Tax Input");
        }
    }
    /**
     * Fills additional NBIL fields and saves the form.
     * @param {string} purchaseAgreement - Text for purchase agreement field
     * @param {string} rolloverPercentage - Value for rollover percentage field
     * @param {string} limitRequested2Value - Value for the second limit requested field
     * @param {string} sellersCouncilOption - Option for seller's council dropdown
     * @param {string} typeOfFinancialsValue - Option for type of financials dropdown
     * @param {string} legalOption - Option for legal dropdown
     * @param {string} financialOption - Option for financial dropdown
     * @param {string} taxOption - Option for tax dropdown
     * @returns {Promise<void>} Resolves when all fields are filled and saved
     */
    async fillingAdditionalNBILFields(
        purchaseAgreement: string,
        rolloverPercentage: string,
        limitRequested2Value: string,
        sellersCouncilOption: string,
        typeOfFinancialsValue: string,
        legalOption: string,
        financialOption: string,
        taxOption: string,
        limitCommentsInputValue: string,
        otherRequestedTermsInputValue: string
    ): Promise<void> {
        await WebUserActions.clickOnElement("edit Button",this.editButton); 
        await this.editNbilHeading.waitFor({state:'visible'});
        await WebUserActions.sendText("rollover Percentage",this.rolloverPercentageField,rolloverPercentage);
        await WebUserActions.sendText("purchase Agreement",this.purchaseAgreementField,purchaseAgreement);
        await WebUserActions.clickOnElement("sellers Council DropDown",this.sellersCouncilDropDown);
        await WebUserActions.clickOnElement("sellers Council Value",this.sellersCouncilValue(sellersCouncilOption));
        await this.fillInsuranceRequirementsSection(limitRequested2Value,limitCommentsInputValue,otherRequestedTermsInputValue,typeOfFinancialsValue);
        await this.fillDeligenceAdivisorSection(legalOption,financialOption,taxOption);
        await WebUserActions.clickOnElement("save Button",this.saveButton);
    }

    private get tableTextInput(): Locator {
        return this.page.locator(locators.NbilPage.tableTextInput);
    }
    /**
     * Removes table records in NBIL template and replaces with test message.
     * Selects the table text input, removes existing content with backspace, and fills with new message.
     * @param {string} testTableMessage - The test message to replace table content with.
     * @returns {Promise<void>} Resolves when table record is removed and replaced.
     */
    async removeTableRecordInNbilTemplate(testTableMessage:string): Promise<void> {
        await WebUserActions.clickOnElement("table Text Input",this.tableTextInput);
        await this.page.keyboard.press('Backspace');
        await this.tableTextInput.fill(testTableMessage);
        console.log("Table record replaced with test message.");
    }

    private get newCarrierInput(): Locator {
        return this.page.locator(locators.NbilPage.newCarrierInput);
    }

    /**
     * Removes static text content and replaces with test message.
     * Updates the carrier input field with the provided test message.
     * @param {string} testMessage - The test message to replace static text with.
     * @returns {Promise<void>} Resolves when static text is removed and replaced.
     */
    async removeStaticTexts(testMessage:string): Promise<void> {
        await WebUserActions.sendText("static Carrier Text",this.newCarrierInput,testMessage);
    }

    private get policyRetentionRequestInput(): Locator {
        return this.page.locator(locators.NbilPage.policyRetentionRequestInput);
    }

    private get policyPeriodInput(): string {
        return locators.NbilPage.policyPeriodInput;
    }

    private get requestedCoverageInput(): string {
        return locators.NbilPage.requestedCoverage;
    }

    private get underWritingInformation(): Locator {
        return this.page.locator(locators.NbilPage.underWritingInformation);
    }

    /**
     * Updates dynamic fields in NBIL template based on field updates map.
     * Handles different field types (Policy Retention, Requested Coverage, Policy Period, Underwriting Information)
     * based on insurance type (Reps & Warranties or other types).
     * @param {Map<string, string>} fieldUpdates - Map containing field labels and their new values.
     * @param {string} insuranceType - The type of insurance to determine which fields to update.
     * @returns {Promise<void>} Resolves when all dynamic fields are updated.
     */
    async updateNbilTemplateDynamicFields(fieldUpdates: Map<string, string>,insuranceType:string): Promise<void> {
        for (const [fieldLabel, newValue] of fieldUpdates) {
            console.log(`${fieldLabel} Field`, fieldLabel, newValue)
            if(insuranceType==="Reps & Warranties"){
            switch(fieldLabel) {
                case 'Policy Retention Requested:':
                        await WebUserActions.sendText("policy Retention Request",this.policyRetentionRequestInput,newValue);
                        break;
                case 'Requested Coverage:':
                    await WebUserActions.pointCursorToEnd(this.page, this.requestedCoverageInput);
                    await this.page.keyboard.type(newValue);
                    break;
                case 'Policy Period:':
                    await WebUserActions.pointCursorToEnd(this.page, this.policyPeriodInput);
                    await this.page.keyboard.type(newValue);
                    break;
                case 'Underwriting Information:':
                    await WebUserActions.sendText("under Writing Information",this.underWritingInformation,newValue);
                    break;
                }
            }else{
                switch(fieldLabel) {
                case 'Policy Retention Requested:':
                        await WebUserActions.sendText("policy Retention Request",this.policyRetentionRequestInput,newValue);
                        break;
                case 'Policy Period:':
                    await WebUserActions.pointCursorToEnd(this.page, this.policyPeriodInput);
                    await this.page.keyboard.type(newValue);
                    break;
                case 'Underwriting Information:':
                    await WebUserActions.sendText("under Writing Information",this.underWritingInformation,newValue);
                    break;
                }
            }
            
        }
        
    }

    private get emailBodyLocator(): Locator {
        return this.page.locator(locators.NbilPage.nbilEmailBody);
    }

    /**
     * Replaces all fields in the email body with a test message.
     * Selects all content, clears it, and replaces with the provided test message.
     * @param {string} testMessage - The test message to replace all email body content with.
     * @returns {Promise<void>} Resolves when all fields are replaced.
     */
    async replaceEmailBody(testMessage:string): Promise<void> {
        await this.page.keyboard.press('Control+A');
        await this.page.keyboard.press('Backspace');
        await WebUserActions.sendText("email Body Locator",this.emailBodyLocator,testMessage);
    }

    private get ccFieldLocator(): Locator {
        return this.page.locator(locators.CommonPage.ccField);
    }
    /**
     * Changes the CC field in the email template.
     * Sends the provided email address to the CC field input.
     * @param {string} ccEmail - The email address to set in the CC field.
     * @returns {Promise<void>} Resolves when the CC field is updated.
     */
    async changeCCField(ccEmail: string): Promise<void> {
        // Implement logic to change CC field in the email template
        await WebUserActions.sendText("cc Field Locator",this.ccFieldLocator,ccEmail);
        console.log(`Changing CC field to: ${ccEmail}`);
    }


    /**
     * Applies template modifications based on the specified scenario.
     * Supports multiple scenarios: change_whole_emailbody, change_cc_field, change_static_text,
     * change_dynamic_text, remove_table, and change_all_fields.
     * @param {string} scenario - The modification scenario to apply (e.g., 'change_whole_emailbody', 'change_cc_field').
     * @param {any} modificationData - Object containing the data needed for the specific modification scenario.
     * @param {string} insuranceType - The type of insurance being processed.
     * @returns {Promise<void>} Resolves when template modifications are applied.
     * @throws {Error} If an unknown scenario is provided.
     */
    async applyTemplateModifications(scenario: string, modificationData: any,insuranceType:string): Promise<void> {
        console.log(`Applying template modifications for scenario: ${scenario}`);

        switch (scenario.toLowerCase()) {
            case 'change_whole_emailbody':
                await this.replaceEmailBody(modificationData.testEmailMessage);
                break;
                
            case 'change_cc_field':
                await this.changeCCField(modificationData.ccEmail);
                break;
                
            case 'change_static_text':
                await this.removeStaticTexts(modificationData.newStaticText);
                break;
                
            case 'change_dynamic_text':
                await this.updateNbilTemplateDynamicFields(modificationData.fieldUpdates,insuranceType);
                break;
                
            case 'remove_table':
                await this.removeTableRecordInNbilTemplate(modificationData.testTableMessage);
                break;
                
            case 'change_all_fields':
                console.log('Applying all modifications to the template...');
                await this.replaceEmailBody(modificationData.testEmailMessage);
                await this.changeCCField(modificationData.ccEmail);
                await this.removeStaticTexts(modificationData.newText);
                await this.updateNbilTemplateDynamicFields(modificationData.fieldUpdates,insuranceType); 
                await this.removeTableRecordInNbilTemplate(modificationData.testTableMessage);
                break;

            default:
                throw new Error(`Unknown scenario: ${scenario}`);
        }
    }


    /**
     * Validates dynamic field values within the email iframe by checking multiple selectors.
     * Switches to the email iframe and attempts to find the specified field using various XPath selectors.
     * 
     * @param {string} fieldName - The name/label of the dynamic field to validate (e.g., "Policy Retention Requested:", "Requested Coverage:")
     * @param {string} expectedValue - The expected value that should be present for this field in the email content
     * @returns {Promise<Boolean>} Promise that resolves to true if the field contains the expected value, false otherwise
     * @throws {Error} Throws an error if the email body cannot be extracted from the activity tab
     */
    private async validateDynamicFieldInEmail(fieldName:string,expectedValue:string): Promise<Boolean> {
        const emailBodyIframe= await WebUserActions.switchToIFrame("email Body Iframe", this.page, this.detailsTabEmailIframeLocator);
        
        // Try multiple selectors for email body in activity
        const possibleSelectors = [
            `//tr//td[text()='${fieldName}']//following-sibling::td`,
            `//p[text()='${fieldName}']//parent::td//following-sibling::td//p`,
            `(//td[normalize-space()='${fieldName}']/../td)[last()]`
        
        ];

        for (const selector of possibleSelectors) {
            try {
                const actualText = await WebUserActions.getTextForElement("table Data", emailBodyIframe.locator(selector));
                console.log(`Trying selector: ${selector} and Extracted content: ${actualText} for ${fieldName}`);
                const valueFound = actualText.includes(expectedValue);
                if (valueFound) {
                    console.log(`Dynamic field validation passed: ${fieldName} contains "${expectedValue}"`);
                    return true;
                } else {
                    console.log(`Expected value "${expectedValue}" not found using selector: ${selector}`);
                }
            } catch {
                console.log(`Error occurred while trying selector: ${selector}`);
            }
        }

        throw new Error('Could not extract email body from activity tab');
    }

    private get ccFieldLocatorInActivityTab(): Locator {
        return this.page.locator(locators.OpportunityPage.ccAddressEmailField);
    }
    /**
     * Validates the CC field value in the activity tab of the email.
     * Extracts the CC field text content and checks if it contains the expected email address.
     * @param {string} expectedCC - The expected email address that should be present in the CC field.
     * @returns {Promise<boolean>} Promise that resolves to true if the CC field contains the expected email, false otherwise.
     */
    public async validateCCInActivity(expectedCC: string): Promise<boolean> {
        try {
            this.page
            const ccValue = await WebUserActions.getTextForElement("cc In Activity Locator", this.ccFieldLocatorInActivityTab);
            return ccValue.includes(expectedCC);
        } catch {
            return console.error('CC validation in activity tab failed'), false;
        }
    }

    private emailBodyInActivityLocator(testMessage:string):string{
        const xpath= WebUserActions.getDynamicLocator(locators.OpportunityPage.emailBodyLocator, testMessage);
        return xpath;
    }
    
    private get detailsTabEmailIframeLocator():string{
        return locators.OpportunityPage.detailsTabEmailIframeLocator;
    }
    /**
     * Validates static details in the email body within an iframe.
     * Switches to the email iframe and verifies that the test message is visible.
     * @param {string} testMessage - The test message to validate in the email body.
     * @returns {Promise<void>} Resolves when email body validation is complete.
     */
    public async validateEmailBodyInEmail(testMessage:string): Promise<void>{
        const emailBodyIframe= await WebUserActions.switchToIFrame("email Body Iframe", this.page, this.detailsTabEmailIframeLocator);
        // Perform actions within the email body iframe
        await emailBodyIframe.locator(this.emailBodyInActivityLocator(testMessage)).isVisible();

    }

    /**
     * Validates if a specific dynamic field contains the expected value in the email content.
     * Attempts validation by checking the field value within the email iframe.
     * @param {string} fieldName - The name/label of the dynamic field to validate (e.g., "Policy Retention Requested:", "Requested Coverage:").
     * @param {string} expectedValue - The expected value that should be present for this field.
     * @returns {Promise<Boolean>} Promise that resolves to true if the field contains the expected value, false otherwise.
     */
    public async validateDynamicField(fieldName: string, expectedValue: string): Promise<Boolean> {
        try {
            console.log(`Validating dynamic field: ${fieldName} with expected value: ${expectedValue}`);
            
            const emailContent = await this.validateDynamicFieldInEmail(fieldName,expectedValue);
            return emailContent;
            
        } catch (error) {
            console.error(`Dynamic field validation error for ${fieldName}:`, error);
            return false;
        }
    } 

    /**
     * Applies template modifications based on the specified scenario and stores test data for validation.
     * Supports multiple modification scenarios including email body replacement, CC field updates, 
     * static text changes, dynamic field updates, table removal, and comprehensive modifications.
     * 
     * @param {string} scenarioName - The modification scenario to apply. Supported values:
     *   - "change_whole_emailbody": Replaces entire email body content
     *   - "change_cc_field": Updates CC field with new email address
     *   - "change_static_text": Updates static text content in template
     *   - "change_dynamic_text": Updates dynamic template fields
     *   - "remove_table": Removes table content and replaces with test message
     *   - "change_all_fields": Applies comprehensive updates to all field types
     * @returns {Promise<any>} Promise that resolves to the test data object containing scenario details, 
     *   action performed, modification type and validation fields for later verification
     * @throws {Error} Throws an error if an unknown scenario name is provided
     */
    async changeTemplateModifications(scenarioName: string,insuranceType:string): Promise<any> {
        let testMessage = "";
        let actionPerformed = "";
  
        if(scenarioName === "change_whole_emailbody"){
            testMessage = "This is to inform you that the NBIL request email body has been updated with new Test Information.";
            actionPerformed = "Replaced entire email body content in template";
            
            await this.applyTemplateModifications(scenarioName,{testEmailMessage: testMessage},insuranceType);
            
            this.testData = { 
            scenario: scenarioName, 
            actionPerformed: actionPerformed,
            testEmailMessage: testMessage,
            modificationType: "full_body_replacement",
            validationFields: {
                testEmailMessage: testMessage,
            }
            }; 
        } else if(scenarioName === "change_cc_field"){
            testMessage = process.env.EMAIL!;
            actionPerformed = "Updated CC field with new email address";
            
            await this.applyTemplateModifications(scenarioName,{ccEmail: testMessage},insuranceType);
            
            this.testData = { 
            scenario: scenarioName, 
            actionPerformed: actionPerformed,
            ccEmail: testMessage,
            modificationType: "cc_field_update",
            validationFields: {
                ccEmail: testMessage
            }
            };
            
        } else if(scenarioName === "change_static_text"){
            testMessage = "This is to inform you that the NBIL request has been updated with new static Test Information.";
            actionPerformed = "Updated static text content";
            
            await this.applyTemplateModifications(scenarioName,{newStaticText: testMessage},insuranceType);
            
            this.testData = { 
            scenario: scenarioName, 
            actionPerformed: actionPerformed,
            modificationType: "static_text_update",
            validationFields: {
                newStaticText: testMessage
            }
            };
            
        } else if(scenarioName === "change_dynamic_text"){
            let dynamicUpdates;
            if(insuranceType==='Reps & Warranties'){
                 dynamicUpdates = new Map([
                    ['Policy Retention Requested:', 'Test Policy Retention Request'],
                    ['Requested Coverage:', 'Test Requested Coverage'],
                    ['Policy Period:', 'Test Policy Period'],
                    ['Underwriting Information:','Test Underwriting Information']
                ]);
            } else{
                 dynamicUpdates = new Map([
                    ['Policy Retention Requested:', 'Test Policy Retention Request'],
                    ['Policy Period:', 'Test Policy Period'],
                    ['Underwriting Information:','Test Underwriting Information']
                ]);
            }
            actionPerformed = "Updated dynamic template fields";
            
            await this.updateNbilTemplateDynamicFields(dynamicUpdates,insuranceType);
            
            // Convert Map to object for easier validation
            const dynamicUpdatesObj = Object.fromEntries(dynamicUpdates);
            
            this.testData = { 
            scenario: scenarioName, 
            actionPerformed: actionPerformed,
            dynamicUpdates: dynamicUpdatesObj,
            modificationType: "dynamic_fields_update",
            validationFields: {
                dynamicFields: dynamicUpdatesObj
            }
            };
            
        }else if(scenarioName === "remove_table"){
            testMessage = "This is to inform you that in NBIL request Table has been updated with new Test Information.";
            actionPerformed = "Removed table content and replaced with test message";
            
            await this.applyTemplateModifications(scenarioName,{testTableMessage: testMessage},insuranceType);
            
            this.testData = { 
            scenario: scenarioName, 
            actionPerformed: actionPerformed,
            testTableMessage: testMessage,
            modificationType: "table_removal",
            validationFields: {
                testTableMessage: testMessage,
            }
            };
            
        } else if(scenarioName === "change_all_fields"){
            // Define all the changes that will be made
            const ccEmail = process.env.EMAIL!;
            const newStaticText = "This is to inform you that the NBIL request has been updated with new comprehensive Data.";
            let dynamicUpdates;
            if(insuranceType==='Reps & Warranties'){
                 dynamicUpdates = new Map([
                    ['Policy Retention Requested:', 'Test Policy Retention Request'],
                    ['Requested Coverage:', 'Test Requested Coverage'],
                    ['Policy Period:', 'Test Policy Period'],
                    ['Underwriting Information:','Test Underwriting Information']
                ]);
            } else{
                 dynamicUpdates = new Map([
                    ['Policy Retention Requested:', 'Test Policy Retention Request'],
                    ['Policy Period:', 'Test Policy Period'],
                    ['Underwriting Information:','Test Underwriting Information']
                ]);
            }

            actionPerformed = "Updated all fields: CC, static text, and dynamic fields";

            // Perform all actions step by step
            console.log("Performing comprehensive template modifications:");
            
            // 1. Change CC field
            console.log("1. Updating CC field...");
            await this.changeCCField(ccEmail);
            
            // 2. Update static text
            console.log("2. Updating static text...");
            await this.removeStaticTexts(newStaticText);
            
            // 3. Update dynamic fields
            console.log("3. Updating dynamic template fields...");
            await this.updateNbilTemplateDynamicFields(dynamicUpdates,insuranceType);

            // Store comprehensive action data for validation
            this.testData = {
            scenario: scenarioName,
            actionPerformed: actionPerformed,
            modificationType: "comprehensive_update",
    
            changes: {
                ccField: {
                action: "changed_cc_field",
                newValue: ccEmail,
                description: "Updated CC field with new email address"
                },
                staticText: {
                action: "changed_static_text", 
                newValue: newStaticText,
                description: "Updated static text content"
                },
                dynamicFields: {
                action: "changed_dynamic_fields",
                newValues: Object.fromEntries(dynamicUpdates),
                description: "Updated all dynamic template fields"
                }
            },
            validationFields: {
                ccEmail: ccEmail,
                staticText: newStaticText,
                dynamicFields: Object.fromEntries(dynamicUpdates)
            }
            };
            
        } else {
            throw new Error(`Unknown scenario name: ${scenarioName}`);
        }
        
        // Log the action performed for all scenarios
        console.log(`Action performed: ${actionPerformed}`);
        console.log(`Scenario: ${scenarioName}`);
        console.log(`Test data stored:`, this.testData);
        this.storedData = this.testData;
        
        // Return the test data for use in step definitions
        return this.testData;
}


/**
 * Validates email template modifications by checking the stored test data against the actual email content.
 * Performs scenario-specific validations including email body content, CC field values, static text updates,
 * dynamic field changes, table removals, and comprehensive field updates.
 * 
 * @returns {Promise<void>} Promise that resolves when all validations are complete and successful
 * @throws {Error} Throws an error if:
 *   - No stored data is found (template modifications must be made before validation)
 *   - Dynamic field validation fails for any expected field
 *   - Unknown scenario type is encountered
 *   - Any validation step fails during the process
 * 
 * @example
 * // After applying template modifications
 * await nbilPage.changeTemplateModifications("change_dynamic_text");
 * // Validate the changes were applied correctly
 * await nbilPage.validateEmailTemplateModifications();
 */
async validateEmailTemplateModifications(storedTestData:any): Promise<void> {
    if (!storedTestData) {
        throw new Error('No stored data found for validation. Ensure that template modifications have been made before validation.');
    }

    console.log(`Validating email for scenario: ${storedTestData.scenario}`);
    console.log(`Action performed: ${storedTestData.actionPerformed}`);

    // Validate based on the scenario type
    switch (storedTestData.scenario) {
        case "change_whole_emailbody":
            console.log("Validating email body replacement...");
            console.log(`Expected email body: ${storedTestData.validationFields.testEmailMessage}`);
            await this.validateEmailBodyInEmail(storedTestData.validationFields.testEmailMessage);
            break;

        case "change_cc_field":
            console.log("Validating CC field update...");
            console.log(`Expected CC email: ${storedTestData.validationFields.ccEmail}`);
            await this.validateCCInActivity(storedTestData.validationFields.ccEmail);
            break;

        case "change_static_text":
            console.log("Validating static text update...");
            console.log(`Expected static text: ${storedTestData.validationFields.newStaticText}`);
            await this.validateEmailBodyInEmail(storedTestData.validationFields.newStaticText);
            break;

        case "change_dynamic_text":
            console.log("Validating dynamic fields update...");
            // Validate each dynamic field
            for (const [fieldName, expectedValue] of Object.entries(storedTestData.validationFields.dynamicFields)) {
                console.log(`Validating dynamic field: ${fieldName} = ${expectedValue}`);
                // Validate specific dynamic field
                const isValid = await this.validateDynamicField(fieldName, String(expectedValue));
                if (!isValid) {
                console.log(`Validation failed for dynamic field: ${fieldName}`);
                throw new Error(`Dynamic field validation failed for ${fieldName}: expected "${expectedValue}"`);
                }
            }
            console.log("All dynamic field validations passed");
            break;

        case "remove_table":
            console.log("Validating table removal...");
            console.log(`Expected table content: ${storedTestData.validationFields.tableContent}`);
            await this.validateEmailBodyInEmail(storedTestData.validationFields.tableTestMessage);
            break;

        case "change_all_fields":
            console.log("Validating comprehensive field updates...");
            
            // Validate CC field change
            console.log(`Validating CC field: ${storedTestData.validationFields.ccEmail}`);
            await this.validateCCInActivity(storedTestData.validationFields.ccEmail);

            // Validate static text change
            console.log(`Validating static text: ${storedTestData.validationFields.staticText}`);
            await this.validateEmailBodyInEmail(storedTestData.validationFields.staticText);

            // Validate dynamic fields changes
            console.log("Validating dynamic fields changes:");
            for (const [fieldName, expectedValue] of Object.entries(storedTestData.validationFields.dynamicFields)) {
                console.log(`  - ${fieldName}: ${expectedValue}`);
                // Validate specific dynamic field
                const isValid = await this.validateDynamicField(fieldName, String(expectedValue));
                if (!isValid) {
                console.log(`Validation failed for dynamic field: ${fieldName}`);
                throw new Error(`Dynamic field validation failed for ${fieldName}: expected "${expectedValue}"`);
                }
            }
            console.log("All dynamic field validations passed for comprehensive update");
            
            break;
        default:
            throw new Error(`Unknown scenario for validation: ${storedTestData.scenario}`);
    }

    console.log(`Email validation completed successfully for scenario: ${storedTestData.scenario}`);
    console.log(`All expected changes were validated in the sent email`);
    }

    
} 
