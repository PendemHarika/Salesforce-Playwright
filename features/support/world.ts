import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, Page, chromium } from 'playwright';
import { HomePage } from '../../pages/HomePage';
import { AccountPage } from '../../pages/AccountPage';
import { OpportunityPage } from '../../pages/OpportunityPage';
import { NdaPage } from '../../pages/NdaPage';
import { NbilPage } from '../../pages/NbilPage';
import { ManageAssignments } from '../../pages/ManageAssignments';
import { LoginPage } from '../../pages/LoginPage';
import { NBILTemplatePage } from '../../pages/NBILTemplatePage';
import { CoveragePage } from '../../pages/CoveragePage';
import { CommonPage } from '../../pages/CommonPage';
import { NewPolicyPage } from '../../pages/NewPolicyPage';
import { RenewalPoliciesPage } from '../../pages/RenewalPoliciesPage';



export class CustomWorld extends World {
  [x: string]: any;
  browser?: Browser;
  context?: import('playwright').BrowserContext;
  page?: Page;
  newPage?: Page;
  loginPage?: LoginPage;
  homePage?: HomePage;
  accountPage?: AccountPage;
  opportunityPage?: OpportunityPage;
  manageAssignments?: ManageAssignments;
  ndaPage?: NdaPage;
  nbilPage?: NbilPage;
  nbilTemplatePage?: NBILTemplatePage;
  coveragePage?: CoveragePage;
  commonPage?: CommonPage;
  newPolicyPage?: NewPolicyPage;  
  renewalPoliciesPage?: RenewalPoliciesPage;

  // Add scenario parameter properties for template validation

  constructor(options: IWorldOptions) {
    super(options);
  }
  // No close() method needed; hooks manage browser/context

  async close() {
    if (this.page) await this.page.close();
    if (this.browser) await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);