import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { OpportunityPage } from '../../../pages/OpportunityPage';
import { NdaPage } from '../../../pages/NdaPage';
import { ManageAssignments } from '../../../pages/ManageAssignments';
import { NbilPage } from '../../../pages/NbilPage';
import { AccountPage } from '../../../pages/AccountPage';
import { NBILTemplatePage } from '../../../pages/NBILTemplatePage';
import dotenv from 'dotenv';
import { CoveragePage } from '../../../pages/CoveragePage';
import { CommonPage } from '../../../pages/CommonPage';
import { NewPolicyPage } from '../../../pages/NewPolicyPage';
import { RenewalPoliciesPage } from '../../../pages/RenewalPoliciesPage';

dotenv.config({ path: process.env.ENV ? `.env.${process.env.ENV}` : '.env' });

Given("I log into the Salesforce application as admin", async function (this: CustomWorld) {
   if (!this.homePage) {
    throw new Error('homePage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }

  await this.homePage.clickOnSetUpButton();
  this.newPage =  await this.homePage.openSetupTab();//store the new page instance
  
  if (!this.newPage) {
    throw new Error('Failed to open setup tab. New page instance is undefined.');
  }
  //Initialize page objects with the new page instance
  this.accountPage = new AccountPage(this.newPage);
  this.opportunityPage = new OpportunityPage(this.newPage);
  this.manageAssignments = new ManageAssignments(this.newPage);
  this.ndaPage = new NdaPage(this.newPage);
  this.nbilPage = new NbilPage(this.newPage);
  this.nbilTemplatePage = new NBILTemplatePage(this.newPage);
  this.coveragePage = new CoveragePage(this.newPage);
  this.commonPage = new CommonPage(this.newPage);
  this.newPolicyPage = new NewPolicyPage(this.newPage);
  this.renewalPoliciesPage = new RenewalPoliciesPage(this.newPage);
});

Given("I switch to TL Broker User", { timeout: 60 * 1000 }, async function (this: CustomWorld) {
  if (!this.homePage) {
    throw new Error('homePage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.homePage!.searchTLUser(process.env.TL_USER!);
  await this.homePage!.switchToUser();
  //await this.homePage!.closeSetupTabAndSwitchBack();
  await this.homePage!.selectApplication(process.env.APPLICATION_NAME!);
  await this.homePage!.closeAllTabs();
});

Given('I open Client account', { timeout: 60 * 1000 }, async function (this: CustomWorld) {
  if (!this.homePage) {
    throw new Error('homePage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.accountPage) {
    throw new Error('accountPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }

  //selecting client account through navigation menu
   await this.homePage!.navigateToAccountsTab();
  // await this.homePage!.searchAndSelectClientFromList(process.env.ACCOUNT_NAME!);

  //selecting client account through global search
  await this.homePage!.globalSearch(process.env.ACCOUNT_NAME!);
});


Then('I validate Account record type as {string}', { timeout: 60 * 1000 }, async function (this: CustomWorld, recordType: string) {
  if (!this.accountPage) {
    throw new Error('accountPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.accountPage!.validateAccountRecordType(recordType);
});

When('I create a new opportunity with {string} and {string}', { timeout: 60 * 1000 }, async function (this: CustomWorld, type: string, subtype: string) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.opportunityPage!.createNewOpportunity(type, subtype);
  await this.opportunityPage!.clickOnSaveButton();
});

Then('I validate the stage is Intake', { timeout: 60 * 1000 }, async function (this: CustomWorld) {
  if (!this.ndaPage) {
    throw new Error('ndaPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.ndaPage!.validateIntakeStage();
});

Then('I close the success window', async function (this: CustomWorld) {
  if (!this.ndaPage) {
    throw new Error('ndaPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.ndaPage!.closeSuccessWindow();
});

Given('I add New Coverage with {string}', async function (this: CustomWorld, coverageType: string) {
  if (!this.coveragePage) {
    throw new Error('coveragePage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
    await this.opportunityPage.clickOnShowMoreActionsDropDown();
    await this.opportunityPage.clickOnCoverageBuilderOption();
    await this.coveragePage.createNewCoverage(coverageType);
});

Then('I validate {string} and {string}', async function (this: CustomWorld, coverageType: string, lineOfCoverage: string) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.opportunityPage.validateCoverageDetails(coverageType, lineOfCoverage);

});
Given('I validate valid {string} for {string}', async function (this: CustomWorld, fullCarrierName:string, carrierAbbreviation:string) {
  if (!this.homePage) {
    throw new Error('homePage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  } 
  await this.homePage.globalSearch(fullCarrierName)
  await this.homePage.validateValidCarrier(carrierAbbreviation);
});
When('I select the valid {string} for {string}', async function (this: CustomWorld, carrier:string, template:string) {
  if (!this.nbilPage) {
    throw new Error('nbilPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }   
  await this.nbilPage.nbilCarrierSelection(carrier, template);
});
When('I open the existing opportunity', async function (this: CustomWorld) {
  if (!this.homePage) {
    throw new Error('homePage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  } 
  await this.homePage.openTheExistingOpportunity();
});
When('I navigate to Opportunity tab', async function (this: CustomWorld) {
  if (!this.homePage) {
    throw new Error('homePage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.homePage.closeLastAccountTab(); 
  await this.homePage.navigateToOpportunityTab();
});
When('I add Opportunity Team Member with {string} and {string} and {string}',async function (this: CustomWorld, teamMemberName: string, role: string, accessType: string) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.opportunityPage.clickOnOpportunityTeamShowMoreActionsDropDown();
  await this.opportunityPage.addOpportunityTeamMembers(teamMemberName, role, accessType);
});

Then('I validate the Opportunity Team Member with {string} and {string} and {string}',async function (this: CustomWorld, teamMemberName: string, role: string, accessType: string) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.opportunityPage.validateAddedUser(teamMemberName); 
});

When('I create Notes with {string} and {string}',async function (this: CustomWorld, noteTitle: string, noteBody: string) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.opportunityPage.clickOnNotesShowMoreActionsDropDown();
  await this.opportunityPage.addNotesDetails(noteTitle, noteBody);
});

Then('I validate the Notes with {string} and {string}',async function (this: CustomWorld, noteTitle: string, noteBody: string) {
  if (!this.opportunityPage) {
    throw new Error('opportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.opportunityPage.validateNotesAdded (noteTitle, noteBody); 
});
Then('I close the last sub tab',async function (this: CustomWorld) {
  if (!this.homePage) {
    throw new Error('homePage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.opportunityPage!.closeLastSubTab();
});

Then('I close the {string} tab',async function (this: CustomWorld, tabName: string) {
  if (!this.commonPage) {
    throw new Error('commonPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  } 
  await this.commonPage.closeSubTab(tabName);  
});

Then('I verify user is on {string} tab',async function (this: CustomWorld, tabName: string) {
  if (!this.commonPage) {
    throw new Error('commonPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  } 
  await this.commonPage.verifyTab(tabName);  
});