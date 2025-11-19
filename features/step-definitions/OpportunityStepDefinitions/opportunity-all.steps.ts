import { When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import dotenv from 'dotenv';
import { CommonPage } from '../../../pages/CommonPage';
import { RandomDataGenerator } from '../../../utils/randomDataGenerator';

Then('I validate that uploaded files are not visible in Files related list', async function (this: CustomWorld) {
    if (!this.commonPage) {
        throw new Error('commonPage is undefined. Ensure hooks.ts ran successfully.');
    }
    await this.commonPage!.validateFilesNotPresentInRelatedList();
});

Then('I Verify Coverages In opportunity', async function (this: CustomWorld) {
  if (!this.coveragePage) {
    throw new Error('coveragePage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.coveragePage.verifyCoverages();
})

Then('I verify Opportunity Assignments allocation', async function (this: CustomWorld) {
  if (!this.manageAssignments) {
    throw new Error('manageAssignmentsPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
   if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.opportunityPage.clickOnShowMoreActionsDropDown();
  await this.opportunityPage.clickOnManageOpportunityAssignment();
  await this.manageAssignments.fillPrimaryProducerAllocation('100');
  await this.manageAssignments.clickOnOpportunitySaveAndCloseButton();
})

Then('I change Opportunity Stage to {string}', async function (this: CustomWorld, stage: string) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.opportunityPage.changeOpportunityStage(stage);
})



//
// ---------- DEAL OVERVIEW ----------
//
When("I edit and verify fields in Deal Overview section", { timeout: 180000 }, async function (this: CustomWorld) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
    const section = "Deal Overview";

    // Fields from your prompt
    const updates = [
        { field: "Opportunity Name", type: "text", value: await RandomDataGenerator.randomStringWithRange("AutoOpp", 3, 10) },
        { field: "Enterprise Value", type: "text", value: await RandomDataGenerator.randomNumber(4) },
        { field: "Target", type: "text", value: await RandomDataGenerator.randomStringWithRange("Target", 3, 10) },
        { field: "Target Business Description", type: "textarea", value: await RandomDataGenerator.randomStringWithRange("Desc", 5, 90) },
        { field: "Status Comment", type: "text", value: await RandomDataGenerator.randomStringWithRange("Status", 3, 10) },
        { field: "Additional NBIL Information", type: "textarea", value: await RandomDataGenerator.randomStringWithRange("NBILInfo", 5, 90) },
        { field: "Tax Risk", type: "text", value: await RandomDataGenerator.randomStringWithRange("TaxRisk", 4, 8) },
        { field: "Currency Type", type: "dropdown" },
        { field: "Insurance Type", type: "dropdown" },
        { field: "Insurance Sub-Type", type: "dropdown" },
        { field: "Stage", type: "dropdown" },
        { field: "Quote Due Time", type: "dropdown" },
        { field: "Type of Buyer", type: "dropdown" },
        { field: "Type of Seller", type: "dropdown" },
        { field: "Quote Due Date", type: "date", value: await RandomDataGenerator.getDateYearsFromNow(10) },
        { field: "Probability (%)", type: "number", value: await RandomDataGenerator.randomNumber(2) },
        { field: "Rollover percentage", type: "number", value: await RandomDataGenerator.randomNumber(2) },
        { field: "Tower Deal", type: "checkbox" },
        { field: "Target Company Industry", type: "list" },
    ];

    // Perform field edits
    await this.opportunityPage.editFieldsInSection(section, updates);
});

When("I edit and verify fields in Purchase Agreement Details section", { timeout: 180000 }, async function (this: CustomWorld) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
    const section = "Purchase Agreement Details";

    // Fields to update
    const updates = [
        { field: "Type", type: "dropdown"},
        { field: "Purchase Agreement Name", type: "text", value: await RandomDataGenerator.randomStringWithRange("PAName", 3, 10) },
        { field: "Seller's Indemnity", type: "dropdown" },
        { field: "Section #s from Purchase Agreement", type: "text", value: await RandomDataGenerator.randomStringWithRange("Section", 3, 10) },
        { field: "Exclusive", type: "checkbox" },
        { field: "Purchase Agreement Date", type: "date", value: await RandomDataGenerator.getDateYearsFromNow(1) },
        { field: "ETA for Draft Purchase Agreement", type: "date", value: await RandomDataGenerator.getDateYearsFromNow(5) },
    ];

    // Perform field edits
    await this.opportunityPage.editFieldsInSection(section, updates);
});
When("I edit and verify fields in Counsel Information section", { timeout: 180000 }, async function (this: CustomWorld) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
    const section = "Counsel Information";

    // Fields to update
    const updates = [
        { field: "Buyer’s Counsel", type: "dropdown"},
        { field: "Other Buyer’s Counsel", type: "text", value: await RandomDataGenerator.randomString("other", 5) },
        { field: "Seller’s Counsel", type: "dropdown"},
        { field: "Other Seller's Counsel", type: "text", value: await RandomDataGenerator.randomString("SellCounsel", 5) },
    ];

    // Perform field edits
    await this.opportunityPage.editFieldsInSection(section, updates);
});

When("I edit and verify fields in Insurance Requirements & Submission Info section", { timeout: 180000 }, async function (this: CustomWorld) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
    const section = "Insurance Requirements & Submission Info";

    // Fields to update 
    const updates = [
        { field: "Limit Requested #1", type: "text", value: await RandomDataGenerator.randomNumber(3) },
        { field: "Limit Comments", type: "text", value: await RandomDataGenerator.randomStringWithRange("LimitComments", 4, 10) },
        { field: "Limit Requested #2", type: "text", value: await RandomDataGenerator.randomNumber(2) },
        { field: "Other Requested Terms", type: "text", value: await RandomDataGenerator.randomStringWithRange("OtherTerms", 4, 10) },
        { field: "Draft Purchase Agreement", type: "checkbox" },
        { field: "Type of Financials", type: "dropdown" },
        { field: "Deal Book", type: "checkbox" },
    ];

    // Perform field edits
    await this.opportunityPage.editFieldsInSection(section, updates);
});

When("I edit and verify fields in Diligence Advisors section", { timeout: 180000 }, async function (this: CustomWorld) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }

  const section = "Diligence Advisors";

  // Fields to update
  const updates = [
    { field: "Legal", type: "dropdown"},
    { field: "Other Legal", type: "text", value: await RandomDataGenerator.randomStringWithRange("OtherDiligence", 3, 10) },
    { field: "Financial", type: "dropdown"},
    { field: "Other Financial", type: "text", value: await RandomDataGenerator.randomStringWithRange("OtherFinancial", 3, 10) },
    { field: "Tax", type: "dropdown"},
    { field: "Other Tax", type: "text", value: await RandomDataGenerator.randomStringWithRange("OtherTax", 3, 10) },
    { field: "Environmental", type: "dropdown"},
    { field: "Other Environmental", type: "text", value: await RandomDataGenerator.randomStringWithRange("OtherEnv", 3, 10) },
    { field: "Intellectual Property", type: "dropdown"},
    { field: "Other Intellectual Property", type: "text", value: await RandomDataGenerator.randomStringWithRange("OtherIP", 3, 10) },
    { field: "Information Technology (IT)", type: "dropdown"},
    { field: "Other Information Technology (IT)", type: "text", value: await RandomDataGenerator.randomStringWithRange("OtherIT", 3, 10) },
    { field: "Regulatory", type: "dropdown"},
    { field: "Other Regulatory", type: "text", value: await RandomDataGenerator.randomStringWithRange("OtherRegulatory", 3, 10) },
    { field: "Insurance", type: "dropdown"},
    { field: "Other Insurance", type: "text", value: await RandomDataGenerator.randomStringWithRange("OtherInsurance", 3, 10) },
    { field: "Foreign", type: "text", value: await RandomDataGenerator.randomStringWithRange("Foreign", 3, 10) },
    { field: "Other", type: "text", value: await RandomDataGenerator.randomStringWithRange("Other", 3, 10) },
    { field: "Other 2", type: "text", value: await RandomDataGenerator.randomStringWithRange("Other2", 3, 10) },
    { field: "Buyer Banker", type: "dropdown" },
    { field: "Seller Banker", type: "dropdown" },
  ];

  // Perform field edits
  await this.opportunityPage.editFieldsInSection(section, updates);
});

When("I edit and verify fields in NDA Request section", async function (this: CustomWorld) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }     
    const section = "NDA Request";

    // Fields to update
    const updates = [
        { field: "Is NDA Required", type: "dropdown" },
    ];
    // Perform field edits
    await this.opportunityPage.editFieldsInSection(section, updates);
});

When("I edit and verify fields in Binding Items section", { timeout: 180000 }, async function (this: CustomWorld) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
    const section = "Binding Items";

    // Fields to update
    const updates = [
        { field: "Target Signing Date", type: "date", value: await RandomDataGenerator.todayDate() },
        { field: "Target Close Date", type: "date", value: await RandomDataGenerator.getDateYearsFromNow(1) },
        { field: "10% Invoice Generated", type: "checkbox" },
        { field: "90% Invoice Generated", type: "checkbox" },
        { field: "100% Invoice Generated", type: "checkbox" },
        { field: "Buyer's Counsel Senior Partner", type: "search" },
        { field: "Buyer's Counsel Lead Attorney", type: "search" },
        { field: "Policy Effective Date", type: "date", value: await RandomDataGenerator.todayDate() },
        { field: "Retention", type: "text", value: await RandomDataGenerator.randomNumber(4) },
        { field: "Actual Closing Date", type: "date", value: await RandomDataGenerator.getDateYearsFromNow(4) },
        { field: "Dropdown Retention", type: "text", value: await RandomDataGenerator.randomNumber(2) },
        { field: "Underwriting Fee", type: "text", value: await RandomDataGenerator.randomNumber(3) },
        { field: "Dropdown Retention Date", type: "date", value: await RandomDataGenerator.getDateYearsFromNow(2) },
        { field: "Int’l Placement Fee", type: "text", value: await RandomDataGenerator.randomNumber(3) },
        { field: "Revenue Recognized", type: "text", value: await RandomDataGenerator.randomNumber(4) },
        { field: "Int’l Partner", type: "dropdown" }
    ];
    // Perform field edits
    await this.opportunityPage.editFieldsInSection(section, updates);
});

When("I edit and verify fields in Subjectivity Tracking section", { timeout: 180000 }, async function (this: CustomWorld) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
    const section = "Subjectivity Tracking";    
    // Fields to update
    const updates = [
        { field: "Premium Payment", type: "checkbox" },
        { field: "Underwriting Fee Payment", type: "checkbox" },
        { field: "Data Room - Lockton", type: "checkbox" },
        { field: "Data Room - Carrier", type: "checkbox" },
        { field: "Closing Set - Lockton", type: "checkbox" },
        { field: "Closing Set - Carrier", type: "checkbox" },
        { field: "Policy Issued", type: "checkbox" },
        { field: "Lockton Tracking Number", type: "text", value: await RandomDataGenerator.randomStringWithRange("", 5, 10) },
        { field: "10% Premium Received by Carrier", type: "checkbox" },
        { field: "10% Premium Received by Lockton", type: "checkbox" },
        { field: "100% premium received by Lockton", type: "checkbox" },
        { field: "100% premium received by Carrier", type: "checkbox" },
    ];
    // Perform field edits
    await this.opportunityPage.editFieldsInSection(section, updates);
});