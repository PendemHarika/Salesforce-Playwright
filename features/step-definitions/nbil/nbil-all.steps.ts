import {  When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestDataForTemplates } from '../../../resources/TemplatePage';
import dotenv from 'dotenv';
import { OpportunityPage } from '../../../pages/OpportunityPage';

dotenv.config({ path: process.env.ENV ? `.env.${process.env.ENV}` : '.env' });

let dynamicFields: Record<string, string> = {};

When('I allocate {string} percentage to primary producer and add {string}', async function (this: CustomWorld, allocation: string, serviceLead: string) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.manageAssignments) {
    throw new Error('manageAssignments is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }

  await this.opportunityPage.clickOnShowMoreActionsDropDown();
  await this.opportunityPage.clickOnManageOpportunityAssignment();
  await this.manageAssignments.addOpportunityAssignments(serviceLead, allocation);
  await this.manageAssignments.clickOnOpportunitySaveAndCloseButton();
});

When('I fill NBIL mandatory fields with values {string}, {string}, {string}, {string}, {string}, {string}, {string} for {string}', async function (this: CustomWorld, enterpriseValue:string, targetInput:string, targetDescription:string, quoteDueTimeValue:string, sellersidemnityValue:string, buyersCouncilValue:string, limitValue:string, insuranceType :string) {
  if (!this.nbilPage) {
    throw new Error('nbilPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }

  // Storing values in CustomWorld for later validations(reusability)
  this.sellersidemnityvalue = sellersidemnityValue;
  this.enterpriseValue = enterpriseValue;
  this.targetInput = targetInput;
  this.targetDescription = targetDescription;
  this.buyersCouncilValue = buyersCouncilValue;
  this.limitRequested1Value = limitValue;

  await this.nbilPage.fillNBILMandatoryFields(enterpriseValue, targetInput, targetDescription, quoteDueTimeValue, sellersidemnityValue, buyersCouncilValue, limitValue, insuranceType);
});

When('I fill aditional fields {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}', async function (this: CustomWorld, purchaseAgreement:string, rolloverPercentage:string, limitRequested2Value:string, sellersCouncilOption:string, typeOfFinancialsValue:string, legalOption:string, financialOption:string, taxOption:string, limitCommentsInputValue:string, otherRequestedTermsInputValue:string) {
  if (!this.nbilPage) {
    throw new Error('nbilPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  } 

  // Storing values in CustomWorld for later validations(reusability)
  this.rolloverPercentage= rolloverPercentage;
  this.sellersCouncilOption= sellersCouncilOption
  this.purchaseAgreement = purchaseAgreement;
  this.limitRequested2Value = limitRequested2Value;
  this.limitCommentsInputValue = limitCommentsInputValue;
  this.otherRequestedTermsInputValue = otherRequestedTermsInputValue;

  await this.nbilPage.fillingAdditionalNBILFields(purchaseAgreement, rolloverPercentage, limitRequested2Value, sellersCouncilOption, typeOfFinancialsValue, legalOption, financialOption, taxOption, limitCommentsInputValue, otherRequestedTermsInputValue);
});

Then('I validate the stage after NBIL submission is Quoting', async function (this: CustomWorld) {

  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.opportunityPage.validateStageAfterNDAOrNbil();
});

When('I submit a new NBIL request', { timeout: 120 * 1000 }, async function (this: CustomWorld) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.opportunityPage.clickOnNewNBILButton();
});

Then('I validate the email page, template data, Upload the {string} files and send the email for {string} with {string} for {string} and {string}', { timeout: 120 * 1000 }, async function (
  this: CustomWorld,
  setName:string,
  templateName: string,
  message: string,
  insuranceType: string,
  insuranceSubType: string
){
  if (!this.ndaPage) {
    throw new Error('ndaPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.nbilTemplatePage) {
    throw new Error('NBILTemplatePage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!(templateName in TestDataForTemplates)) {
    throw new Error(`Unknown template name: ${templateName}`);
  }

  // Ensure rollover and indemnity are set from previous steps or scenario outline
  const rollover = parseFloat(this.rolloverPercentage!);
  const indemnity = this.sellersidemnityvalue!;
  
if (insuranceType === "Reps & Warranties" && insuranceSubType === "Buyer-side Secondaries R&W") {
      dynamicFields = {
        "Project Name:": OpportunityPage.opportunityName,
        "Lead Investor:": process.env.ACCOUNT_NAME!,
        "Insurance Type:": insuranceType,
        "Target:": this.targetInput || this.parameters?.targetInput || '',
        "Description of Target Business:": this.targetDescription || this.parameters?.targetDescription || '',
        "Net Asset Value:": "$"+this.enterpriseValue!,
        "Lead Investor Counsel:": this.buyersCouncilValue!,
        "General Partner’s Counsel:": this.sellersCouncilOption!,
        "Purchase Agreement:": this.purchaseAgreement!,
        "Seller Indemnity": this.sellersidemnityvalue!,
        "Limit Requested:": "$"+this.limitRequested1Value!+" ("+this.limitCommentsInputValue!+")\n"+"                            $"+this.limitRequested2Value!,
      };
    } else if (insuranceType === "Reps & Warranties" && insuranceSubType === "Buyer-side R&W") {
      dynamicFields = {
        "Proposed Insured/Buyer:": process.env.ACCOUNT_NAME!,
        "Project Name:": OpportunityPage.opportunityName,
        "Insurance Type:": insuranceType,
        "Target:": this.targetInput!,
        "Description of Target Business:": this.targetDescription!,
        "Enterprise Value:": "$"+this.enterpriseValue!,
        "Buyer's Counsel:": this.buyersCouncilValue!,
        "Seller's Counsel:": this.sellersCouncilOption!,
        "Purchase Agreement:": this.purchaseAgreement!,
        "Seller Indemnity": this.sellersidemnityvalue!,
        "Limit Requested:": "$"+this.limitRequested1Value!+" ("+this.limitCommentsInputValue!+")\n"+"                            $"+this.limitRequested2Value!,
      };
    }else if (insuranceType === "Reps & Warranties" && insuranceSubType === "Seller-side R&W") {
      dynamicFields = {
        "Proposed Insured/Buyer:": process.env.ACCOUNT_NAME!,
        "Project Name:": OpportunityPage.opportunityName,
        "Insurance Type:": insuranceType,
        "Target:": this.targetInput!,
        "Description of Target Business:": this.targetDescription!,
        "Enterprise Value:": "$"+this.enterpriseValue!,
        "Buyers Counsel:": this.buyersCouncilValue!,
        "Seller's Counsel:": this.sellersCouncilOption!,
        "Purchase Agreement:": this.purchaseAgreement!,
        "Seller Indemnity": this.sellersidemnityvalue!,
        "Limit Requested:": "$"+this.limitRequested1Value!+" ("+this.limitCommentsInputValue!+")\n"+"                            $"+this.limitRequested2Value!,
      };
      }else {
      dynamicFields = {
        "Proposed Insured/Buyer:": process.env.ACCOUNT_NAME!,
        "Project Name:": OpportunityPage.opportunityName,
        "Exposure Size:" : "$"+this.enterpriseValue!,
        "Client's Tax Advisor:":this.buyersCouncilValue!,
        "Limit Requested": "$"+this.limitRequested1Value!+" ("+this.limitCommentsInputValue!+")\n"+"                            $"+this.limitRequested2Value!,
    };
    }
  // Build params for validation
  const params = {
    templateName,
    insuranceType,
    insuranceSubType,
    rollover, // Now a number
    indemnity,
    requestType: templateName,
    clientName: process.env.ACCOUNT_NAME!,
    projectName: OpportunityPage.opportunityName // Add the missing projectName property
  };

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

  const filesToUpload = getFilesForSet(setName);

  await this.ndaPage.sendNBILEmail(message, process.env.EMAIL!, OpportunityPage.opportunityName, filesToUpload);
  await this.nbilTemplatePage.validateNBILTemplate(dynamicFields,params);
});


Then('I validate the Success Message and Close the success message window', async function (this: CustomWorld) {
  if (!this.ndaPage) {
    throw new Error('ndaPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  } 
  
  await this.ndaPage.validateNDANBILSuccessMessage('NBIL');
  await this.ndaPage.closeSuccessWindow();
});

When('Navigate to activityTab and open the email request sent', async function (this: CustomWorld) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.opportunityPage!.navigateToActivityTab();
  await this.opportunityPage!.openTheEmailRequestSent();
  await this.opportunityPage!.navigateToEmailDetailsTab();

});

Then('I {string} in NBIL Email Template for {string}', async function ( this: CustomWorld,scenarioName:string,insuranceType:string) {
  if (!this.nbilPage) {
    throw new Error('nbilPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  
  // Execute template modifications and store the returned test data in CustomWorld
  this.testData = await this.nbilPage.changeTemplateModifications(scenarioName,insuranceType);
  
  console.log(`Template modifications applied for scenario: ${scenarioName}`);
  console.log(`Test data stored in CustomWorld:`, this.testData);
});

Then('I validate the email body details with updated values for {string}, {string}',async function(this:CustomWorld, insuranceType: string, requestType:string){
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  
  if (!this.testData) {
    throw new Error('No test data found. Make sure the template modification step was executed first.');
  }
  await this.opportunityPage!.validateEmailFields(insuranceType,requestType);
  
  const storedData = this.testData;
  console.log(`Validating email for scenario: ${storedData.scenario}`);
  console.log(`Action performed: ${storedData.actionPerformed}`);

  // Validate based on the scenario type
  switch (storedData.scenario) {
    case "change_whole_emailbody":
      console.log("Validating email body replacement...");
      console.log(`Expected email body: ${storedData.validationFields.testEmailMessage}`);
      await this.nbilPage!.validateEmailBodyInEmail(storedData.validationFields.testEmailMessage);
      break;

    case "change_cc_field":
      console.log("Validating CC field update...");
      console.log(`Expected CC email: ${storedData.validationFields.ccEmail}`);
      await this.nbilPage!.validateCCInActivity(storedData.validationFields.ccEmail);
      break;

    case "change_static_text":
      console.log("Validating static text update...");
      console.log(`Expected static text: ${storedData.validationFields.newStaticText}`);
      await this.nbilPage!.validateEmailBodyInEmail(storedData.validationFields.newStaticText);
      break;

    case "change_dynamic_text":
      console.log("Validating dynamic fields update...");
      // Validate each dynamic field
      for (const [fieldName, expectedValue] of Object.entries(storedData.validationFields.dynamicFields)) {
        console.log(`Validating dynamic field: ${fieldName} = ${expectedValue}`);
        const isValid = await this.nbilPage!.validateDynamicField(fieldName, String(expectedValue));
        if (!isValid) {
          console.log(`Validation failed for dynamic field: ${fieldName}`);
          throw new Error(`Dynamic field validation failed for ${fieldName}: expected "${expectedValue}"`);
        }
      }
      console.log("All dynamic field validations passed");
      break;

    case "remove_table":
      console.log("Validating table removal...");
      console.log(`Expected table content: ${storedData.validationFields.testTableMessage}`);
      await this.nbilPage!.validateEmailBodyInEmail(storedData.validationFields.testTableMessage);
      break;

    case "change_all_fields":
      console.log("Validating comprehensive field updates...");
      
      // Validate CC field change
      console.log(`Validating CC field: ${storedData.validationFields.ccEmail}`);
      await this.nbilPage!.validateCCInActivity(storedData.validationFields.ccEmail);
      
      // Validate static text change
      console.log(`Validating static text: ${storedData.validationFields.staticText}`);
      await this.nbilPage!.validateEmailBodyInEmail(storedData.validationFields.staticText);
      
      // Validate dynamic fields changes
      console.log("Validating dynamic fields changes:");
      for (const [fieldName, expectedValue] of Object.entries(storedData.validationFields.dynamicFields)) {
        console.log(`- ${fieldName}: ${expectedValue}`);
        // Validate specific dynamic field
        const isValid = await this.nbilPage!.validateDynamicField(fieldName, String(expectedValue));
        if (!isValid) {
          console.log(`Validation failed for dynamic field: ${fieldName}`);
          throw new Error(`Dynamic field validation failed for ${fieldName}: expected "${expectedValue}"`);
        }
      }
      console.log("All dynamic field validations passed for comprehensive update");
      
      break;

    default:
      throw new Error(`Unknown scenario for validation: ${storedData.scenario}`);
  }

  console.log(`Email validation completed successfully for scenario: ${storedData.scenario}`);
  console.log(`All expected changes were validated in the sent email`);
});
 
Then('I send the NBIL Email', async function (this: CustomWorld) {
  if (!this.ndaPage) {
    throw new Error('ndaPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.ndaPage.emailSendButton();
});