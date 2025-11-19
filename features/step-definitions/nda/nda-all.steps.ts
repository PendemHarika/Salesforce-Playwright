import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import dotenv from 'dotenv';
import { OpportunityPage } from '../../../pages/OpportunityPage';

dotenv.config({ path: process.env.ENV ? `.env.${process.env.ENV}` : '.env' });
When('I submit a new NDA request with {string}, {string} and upload {string} files', { timeout: 180 * 1000 }, async function (this: CustomWorld, carrier, message, fileSet) {
  if (!this.ndaPage) {
    throw new Error('ndaPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }

  // Map the logical set name to actual files located in resources/
  const getFilesForSet = (name: string): string[] => {
    const map: Record<string, string[]> = {
      set1: ['set1_a.docx','set1_b.jpg','set1_c.md'],
      set2: ['set2_a.docx','set2_b.png','set2_c.pdf'],
      set3: ['set3_a.docx','set3_b.jpg','set3_c.md'],
      set4: ['set4_a.docx','set4_b.webp','set4_c.pdf'],
      set5: ['set5_a.pdf','set5_b.docx','set5_c.png'],
      set6: ['set6_a.docx','set6_b.jpg','set6_c.md']
    };
    const key = name.trim().toLowerCase();
    if (!(key in map)) throw new Error(`Unknown file set: ${name}`);
    return map[key];
  };

  const filesToUpload = getFilesForSet(fileSet);

  await this.opportunityPage!.clickOnNewNDAButton();
  await this.ndaPage!.ndaCarrierSelection(carrier);
  await this.ndaPage!.sendNDAEmail(message, process.env.EMAIL!, OpportunityPage.opportunityName, filesToUpload);
  await this.ndaPage!.emailSendButton();
});

Then('I should see the NDA request success message', async function (this: CustomWorld) {
   if (!this.ndaPage) {
    throw new Error('ndaPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.ndaPage!.validateNDANBILSuccessMessage('NDA');
});

Then('I validate the stage after NDA submission is Quoting', async function (this: CustomWorld) {
 if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.opportunityPage!.validateStageAfterNDAOrNbil();
});

Then('I validate the NDA/NBIL email is sent and {string} files is uploaded', { timeout: 60 * 1000 }, async function (this: CustomWorld, fileSet) {
  
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.opportunityPage!.navigateToActivityTab();
  // Pass fileSet down so page can validate the expected files per set
  await this.opportunityPage!.validateNDAorNBILUploadedFile(fileSet);
});

When('I resend NDA request with carrier {string} and upload attachments and close the flow', async function (this: CustomWorld, carrier) {
  if (!this.ndaPage || !this.opportunityPage || !this.commonPage) {
    throw new Error('Pages not initialized.');
  }
  await this.opportunityPage!.clickOnNewNDAButton();
  await this.ndaPage!.ndaCarrierSelection(carrier);

  // Continue unique part: upload & close
  const files = ['doc4.docx', 'doc5.docx'];
  await this.commonPage!.uploadFilesAndCloseNDAorNBILFlow(files, process.env.QA_USERNAME!);
});

When('I resend NBIL request with carrier {string} and template {string} and upload attachments and close the flow', async function (this: CustomWorld, carrier, template) {
  if (!this.nbilPage || !this.opportunityPage || !this.commonPage) {
    throw new Error('Pages not initialized.');
  }
  await this.opportunityPage!.clickOnNewNBILButton();
  await this.nbilPage!.nbilCarrierSelection(carrier, template);

  // Continue unique part: upload & close
  const files = ['doc4.docx', 'doc5.docx'];
  await this.commonPage!.uploadFilesAndCloseNDAorNBILFlow(files, process.env.QA_USERNAME!);
});

