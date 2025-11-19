import { test, expect } from  '../pages/pageObjectManager.ts';
import { RandomDataGenerator } from '../utils/randomDataGenerator.ts';
import { TestConfig } from '../test.config.ts';
import { HomePage } from '../pages/HomePage.ts';
import { stat } from 'fs';
import { AccountPage } from '../pages/AccountPage.ts';
import { LoginPage } from '../pages/LoginPage.ts';
import {OpportunityPage} from '../pages/OpportunityPage.ts';
import { NdaPage } from '../pages/NdaPage.ts';
import { NbilPage } from '../pages/NbilPage.ts';
import { ManageAssignments } from '../pages/ManageAssignments.ts';

   
test.use({
  actionTimeout: 2000000 //set timeout to 10 seconds for all actions in test
});

const config = new TestConfig();
const validUsername = config.email;
const validPassword = config.password;
const appUrl = config.appUrl;
const appName = config.appName;
const clientName = config.clientName;

let newTabPage: any; // type: Page
let opportunityPage: OpportunityPage;
let accountPage: AccountPage;

test.beforeEach(async ({  loginPage, homePage }) => {
    console.log('Step1 : Log in to sf with valid credentials');
    await loginPage.gotoLoginPage(appUrl);
    await loginPage.loginWithValidCredentials(validUsername, validPassword);
    await homePage.selectSettings();
    
});

test("TC_012_New Opportunity NDA- Reps & Warranties", async({homePage ,accountPage,opportunityPage,ndaPage}) => {
    console.log('Step2 : Log in with Tl Team User');//always use amy wright for tl test cases
    newTabPage = await homePage.openSetupTab();//need to be reviewed for right approach
    await homePage.searchTLUser('Amy Wright');
    await homePage.switchToUser();

    await homePage.selectApplication(appName);
    await homePage.closeAllTabs();

    opportunityPage = new OpportunityPage(newTabPage);
    accountPage = new AccountPage(newTabPage);
    ndaPage= new NdaPage(newTabPage);
    
    
    console.log("Step3 : Select client account from List and verify client record type.");
    await homePage.navigateToAccountsTab();
    await homePage.searchAndSelectClientFromList(clientName);
    await accountPage.validateClientRecordType();

    console.log("Step4 : Create a New Opportunity and Validate the stage as Intake");
    await opportunityPage.createNewOpportunity("Reps & Warranties","Buyer-side R&W");
    await opportunityPage.clickOnSaveButton();
    await ndaPage.validateIntakeStage();

    console.log("Step5 : Submitting New NDA Request");
    await opportunityPage.clickOnNewNDAButton();
    await ndaPage.ndaCarrierSelection("Chubb");
    await ndaPage.sendNDAOrNBILEmail("Please find attached the NDA and joinder for the captioned account and return a signed copy at your earliest convenience.Test");
    
    console.log("Step6 : Validate NDA request success Message");
    await ndaPage.vaidateNDANBILSuccessMessage("NDA");
    await ndaPage.closeSuccessWindow();

    console.log("Step7 : Validate stage after NDA submission and validate email sent and file ");
    await opportunityPage.validateStageAfterNDAOrNbil();
    await opportunityPage.navigateToActivityTab();
    await opportunityPage.validateUploadedFile();
});

test("TC_013_New Opportunity --- NDA- Tax Liability", async({homePage ,accountPage,opportunityPage,ndaPage}) => {
    console.log('Step2 : Log in with Tl Team User');//always use amy wright for tl test cases
    newTabPage = await homePage.openSetupTab();//need to be reviewed for right approach
    await homePage.searchTLUser('Amy Wright');
    await homePage.switchToUser();

    await homePage.selectApplication(appName);
    await homePage.closeAllTabs();

    opportunityPage = new OpportunityPage(newTabPage);
    accountPage = new AccountPage(newTabPage);
    ndaPage= new NdaPage(newTabPage);
    
    console.log("Step3 : Select client account from List and verify client record type.");
    await homePage.navigateToAccountsTab();
    await homePage.searchAndSelectClientFromList(clientName);
    await accountPage.validateClientRecordType();

    console.log("Step4 : Create a New Opportunity and Validate the stage as Intake");
    await opportunityPage.createNewOpportunity("Tax Liability","Tax Credit");
    await opportunityPage.clickOnSaveButton();
    await ndaPage.validateIntakeStage();  

    console.log("Step5 : Submitting New NDA Request");
    await opportunityPage.clickOnNewNDAButton();
    await ndaPage.ndaCarrierSelection("Ambridge");//pass only valid carrier email id's
    await ndaPage.sendNDAOrNBILEmail("Please find attached the NDA and joinder for the captioned account and return a signed copy at your earliest convenience.Test");
    
    console.log("Step6 : Validate NDA request success Message");
    await ndaPage.vaidateNDANBILSuccessMessage("NDA");
    await ndaPage.closeSuccessWindow();
    
    console.log("Step7 : Validate stage after NDA submission and validate email sent and file ");
    await opportunityPage.validateStageAfterNDAOrNbil();
    await opportunityPage.navigateToActivityTab();
    await opportunityPage.validateUploadedFile();
});

test("TC_014_New Opportunity --- NDA- Contingent Liability", async({homePage ,accountPage,opportunityPage,ndaPage}) => {
    console.log('Step2 : Log in with Tl Team User');//always use amy wright for tl test cases
    newTabPage = await homePage.openSetupTab();//need to be reviewed for right approach
    await homePage.searchTLUser('Amy Wright');
    await homePage.switchToUser();

    await homePage.selectApplication(appName);
    await homePage.closeAllTabs();

    opportunityPage = new OpportunityPage(newTabPage);
    accountPage = new AccountPage(newTabPage);
    ndaPage= new NdaPage(newTabPage);
    
    console.log("Step3 : Select client account from List and verify client record type.");
    await homePage.navigateToAccountsTab();
    await homePage.searchAndSelectClientFromList(clientName);
    await accountPage.validateClientRecordType();

    console.log("Step4 : Create a New Opportunity and Validate the stage as Intake");
    await opportunityPage.createNewOpportunity("Contingent Liability","Contingent Portfolio");
    await opportunityPage.clickOnSaveButton();
    await ndaPage.validateIntakeStage();  

    console.log("Step5 : Submitting New NDA Request");
    await opportunityPage.clickOnNewNDAButton();
    await ndaPage.ndaCarrierSelection("Chubb");
    await ndaPage.sendNDAOrNBILEmail("Please find attached the NDA and joinder for the captioned account and return a signed copy at your earliest convenience.Test");
    
    console.log("Step6 : Validate NDA request success Message");
    await ndaPage.vaidateNDANBILSuccessMessage("NDA");
    await ndaPage.closeSuccessWindow();
    
    console.log("Step7 : Validate stage after NDA submission and validate email sent and file ");
    await opportunityPage.validateStageAfterNDAOrNbil();
    await opportunityPage.navigateToActivityTab();
    await opportunityPage.validateUploadedFile();
});
