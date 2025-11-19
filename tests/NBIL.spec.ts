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

test("TC_015_New Opportunity --- NBIL - Reps & Warranties - Buyer-side R&W - NBIL Request - No NDA, Joint NDA and NBIL Request and NBIL Request - Pre-Cleared NDA", async({homePage ,accountPage,opportunityPage,ndaPage,nbilPage,manageAssignments}) => {
    console.log('Step2 : Log in with Tl Team User');
    newTabPage = await homePage.openSetupTab();
    await homePage.searchTLUser('Amy Wright');
    await homePage.switchToUser();

    opportunityPage = new OpportunityPage(newTabPage);
    accountPage = new AccountPage(newTabPage);
    ndaPage= new NdaPage(newTabPage);
    manageAssignments = new ManageAssignments(newTabPage);
    await homePage.selectApplication(appName);
    await homePage.closeAllTabs();

    console.log("Step3 : Select client account from List and verify client record type.");
    await homePage.navigateToAccountsTab();
    await homePage.searchAndSelectClientFromList(clientName);
    await accountPage.validateClientRecordType();

    console.log("Step4 : Create a New Opportunity and Validate the stage as Intakeand add persons in assignment");
    await opportunityPage.createNewOpportunity("Reps & Warranties","Buyer-side R&W");
    await opportunityPage.clickOnSaveButton();
    await ndaPage.validateIntakeStage();
    
    console.log("Step5 : Allocating 100% to primary producer.");
    await opportunityPage.clickOnShowMoreActionsDropDown();
    await opportunityPage.clickOnManageOpportunityAssignment();
    await manageAssignments.addAssignmnets("Patricia Urraca");
    await manageAssignments.clickOnSaveAndCloseButton();
    
    
    console.log("Step5 : Filling Nbil Mandatory Fields");
    await nbilPage.fillNBILMandatoryFields("1000","100000","Test","10 AM","NSI","Akin Gump","100");

    console.log("Step6 : Submitting New NBIL Request with template as NBIL Request- No NDA and Validate NBIL request success Message");
    await opportunityPage.clickOnNewNDAButton();
    await nbilPage.nbilCarrierSelection("Chubb","NBIL Request- No NDA")
    await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
    await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
    await ndaPage.closeSuccessWindow();

    console.log("Step7 : Submitting New NBIL Request with template as Joint NDA and NBIL Request and Validate NBIL request success Message");
    await opportunityPage.clickOnNewNDAButton();
    await nbilPage.nbilCarrierSelection("Chubb","Joint NDA and NBIL Request")
    await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
    await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
    await ndaPage.closeSuccessWindow();

    console.log("Step8 : Submitting New NBIL Request with template as NBIL Request- Pre-Cleared NDA and Validate NBIL request success Message");
    await opportunityPage.clickOnNewNDAButton();
    await nbilPage.nbilCarrierSelection("Chubb","NBIL Request- Pre-Cleared NDA")
    await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
    await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
    await ndaPage.closeSuccessWindow();

    console.log("Step9 : Validate stage after NBIL submission and validate email sent and file ");
    await opportunityPage.validateStageAfterNDAOrNbil();
    await opportunityPage.navigateToActivityTab();
    await opportunityPage.validateUploadedFile();
});

    test("TC_016_New Opportunity --- NBIL - Reps & Warranties - Buyer-side Secondaries R&W - NBIL Request - No NDA, Joint NDA and NBIL Request and NBIL Request - Pre-Cleared NDA", async({homePage ,accountPage,opportunityPage,ndaPage,nbilPage}) => {
        console.log('Step2 : Log in with Tl Team User');
        newTabPage = await homePage.openSetupTab();
        await homePage.searchTLUser('Amy Wright');
        await homePage.switchToUser();

        opportunityPage = new OpportunityPage(newTabPage);
        accountPage = new AccountPage(newTabPage);
        ndaPage= new NdaPage(newTabPage);

        await homePage.selectApplication(appName);
        await homePage.closeAllTabs();

        console.log("Step3 : Select client account from List and verify client record type.");
        await homePage.navigateToAccountsTab();
        await homePage.searchAndSelectClientFromList(clientName);
        await accountPage.validateClientRecordType();

        console.log("Step4 : Create a New Opportunity and Validate the stage as Intake");
        await opportunityPage.createNewOpportunity("Reps & Warranties","Buyer-side Secondaries R&W");
        await opportunityPage.clickOnSaveButton();
        await ndaPage.validateIntakeStage();

        console.log("Step5 : Filling Nbil Mandatory Fields");
        await nbilPage.fillNBILMandatoryFields("1000","100000","Test","10 AM","NSI","Akin Gump","100");

        console.log("Step6 : Submitting New NBIL Request with template as NBIL Request- No NDA and Validate NBIL request success Message");
        await opportunityPage.clickOnNewNDAButton();
        await nbilPage.nbilCarrierSelection("Chubb","NBIL Request- No NDA")
        await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
        await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
        await ndaPage.closeSuccessWindow();

        console.log("Step7 : Submitting New NBIL Request with template as Joint NDA and NBIL Request and Validate NBIL request success Message");
        await opportunityPage.clickOnNewNDAButton();
        await nbilPage.nbilCarrierSelection("Chubb","Joint NDA and NBIL Request")
        await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
        await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
        await ndaPage.closeSuccessWindow();

        console.log("Step8 : Submitting New NBIL Request with template as NBIL Request- Pre-Cleared NDA and Validate NBIL request success Message");
        await opportunityPage.clickOnNewNDAButton();
        await nbilPage.nbilCarrierSelection("Chubb","NBIL Request- Pre-Cleared NDA")
        await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
        await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
        await ndaPage.closeSuccessWindow();

        console.log("Step9 : Validate stage after NBIL submission and validate email sent and file ");
        await opportunityPage.validateStageAfterNDAOrNbil();
        await opportunityPage.navigateToActivityTab();
        await opportunityPage.validateUploadedFile();
    });


    test("TC_017_New Opportunity --- NBIL - Reps & Warranties - Seller-side R&W - NBIL Request - No NDA, Joint NDA and NBIL Request and NBIL Request - Pre-Cleared NDA", async({homePage ,accountPage,opportunityPage,ndaPage,nbilPage}) => {
    console.log('Step2 : Log in with Tl Team User');
    newTabPage = await homePage.openSetupTab();
    await homePage.searchTLUser('Amy Wright');
    await homePage.switchToUser();

    opportunityPage = new OpportunityPage(newTabPage);
    accountPage = new AccountPage(newTabPage);
    ndaPage= new NdaPage(newTabPage);

    await homePage.selectApplication(appName);
    await homePage.closeAllTabs();

    console.log("Step3 : Select client account from List and verify client record type.");
    await homePage.navigateToAccountsTab();
    await homePage.searchAndSelectClientFromList(clientName);
    await accountPage.validateClientRecordType();

    console.log("Step4 : Create a New Opportunity and Validate the stage as Intake");
    await opportunityPage.createNewOpportunity("Reps & Warranties","Seller-side R&W");
    await opportunityPage.clickOnSaveButton();
    await ndaPage.validateIntakeStage();

    console.log("Step5 : Filling Nbil Mandatory Fields");
    await nbilPage.fillNBILMandatoryFields("1000","100000","Test","10 AM","NSI","Akin Gump","100");

    console.log("Step6 : Submitting New NBIL Request with template as NBIL Request- No NDA and Validate NBIL request success Message");
    await opportunityPage.clickOnNewNDAButton();
    await nbilPage.nbilCarrierSelection("Chubb","NBIL Request- No NDA")
    await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
    await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
    await ndaPage.closeSuccessWindow();

    console.log("Step7 : Submitting New NBIL Request with template as Joint NDA and NBIL Request and Validate NBIL request success Message");
    await opportunityPage.clickOnNewNDAButton();
    await nbilPage.nbilCarrierSelection("Chubb","Joint NDA and NBIL Request")
    await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
    await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
    await ndaPage.closeSuccessWindow();

    console.log("Step8 : Submitting New NBIL Request with template as NBIL Request- Pre-Cleared NDA and Validate NBIL request success Message");
    await opportunityPage.clickOnNewNDAButton();
    await nbilPage.nbilCarrierSelection("Chubb","NBIL Request- Pre-Cleared NDA")
    await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
    await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
    await ndaPage.closeSuccessWindow();

    console.log("Step9 : Validate stage after NBIL submission and validate email sent and file ");
    await opportunityPage.validateStageAfterNDAOrNbil();
    await opportunityPage.navigateToActivityTab();
    await opportunityPage.validateUploadedFile();
});

    test("TC_018_New Opportunity --- NBIL- Tax Liability - Tax Credit- NBIL Request - No NDA, Joint NDA and NBIL Request and NBIL Request - Pre-Cleared NDA", async({homePage ,accountPage,opportunityPage,ndaPage,nbilPage}) => {
    console.log('Step2 : Log in with Tl Team User');
    newTabPage = await homePage.openSetupTab();
    await homePage.searchTLUser('Amy Wright');
    await homePage.switchToUser();

    opportunityPage = new OpportunityPage(newTabPage);
    accountPage = new AccountPage(newTabPage);
    ndaPage= new NdaPage(newTabPage);

    await homePage.selectApplication(appName);
    await homePage.closeAllTabs();

    console.log("Step3 : Select client account from List and verify client record type.");
    await homePage.navigateToAccountsTab();
    await homePage.searchAndSelectClientFromList(clientName);
    await accountPage.validateClientRecordType();

    console.log("Step4 : Create a New Opportunity and Validate the stage as Intake");
    await opportunityPage.createNewOpportunity("Tax Liability","Tax Credit");
    await opportunityPage.clickOnSaveButton();
    await ndaPage.validateIntakeStage();

    console.log("Step5 : Filling Nbil Mandatory Fields");
    await nbilPage.fillNBILMandatoryFields("1000","100000","Test","10 AM","NSI","Akin Gump","100");

    console.log("Step6 : Submitting New NBIL Request with template as NBIL Request- No NDA and Validate NBIL request success Message");
    await opportunityPage.clickOnNewNDAButton();
    await nbilPage.nbilCarrierSelection("Ambridge","NBIL Request- No NDA")
    await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
    await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
    await ndaPage.closeSuccessWindow();

    console.log("Step7 : Submitting New NBIL Request with template as Joint NDA and NBIL Request and Validate NBIL request success Message");
    await opportunityPage.clickOnNewNDAButton();
    await nbilPage.nbilCarrierSelection("Ambridge","Joint NDA and NBIL Request")
    await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
    await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
    await ndaPage.closeSuccessWindow();

    console.log("Step8 : Submitting New NBIL Request with template as NBIL Request- Pre-Cleared NDA and Validate NBIL request success Message");
    await opportunityPage.clickOnNewNDAButton();
    await nbilPage.nbilCarrierSelection("Ambridge","NBIL Request- Pre-Cleared NDA")
    await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
    await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
    await ndaPage.closeSuccessWindow();

    console.log("Step9 : Validate stage after NBIL submission and validate email sent and file ");
    await opportunityPage.validateStageAfterNDAOrNbil();
    await opportunityPage.navigateToActivityTab();
    await opportunityPage.validateUploadedFile();
});

    test("TC_019_New Opportunity --- NBIL- Tax Liability - M&A - NBIL Request - No NDA , Joint NDA and NBIL Request and NBIL Request - Pre-Cleared NDA", async({homePage ,accountPage,opportunityPage,ndaPage,nbilPage}) => {
    console.log('Step2 : Log in with Tl Team User');
    newTabPage = await homePage.openSetupTab();
    await homePage.searchTLUser('Amy Wright');
    await homePage.switchToUser();

    opportunityPage = new OpportunityPage(newTabPage);
    accountPage = new AccountPage(newTabPage);
    ndaPage= new NdaPage(newTabPage);

    await homePage.selectApplication(appName);
    await homePage.closeAllTabs();

    console.log("Step3 : Select client account from List and verify client record type.");
    await homePage.navigateToAccountsTab();
    await homePage.searchAndSelectClientFromList(clientName);
    await accountPage.validateClientRecordType();

    console.log("Step4 : Create a New Opportunity and Validate the stage as Intake");
    await opportunityPage.createNewOpportunity("Tax Liability","M&A");
    await opportunityPage.clickOnSaveButton();
    await ndaPage.validateIntakeStage();

    console.log("Step5 : Filling Nbil Mandatory Fields");
    await nbilPage.fillNBILMandatoryFields("1000","100000","Test","10 AM","NSI","Akin Gump","100");

    console.log("Step6 : Submitting New NBIL Request with template as NBIL Request- No NDA and Validate NBIL request success Message");
    await opportunityPage.clickOnNewNDAButton();
    await nbilPage.nbilCarrierSelection("Ambridge","NBIL Request- No NDA")
    await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
    await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
    await ndaPage.closeSuccessWindow();

    console.log("Step7 : Submitting New NBIL Request with template as Joint NDA and NBIL Request and Validate NBIL request success Message");
    await opportunityPage.clickOnNewNDAButton();
    await nbilPage.nbilCarrierSelection("Ambridge","Joint NDA and NBIL Request")
    await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
    await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
    await ndaPage.closeSuccessWindow();

    console.log("Step8 : Submitting New NBIL Request with template as NBIL Request- Pre-Cleared NDA and Validate NBIL request success Message");
    await opportunityPage.clickOnNewNDAButton();
    await nbilPage.nbilCarrierSelection("Ambridge","NBIL Request- Pre-Cleared NDA")
    await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
    await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
    await ndaPage.closeSuccessWindow();

    console.log("Step9 : Validate stage after NBIL submission and validate email sent and file ");
    await opportunityPage.validateStageAfterNDAOrNbil();
    await opportunityPage.navigateToActivityTab();
    await opportunityPage.validateUploadedFile();
});

    test("TC_020_New Opportunity --- NBIL- Tax Liability - Other Tax  - NBIL Request - No NDA , Joint NDA and NBIL Request and NBIL Request - Pre-Cleared NDA", async({homePage ,accountPage,opportunityPage,ndaPage,nbilPage}) => {
    console.log('Step2 : Log in with Tl Team User');
    newTabPage = await homePage.openSetupTab();
    await homePage.searchTLUser('Amy Wright');
    await homePage.switchToUser();

    opportunityPage = new OpportunityPage(newTabPage);
    accountPage = new AccountPage(newTabPage);
    ndaPage= new NdaPage(newTabPage);

    await homePage.selectApplication(appName);
    await homePage.closeAllTabs();

    console.log("Step3 : Select client account from List and verify client record type.");
    await homePage.navigateToAccountsTab();
    await homePage.searchAndSelectClientFromList(clientName);
    await accountPage.validateClientRecordType();

    console.log("Step4 : Create a New Opportunity and Validate the stage as Intake");
    await opportunityPage.createNewOpportunity("Tax Liability","Other Tax");
    await opportunityPage.clickOnSaveButton();
    await ndaPage.validateIntakeStage();

    console.log("Step5 : Filling Nbil Mandatory Fields");
    await nbilPage.fillNBILMandatoryFields("1000","100000","Test","10 AM","NSI","Akin Gump","100");

    console.log("Step6 : Submitting New NBIL Request with template as NBIL Request- No NDA and Validate NBIL request success Message");
    await opportunityPage.clickOnNewNDAButton();
    await nbilPage.nbilCarrierSelection("Ambridge","NBIL Request- No NDA")
    await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
    await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
    await ndaPage.closeSuccessWindow();

    console.log("Step7 : Submitting New NBIL Request with template as Joint NDA and NBIL Request and Validate NBIL request success Message");
    await opportunityPage.clickOnNewNDAButton();
    await nbilPage.nbilCarrierSelection("Ambridge","Joint NDA and NBIL Request")
    await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
    await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
    await ndaPage.closeSuccessWindow();

    console.log("Step8 : Submitting New NBIL Request with template as NBIL Request- Pre-Cleared NDA and Validate NBIL request success Message");
    await opportunityPage.clickOnNewNDAButton();
    await nbilPage.nbilCarrierSelection("Ambridge","NBIL Request- Pre-Cleared NDA")
    await ndaPage.sendNDAOrNBILEmail("Attached and below is a new buyer-side R&W insurance opportunity in connection with the contemplated acquisition by 1000 Miglia SRL123 of 600000. Test");
    await ndaPage.vaidateNDANBILSuccessMessage("NBIL");
    await ndaPage.closeSuccessWindow();

    console.log("Step9 : Validate stage after NBIL submission and validate email sent and file ");
    await opportunityPage.validateStageAfterNDAOrNbil();
    await opportunityPage.navigateToActivityTab();
    await opportunityPage.validateUploadedFile();
});