import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import dotenv from 'dotenv';
import { expect } from 'playwright/test';
import { Console, time } from 'console';
import { Logger } from '../../../utils/logger';


When('I create new Policy and verify Save for Later on all Chevrons', async function (this: CustomWorld) {
    if (!this.newPolicyPage) {
        throw new Error('PolicyPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
    }
    if (!this.opportunityPage) {
        throw new Error('OpportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
    }
    if (!this.renewalPoliciesPage) {
        throw new Error('RenewalPoliciesPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
    }

  // 1️⃣ Fill Policy Details and Save
  await this.opportunityPage.clickOnNewPolicyButton();
  const policyNumber = await this.newPolicyPage.fillPolicyDetails();
  await this.newPolicyPage.clickSaveButton();

  // 2️⃣ Add Coverage and Save for Later
  await this.newPolicyPage.addCoverage();
  await this.newPolicyPage.clickSaveForLaterButton();
  await this.newPolicyPage.verifyPolicyPage(policyNumber);

  // 3️⃣ Edit Policy → Verify landed on Policy Details Chevron
  await this.newPolicyPage.clickEditPolicyButton();
  await this.newPolicyPage.closeNewPolicytab();
  await this.newPolicyPage.verifyChevron('Policy');
  await this.newPolicyPage.clickSaveButton();

  // 4️⃣ Fill Premium Chevron → Save for Later
  await this.newPolicyPage.fillPremiumDetails();
  await this.newPolicyPage.clickSaveForLaterButton();
  await this.newPolicyPage.verifyPolicyPage(policyNumber);
  

  // Edit Policy → Verify Premium Chevron
  await this.newPolicyPage.clickEditPolicyButton();
  await this.newPolicyPage.verifyChevron('Premium');
  await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();

  // 5️⃣ Fill Assignments Chevron → Save for Later
  await this.newPolicyPage.fillAssignmentsDetails();
  await this.newPolicyPage.clickSaveForLaterButton();
  await this.newPolicyPage.verifyPolicyPage(policyNumber);

  // Edit Policy → Verify Assignments Chevron
  await this.newPolicyPage.clickEditPolicyButton();
  await this.newPolicyPage.verifyChevron('Assignments');
  await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();
  await this.renewalPoliciesPage.waitUntilSyncWithNX();

  // 6️⃣ Fill Fee Chevron → Save for Later
  await this.newPolicyPage.fillFeeDetails('Agency Fee', '% of Premium', '25');
  await this.newPolicyPage.clickSaveForLaterButton();
  await this.renewalPoliciesPage.waitUntilSyncWithNX();
  await this.newPolicyPage.verifyPolicyPage(policyNumber);

  // Edit Policy → Verify Fee Chevron
  await this.newPolicyPage.clickEditPolicyButton();
  await this.newPolicyPage.verifyChevron('Fee');
  await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();

  // 7️⃣ Fill Surplus Tax Chevron → Save for Later
  await this.newPolicyPage.navigateToPolicyStage("Policy");
  await this.renewalPoliciesPage.clickOnPremiumSaveButton();
  await this.newPolicyPage.navigateToPolicyStage("Surplus Line Tax");
  await this.newPolicyPage.fillSurplusTaxDetails('Invoice Total', 'AK Filing Fee');
  await this.newPolicyPage.clickSaveForLaterButton();
  await this.newPolicyPage.verifyPolicyPage(policyNumber);

  await this.newPolicyPage.clickEditPolicyButton();
  await this.newPolicyPage.verifyChevron('Surplus Line Tax');
  await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();
  await this.renewalPoliciesPage.waitUntilSyncWithNX();


  // 8️⃣ Fill Agency Commissions Chevron → Save for Later
  await this.newPolicyPage.verifyChevron('Agency Commissions');
  Logger.info("veried agency commisions chev 1");
  await this.newPolicyPage.clickSaveForLaterButton();
  Logger.info("clicked av for later");
  await this.newPolicyPage.verifyPolicyPage(policyNumber);
  Logger.info("verified pol number");

  await this.newPolicyPage.clickEditPolicyButton();
  Logger.info("Clicked edit button in pol page");
  await this.newPolicyPage.verifyChevron('Agency Commissions');
  Logger.info("veried agency commisions chev");
  await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();
  Logger.info("clicked nect button in agency commisions chevrn")

  // 9️⃣ Fill Other Commissions Chevron → Save for Later
  await this.newPolicyPage.fillOtherCommissionsDetails();
  await this.newPolicyPage.clickSaveForLaterButton();
  await this.newPolicyPage.verifyPolicyPage(policyNumber);

  await this.newPolicyPage.clickEditPolicyButton();
  await this.newPolicyPage.verifyChevron('Other Commissions');
  await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();


  // 🔟 Fill Summary Chevron → Save for Later
  await this.newPolicyPage.verifyChevron('Summary');
  await this.newPolicyPage.clickSaveForLaterButton();
  await this.newPolicyPage.verifyPolicyPage(policyNumber);

  await this.newPolicyPage.clickEditPolicyButton();
  await this.newPolicyPage.verifyChevron('Summary');
  await this.renewalPoliciesPage.clickOnFinalizePolicyButton();
  await this.page?.waitForTimeout(10000);
  await this.newPolicyPage.validatePendingPolicyStatus("Bound");

});

When('I create and save new Policy', async function (this: CustomWorld) {
  if (!this.newPolicyPage) {
      throw new Error('PolicyPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.opportunityPage) {
      throw new Error('OpportunityPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.opportunityPage.clickOnNewPolicyButton();
  this.policyNumber = await this.newPolicyPage.fillPolicyDetails();
  await this.newPolicyPage.clickSaveButton();
});

Then('I fill Coverage in Policy chevron and save for later', async function (this: CustomWorld) {
  if (!this.newPolicyPage) {
    throw new Error('PolicyPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.policyNumber) {
    throw new Error('PolicyNumber is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.newPolicyPage.addCoverage();
  await this.newPolicyPage.clickSaveForLaterButton();
  await this.newPolicyPage.verifyPolicyPage(this.policyNumber);
  await this.newPolicyPage.clickEditPolicyButton();
  await this.newPolicyPage.closeNewPolicytab();
  await this.newPolicyPage.verifyChevron('Policy');
  await this.newPolicyPage.clickSaveButton();
});

Then('I fill Premium chevron and save for later', async function (this: CustomWorld) {
  if (!this.newPolicyPage) {
    throw new Error('PolicyPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.renewalPoliciesPage) {
    throw new Error('RenewalPoliciesPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.policyNumber) {
    throw new Error('PolicyNumber is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.newPolicyPage.fillPremiumDetails();
  await this.newPolicyPage.clickSaveForLaterButton();
  await this.newPolicyPage.verifyPolicyPage(this.policyNumber);

  // Edit Policy → Verify Premium Chevron
  await this.newPolicyPage.clickEditPolicyButton();
  await this.newPolicyPage.verifyChevron('Premium');
  await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();
});

Then('I fill Assignments chevron and save for later', async function (this: CustomWorld) {
  if (!this.newPolicyPage) {
    throw new Error('PolicyPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.renewalPoliciesPage) {
    throw new Error('RenewalPoliciesPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.policyNumber) {
    throw new Error('PolicyNumber is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.newPolicyPage.fillAssignmentsDetails();
  await this.newPolicyPage.clickSaveForLaterButton();
  await this.newPolicyPage.verifyPolicyPage(this.policyNumber);

  // Edit Policy → Verify Assignments Chevron
  await this.newPolicyPage.clickEditPolicyButton();
  await this.newPolicyPage.verifyChevron('Assignments');
  await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();
  await this.renewalPoliciesPage.waitUntilSyncWithNX();
});

Then('I fill Fee chevron and save for later', async function (this: CustomWorld) {
  if (!this.newPolicyPage) {
    throw new Error('PolicyPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.renewalPoliciesPage) {
    throw new Error('RenewalPoliciesPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.policyNumber) {
    throw new Error('PolicyNumber is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.newPolicyPage.fillFeeDetails('Agency Fee', '% of Premium', '25');
  await this.newPolicyPage.clickSaveForLaterButton();
  await this.renewalPoliciesPage.waitUntilSyncWithNX();
  await this.newPolicyPage.verifyPolicyPage(this.policyNumber);

  await this.newPolicyPage.clickEditPolicyButton();
  await this.newPolicyPage.verifyChevron('Fee');
  await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();
});

Then('I fill Surplus Line Tax chevron and save for later', async function (this: CustomWorld) {
  if (!this.newPolicyPage) {
    throw new Error('PolicyPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.renewalPoliciesPage) {
    throw new Error('RenewalPoliciesPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.policyNumber) {
    throw new Error('PolicyNumber is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.newPolicyPage.navigateToPolicyStage('Policy');
  await this.renewalPoliciesPage.clickOnPremiumSaveButton();
  await this.newPolicyPage.navigateToPolicyStage('Surplus Line Tax');
  await this.newPolicyPage.fillSurplusTaxDetails('Invoice Total', 'AK Filing Fee');
  await this.newPolicyPage.clickSaveForLaterButton();
  await this.newPolicyPage.verifyPolicyPage(this.policyNumber);

  await this.newPolicyPage.clickEditPolicyButton();
  await this.newPolicyPage.verifyChevron('Surplus Line Tax');
  await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();
  await this.renewalPoliciesPage.waitUntilSyncWithNX();
});

Then('I fill Agency Commissions chevron and save for later', async function (this: CustomWorld) {
  if (!this.newPolicyPage) {
    throw new Error('PolicyPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.renewalPoliciesPage) {
    throw new Error('RenewalPoliciesPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.policyNumber) {
    throw new Error('PolicyNumber is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.newPolicyPage.verifyChevron('Agency Commissions');
  await this.newPolicyPage.clickSaveForLaterButton();
  await this.newPolicyPage.verifyPolicyPage(this.policyNumber);

  await this.newPolicyPage.clickEditPolicyButton();
  await this.newPolicyPage.verifyChevron('Agency Commissions');
  await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();
});

Then('I fill Other Commissions chevron and save for later', async function (this: CustomWorld) {
  if (!this.newPolicyPage) {
    throw new Error('PolicyPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.renewalPoliciesPage) {
    throw new Error('RenewalPoliciesPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.policyNumber) {
    throw new Error('PolicyNumber is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.newPolicyPage.fillOtherCommissionsDetails();
  await this.newPolicyPage.clickSaveForLaterButton();
  await this.newPolicyPage.verifyPolicyPage(this.policyNumber);

  await this.newPolicyPage.clickEditPolicyButton();
  await this.newPolicyPage.verifyChevron('Other Commissions');
  await this.renewalPoliciesPage.clickOnEditPolicyChevronNextButton();
});

Then('I fill Summary chevron and finalize the policy', async function (this: CustomWorld) {
  if (!this.newPolicyPage) {
    throw new Error('PolicyPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.renewalPoliciesPage) {
    throw new Error('RenewalPoliciesPage is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  if (!this.policyNumber) {
    throw new Error('PolicyNumber is undefined. The Playwright context was not initialized. Make sure hooks.ts is required and Before hook runs.');
  }
  await this.newPolicyPage.verifyChevron('Summary');
  await this.newPolicyPage.clickSaveForLaterButton();
  await this.newPolicyPage.verifyPolicyPage(this.policyNumber);

  await this.newPolicyPage.clickEditPolicyButton();
  await this.newPolicyPage.verifyChevron('Summary');
  await this.renewalPoliciesPage.clickOnFinalizePolicyButton();
  await this.page?.waitForTimeout(10000);
  await this.newPolicyPage.validatePendingPolicyStatus('Bound');
})


 