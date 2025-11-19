import { Locator, Page } from 'playwright';
import { WebUserActions } from '../utils/webUserActions';
import { RandomDataGenerator } from '../utils/randomDataGenerator';
import locators from '../locators/locators.json';
import { HomePage } from './HomePage';
import test from 'node:test';


export class CommonPage {

    private readonly page: Page;
    constructor(page: Page) {
    this.page = page;
    }

    private get fileUploadButton(): Locator {
        return this.page.locator(locators.CommonPage.fileUploadButton);
    }

    private get fileUploadDoneButton(): Locator {
        return this.page.locator(locators.CommonPage.fileUploadDoneButton);
    }

    private get ccField(): Locator {
        return this.page.locator(locators.CommonPage.ccField);
    }

    async uploadInitialFilesAndVerify(files: string[]) {
        console.log('Uploading initial set of files...');
        await this.uploadMultipleFiles(files);
        await this.verifyFilesUploaded(files);
        console.log('Initial upload successful.');
    }

    async uploadMultipleFiles(fileNames: string[]) {
        for (const file of fileNames) {
        await this.uploadFile(file);
        }
    }

    async uploadFile(fileName = 'doc1.docx') {
        await this.uploadPdfFromResources(fileName);
        await WebUserActions.waitForVisible('Done Button', this.fileUploadDoneButton);
        await this.page.waitForTimeout(3000);
        await WebUserActions.clickOnElement('Done Button', this.fileUploadDoneButton);
        console.log(`Uploaded file: ${fileName}`);
    }

    async uploadPdfFromResources(fileName: string ) {
        const fileInput = await this.fileUploadButton.first();
        const filePath = require('path').resolve(__dirname, '../resources/', fileName);
        await fileInput.setInputFiles(filePath);
        await this.page.waitForTimeout(2000);
    }

    async verifyFilesUploaded(fileNames: string[]) {
        for (const file of fileNames) {
        const fileLocator = WebUserActions.getDynamicLocator(locators.CommonPage.uploadedFileName, file);
        await WebUserActions.waitForVisible("Uploaded File Name", this.page.locator(fileLocator));
        console.log(`Verified uploaded file: ${file}`);
        }
    }

    async navigatePreviousNextAndValidateReset(files: string[]) {
        console.log('Navigating back and forth to validate reset...');

        await WebUserActions.clickOnElement('Previous Button', this.page.locator(locators.CommonPage.previousButton));
        await this.page.waitForTimeout(2000);

        await WebUserActions.clickOnElement('Next Button', this.page.locator(locators.CommonPage.nextButton));
        await this.page.waitForTimeout(3000);

        for (const file of files) {
            const fileLocator = await WebUserActions.getDynamicLocator(locators.CommonPage.uploadedFileName, file.split('.')[0]);
            const isVisible = await this.page.locator(fileLocator).isVisible();
            if (isVisible) throw new Error(`File '${file}' still visible after Previous → Next.`);
            console.log(`File '${file}' reset successfully.`);
        }
    }

    async duplicateFileUploadCheck(fileName: string) {
        console.log(`Attempting duplicate upload for ${fileName}...`);

        await this.uploadPdfFromResources(fileName);
        await this.page.waitForTimeout(3000);
        await WebUserActions.waitForVisible('Done Button', this.fileUploadDoneButton);
        await WebUserActions.clickOnElement('Done Button', this.fileUploadDoneButton);
        await this.page.waitForTimeout(2000);

        const duplicateErrorLocator = await WebUserActions.getDynamicLocator(
            locators.CommonPage.duplicateErrorMessage,
            fileName.split('.')[0]
        );

        const isDuplicateVisible = await this.page.locator(duplicateErrorLocator).isVisible();
        if (!isDuplicateVisible) throw new Error('Duplicate error popup not shown.');
        console.log(`Duplicate error message displayed for ${fileName}.`);

        // Close popup
        const closeBtn = this.page.locator(locators.CommonPage.duplicateErrorCloseButton);
        if (await closeBtn.isVisible()) {
            await WebUserActions.clickOnElement('Close Duplicate Error Button', closeBtn);
            console.log('Closed duplicate error popup.');
        }
    }

    async deleteFileAndValidate(fileName: string) {
        console.log(`Deleting file ${fileName}...`);
        await this.deleteFile(fileName);
        await this.verifyFileDeleted(fileName);
        console.log(`File deletion verified: ${fileName}`);
    }

    async deleteFile(fileName: string) {
        const deleteBtn = await WebUserActions.getDynamicLocator(locators.CommonPage.deleteFileBtn, fileName);
        await WebUserActions.waitForVisible("Delete file button", this.page.locator(deleteBtn));
        await WebUserActions.clickOnElement("Delete file button", this.page.locator(deleteBtn));
        console.log(`Deleted file: ${fileName}`);
    }

    async verifyFileDeleted(fileName: string) {
        const fileLocator = await WebUserActions.getDynamicLocator(locators.CommonPage.uploadedFileName, fileName);
        const isVisible = await this.page.locator(fileLocator).isVisible();
        if (isVisible) throw new Error(`File ${fileName} is still visible after deletion`);
        console.log(`File deleted: ${fileName}`);
    }

    async uploadFilesAndCloseNDAorNBILFlow(files: string[], emailID: string) {
        console.log('Uploading NDA/NBIL attachments and closing the flow...');
        await WebUserActions.sendText("email Id", this.ccField, emailID);

        // Upload all files
        await this.uploadMultipleFiles(files);
        await this.verifyFilesUploaded(files);

        // Close the NDA/NBIL flow
        const closeBtn = this.page.locator(locators.CommonPage.closeButton);
        await WebUserActions.waitUntilClickable(closeBtn);
        await WebUserActions.clickOnElement('Close NDA/NBIL Flow Button', closeBtn);
        console.log('NDA/NBIL flow closed successfully after uploading files.');

        // Small wait to ensure navigation completes
        await this.page.waitForTimeout(3000);
    }

    async validateFilesInRelatedListAfterUploadAndDelete(files?: string[]) {
        console.log('Validating uploaded files in Files related list after deletion...');

        // files parameter can be provided (from NBIL sets). If not provided, fall back to defaults.
        const expectedVisibleFiles = files && files.length ? [files[0], files[2] || files[0]] : ['doc1.docx', 'doc3.docx'];
        const expectedDeletedFile = files && files.length > 1 ? files[1] : 'doc2.docx';

        // Scroll to Files section
        await this.page.waitForLoadState("domcontentloaded");
        const filesSection = this.page.locator(locators.CommonPage.allFilesSection);
        await WebUserActions.scrollUntilElementVisible(this.page, filesSection, 20);
        await this.page.waitForTimeout(2000);

        // Click on View All
        if (await filesSection.isVisible()) {
            await WebUserActions.waitUntilClickable(filesSection);
            await WebUserActions.clickOnElement("View All Files Button", filesSection);
            await this.page.waitForTimeout(3000);
        }

        // Validate visible files
        for (const fileName of expectedVisibleFiles) {
            const baseName = fileName.split('.')[0];

            const fileLocator = WebUserActions.getDynamicLocator(
                locators.CommonPage.fileRecordName,
                baseName 
            );
            
            const isVisible = await this.page.locator(fileLocator).isVisible();

            if (!isVisible) {
            throw new Error(`Expected uploaded file not found in Files related list: ${fileName}`);
            }
            console.log(`File visible in related list: ${fileName}`);
        }

        // Validate deleted file not visible
        const deletedFileLocator = WebUserActions.getDynamicLocator(
            locators.CommonPage.fileRecordName,
            expectedDeletedFile.split('.')[0]
        );
        const isDeletedFileVisible = await this.page.locator(deletedFileLocator).isVisible();

        if (isDeletedFileVisible) {
            throw new Error(`Deleted file '${expectedDeletedFile}' still appears in Files related list`);
        }
        console.log(`Deleted file '${expectedDeletedFile}' not visible in related list as expected.`);

        console.log('Files related list validation completed successfully.');

        //await WebUserActions.clickOnElement("Close Files Tab Button", this.page.locator(locators.CommonPage.closeFilesTabButton));
    }

    async validateFilesNotPresentInRelatedList() {
        console.log('Validating uploaded files are NOT visible in Files related list after NDA close...');

        // Files that were uploaded previously
        const uploadedFiles = ['doc4.docx', 'doc5.docx']; // You can make this dynamic later

        // Scroll to Files section
        await this.page.waitForLoadState("domcontentloaded");
        const filesSection = this.page.locator(locators.CommonPage.allFilesSection);
        await WebUserActions.scrollUntilElementVisible(this.page, filesSection, 20);
        await this.page.waitForTimeout(2000);

        // Click on View All
        if (await filesSection.isVisible()) {
            await WebUserActions.waitUntilClickable(filesSection);
            await WebUserActions.clickOnElement("View All Files Button", filesSection);
            await this.page.waitForTimeout(3000);
        }

        // Validate uploaded files are not visible
        for (const fileName of uploadedFiles) {
            const baseName = fileName.split('.')[0]; // remove extension for dynamic locator

            const fileLocator = WebUserActions.getDynamicLocator(
                locators.CommonPage.fileRecordName,
                baseName
            );

            const isVisible = await this.page.locator(fileLocator).isVisible();

            if (isVisible) {
                throw new Error(`File '${fileName}' is unexpectedly visible in Files related list after NDA close.`);
            }

            console.log(`File '${fileName}' correctly NOT visible in related list.`);
        }
        console.log('Validation complete: No uploaded files are visible in Files related list.');
        //await WebUserActions.clickOnElement("Close Files Tab Button", this.page.locator(locators.CommonPage.closeFilesTabButton));
    }

    //can be used Closing 'NDA', 'NBIL', 'Opportunity', 'Files' or any other subTabs
  async closeSubTab(tabName: string): Promise<void> {
  
    const tab = this.page.locator(WebUserActions.getDynamicLocator(locators.CommonPage.closeSubTabButton, tabName)).first();
    if (await tab.isVisible()) {
      await WebUserActions.clickOnElement(`Close ${tabName} Sub Tab`, tab);
    } else {
      console.log(`${tabName} Tab is not visible.`);
    }
  }

  async verifyTab(tabName: string): Promise<void> {
    const selector = WebUserActions.getDynamicLocator(locators.CommonPage.subTab, tabName);
    const tab = this.page.locator(selector);

    // If tab isn't visible
    if (!await tab.isVisible()) {
      console.log(`${tabName} Tab is not visible.`);
      return;
    }

    // Check aria-selected attribute; if not selected, click to select and return (no post-click check required)
    const ariaSelected = await tab.getAttribute('aria-selected');
    if (ariaSelected === 'true') {
      console.log(`${tabName} Tab is already selected (aria-selected=true).`);
      return;
    }

    console.log(`${tabName} Tab is visible but not selected (aria-selected=${ariaSelected}). Clicking to select.`);
    await WebUserActions.clickOnElement(`${tabName} Tab`, tab);
  }

}