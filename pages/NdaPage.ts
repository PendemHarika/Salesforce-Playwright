import { Page, Locator } from 'playwright';
import { WebUserActions } from '../utils/webUserActions';
import { Logger } from '../utils/logger';
import locators from '../locators/locators.json';   
import { CommonPage } from './CommonPage';


export class NdaPage {

    readonly page: Page;
    private commonPage: CommonPage;
    constructor(page: Page) {
    this.page = page;
    this.commonPage = new CommonPage(page);
    }

    private get stageValue(): Locator {
        return this.page.locator(locators.NdaPage.stageValue);
    }

    private get carrierHeading() : Locator {
        return this.page.locator(locators.NdaPage.carrierHeading);
    }

    private get ndaTemplateHeading(): Locator {
        return this.page.locator(locators.NdaPage.ndaTemplateHeading);
    }

    private get ndaNextButton(): Locator {
        return this.page.locator(locators.NdaPage.ndaNextButton);
    }

    /**
     * Validates that the intake stage value is visible on the page.
     * Waits for the stage value element to be visible before proceeding.
     * @returns {Promise<void>} Resolves when the stage value is visible.
     */
    async validateIntakeStage(){
        await this.stageValue.waitFor({ state: 'visible' });
    }

    static get allCarriersValue(): (insuranceType: string) => string {
        return (insuranceType: string) => `//div//option[text() ='${insuranceType}']`;
    }

    /**
     * Selects an NDA carrier and proceeds to the template selection screen.
     * Waits for carrier heading, clicks the carrier option, and then clicks next.
     * @param {string} carrierValue - The carrier name to select from the dropdown.
     * @returns {Promise<void>} Resolves when carrier selection and next button click are complete.
     */
    async ndaCarrierSelection(carrierValue : string){
        await this.carrierHeading.waitFor({ state: 'visible' });
        await WebUserActions.clickOnElement("all Carriers Value ",this.page.locator(NdaPage.allCarriersValue(carrierValue)));
        await this.ndaTemplateHeading.waitFor({ state: 'visible' });
        await WebUserActions.clickOnElement("ndaNextButton",this.ndaNextButton);
    }

    private get ccField(): Locator {
        return this.page.locator(locators.CommonPage.ccField);
    }

    private get fileUploadDoneButton(): Locator {
        return this.page.locator(locators.CommonPage.fileUploadDoneButton);
    }

    //this is in string because it has 2 different uses so better to keep it as string
    private get emailPreviewText(): Locator {
        return this.page.locator(locators.NdaPage.emailPreviewText);
    }
    private get ndaNBILSendButton(): Locator {
        return this.page.locator(locators.NdaPage.ndaNBILSendButton);
    }
    private get ndanbilSuccessMessage(): (requestValue: string) => Locator {
        return (requestValue: string) => this.page.locator(`//p/strong[text() = '${requestValue} Request Sent Successfully.']`);
    }
    private get successWindowCloseButton(): Locator {
        return this.page.locator(locators.NdaPage.successWindowCloseButton);
    }

    private get fileUploadButton(): Locator {
        return this.page.locator(locators.CommonPage.fileUploadButton);
    }


   /**
     * Uploads a PDF file from the local resources fol
     * 
     * 
     * der.
     * 
     * @param {string} fileName - Name of the PDF file inside the resources folder to upload.
     * @returns {Promise<void>} Resolves after the file is uploaded.
     */
    async uploadPdfFromResources(fileName: string ) {
        const fileInput = await this.fileUploadButton.first();
        const filePath = require('path').resolve(__dirname, '../resources/', fileName);
        await fileInput.setInputFiles(filePath);
        await this.page.waitForTimeout(5000);
        // await this.page.waitForLoadState("domcontentloaded"); // Wait for upload to complete (adjust as needed)
    }

    // private get uploadedFileValidation(): string {
    //     return WebUserActions.getDynamicLocator(locators.NdaPage.uploadedFile,'propertyLoss.jpg');
    // }

    /**
     * Uploads a file and marks it as complete.
     * Waits for the upload process to complete and clicks the done button.
     * @param {string} fileName - Name of the file inside the resources folder to upload.
     * @returns {Promise<void>} Resolves when file is uploaded and done button is clicked.
     */
    async uploadFile(fileName:string){
        await this.uploadPdfFromResources(fileName);
        await this.page.waitForTimeout(5000);
        await this.fileUploadDoneButton.waitFor({ state: "visible" });
        await WebUserActions.waitForVisible("done Button", this.fileUploadDoneButton);
        await WebUserActions.clickOnElement("done Button", this.fileUploadDoneButton);
    }

    /**
     * Clicks the email Send button in the NDA/NBIL email dialog.
     * 
     * @returns {Promise<void>} Resolves after clicking the send button.
     */
    async emailSendButton(){
        await WebUserActions.clickOnElement("send Button", this.ndaNBILSendButton);
    }

    private get nbilsubjectField():Locator{
            return this.page.locator(locators.NbilPage.nbilSubjectField);
    }

    private get ndasubjectField():Locator{
            return this.page.locator(locators.NdaPage.ndaSubjectField);
    }

    /**
     * Validates that the NDA email subject field contains the opportunity name.
     * Checks the subject field for the presence of opportunity name and throws error if not found.
     * @param {string} opportunityName - The opportunity name that should be present in the subject.
     * @returns {Promise<void>} Resolves when subject field is validated successfully.
     * @throws {Error} If opportunity name is not found in subject field.
     */
    async validateNdaEmailSubjectField(opportunityName:string){
        const subjectText= await this.ndasubjectField.inputValue();
        console.log("Subject Field text is: " + subjectText);
        if(subjectText.includes(opportunityName)){
            await this.ndasubjectField.waitFor({ state: "visible" });
            Logger.info("Subject field is validated successfully with opportunity name.");
        } else {
            throw new Error("Subject field validation failed. Opportunity name not found in subject.");
        }
    }

    /**
     * Validates that the NBIL email subject field contains the opportunity name.
     * Checks the subject field for the presence of opportunity name and throws error if not found.
     * @param {string} opportunityName - The opportunity name that should be present in the subject.
     * @returns {Promise<void>} Resolves when subject field is validated successfully.
     * @throws {Error} If opportunity name is not found in subject field.
     */
    async validateNBILEmailSubjectField(opportunityName:string){
        const subjectText= await this.nbilsubjectField.inputValue();
        console.log("Subject Field text is: " + subjectText);
        if(subjectText.includes(opportunityName)){
            await this.nbilsubjectField.waitFor({ state: "visible" });
            Logger.info("Subject field is validated successfully with opportunity name.");
        } else {
            throw new Error("Subject field validation failed. Opportunity name not found in subject.");
        }
    }
    /**
     * Sends NDA email with specified text content.
     * Fills CC field, uploads the attachment, adds email body text, and clicks send.
     * 
     * @param {string} textValue - The text to append in the email body.
     * @returns {Promise<void>} Resolves after sending the email.
     */
    async sendNDAEmail(textValue :string,emailID : string, opportunityName: string, fileNames?: string[]){
        await WebUserActions.sendText("email Id", this.ccField, emailID);
        await this.validateNdaEmailSubjectField(opportunityName);
        const files = fileNames && fileNames.length ? fileNames : ['doc1.docx', 'doc2.docx', 'doc3.docx'];

        await this.commonPage.uploadInitialFilesAndVerify(files);

        await this.commonPage.navigatePreviousNextAndValidateReset(files);

        await WebUserActions.sendText("email Id", this.ccField, emailID);

        // Re-upload all files after navigation reset
        await this.commonPage.uploadInitialFilesAndVerify(files);

        // Check duplicate upload
        if (files.length > 0) {
            await this.commonPage.duplicateFileUploadCheck(files[0]);
        }

        // Delete one file and validate
        if (files.length > 1) {
            await this.commonPage.deleteFileAndValidate(files[1]);
        }

        await WebUserActions.clickOnElement("preview Text", this.emailPreviewText);
        await WebUserActions.pointCursorToEnd(this.page, "//p[text()='CarrierName Team,']//following-sibling::p[1]");
        await this.page.keyboard.type(textValue);
    }

    /**
     * Sends NBIL email with specified text content.
     * Fills CC field, uploads the attachment, adds email body text, and clicks send.
     * 
     * @param {string} textValue - The text to append in the email body.
     * @returns {Promise<void>} Resolves after sending the email.
     */
    async sendNBILEmail(textValue :string,emailID : string, opportunityName: string, fileNames?: string[]){
        await WebUserActions.sendText("email Id", this.ccField, emailID);
        await this.validateNBILEmailSubjectField(opportunityName);
        const files = fileNames && fileNames.length ? fileNames : ['doc1.docx', 'doc2.docx', 'doc3.docx'];

        await this.commonPage.uploadInitialFilesAndVerify(files);

        await this.commonPage.navigatePreviousNextAndValidateReset(files);

        await WebUserActions.sendText("email Id", this.ccField, emailID);

        // Re-upload all files after navigation reset
        await this.commonPage.uploadInitialFilesAndVerify(files);

        // Check duplicate upload for the first file in the set
        if (files.length > 0) {
            await this.commonPage.duplicateFileUploadCheck(files[0]);
        }

        // Delete one file (second file if present) and validate
        if (files.length > 1) {
            await this.commonPage.deleteFileAndValidate(files[1]);
        }

        await WebUserActions.clickOnElement("preview Text", this.emailPreviewText);
        await WebUserActions.pointCursorToEnd(this.page, "//p[text()='CarrierName Team,']//following-sibling::p[1]");
        await this.page.keyboard.type(textValue);
    }

    /**
     * Validates the success message after sending NDA or NBIL request.
     * Waits for the success message to become visible.
     * 
     * @param {string} requestValue - The type of request to verify success message for.
     * @returns {Promise<void>} Resolves when the success message is visible.
     */
    async validateNDANBILSuccessMessage(requestValue: string){
        await this.ndanbilSuccessMessage(requestValue).waitFor({ state: "visible" });
    }


    /**
     * Closes the success window dialog.
     * 
     * @returns {Promise<void>} Resolves after clicking the close button on success window.
     */
    async closeSuccessWindow(){
        await WebUserActions.clickOnElement("successWindow Close Button", this.successWindowCloseButton);
        await this.page.reload({ waitUntil: 'domcontentloaded' });
    }
}