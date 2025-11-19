import { Page ,Locator} from 'playwright';
import { WebUserActions } from '../utils/webUserActions';
import locators from '../locators/locators.json';
import { th } from '@faker-js/faker/.';


export class ManageAssignments {

    private page: Page;
    
    constructor(page: Page) {
    this.page = page;
    }

    private get serviceLeadPersonName() : Locator{
        return this.page.locator(locators.ManageAssignments.serviceLeadPersonName);
    }

    private get allocationBox() : Locator{
        return this.page.locator(locators.ManageAssignments.allocationBoxs);
    }

    private get addAssignmentButton() : Locator{
        return this.page.locator(locators.ManageAssignments.addAssignmentButton);
    }
    private get assignmentPersonRow() : Locator{
        return this.page.locator(locators.ManageAssignments.assignmentPersonRow);
    }
    private get personNameInList() : Locator{
        return this.page.locator(locators.ManageAssignments.personNameInList);
    }
    private get serviceLeadCheckBox() : Locator{
        return this.page.locator(locators.ManageAssignments.newServiceLeadCheckBox);
    }

    private  get primaryProducerAllocationInput() : Locator{
        return this.page.locator(locators.ManageAssignments.primaryProducerAllocationInput).first();
    }

    /**
     * Adds or updates a service lead assignment with allocation.
     * If the service lead already exists, updates the allocation.
     * Otherwise, adds a new assignment and sets it as service lead.
     * 
     * @param {string} serviceLead - Name of the service lead person
     * @param {string} allocation - Allocation value to set
     * @returns {Promise<void>} A promise that resolves when the operation completes
     */
    async addOpportunityAssignments(serviceLead:string,allocation:string) : Promise<void> {
        let serviceLeadVisibility = await this.serviceLeadPersonName.isVisible();
        let serviceLeadName ;
        console.log("Service Lead Visibility is "+serviceLeadVisibility);
        if(serviceLeadVisibility){
            console.log("Service Lead Exists");
            serviceLeadName = await WebUserActions.getTextForElement("Service Lead Person Name",this.serviceLeadPersonName);
            if (serviceLead === serviceLeadName){
                await this.primaryProducerAllocationInput.first().waitFor({state : "visible"});
                await WebUserActions.sendText("Primary Producer Allocation TextBox",this.primaryProducerAllocationInput.first(),allocation);
            }
        }else if(serviceLeadName === null || serviceLeadName === undefined || serviceLeadName !== serviceLead || serviceLeadVisibility===false){ 
            console.log("Adding Service Lead");
            await WebUserActions.clickOnElement("Add Assignment Button",this.addAssignmentButton);
            await this.assignmentPersonRow.waitFor({state : "visible"});
            await WebUserActions.clickOnElement("Add Assignment Button",this.assignmentPersonRow);
            await WebUserActions.sendText("Add Assignment Button",this.assignmentPersonRow,serviceLead);
            await WebUserActions.clickOnElement("personNameInList",this.personNameInList);
            await WebUserActions.clickOnElement("Service LeadCheckBox",this.serviceLeadCheckBox);
            await WebUserActions.waitForVisible("Primary Producer Allocation TextBox",this.primaryProducerAllocationInput.first());
            await WebUserActions.sendText("Primary Producer Allocation TextBox",this.primaryProducerAllocationInput.first(),allocation);
        }
    }

    private get opportunitySaveAndCloseButton() : Locator{
        return this.page.locator("//button[contains(text(),'Save')]");
    }

    /**
     * Clicks on the Opportunity Save and Close button to save assignments and close the dialog.
     * 
     * @returns {Promise<void>} A promise that resolves after the click action completes
     */
    async clickOnOpportunitySaveAndCloseButton(): Promise<void>{
        await WebUserActions.clickOnElement("SaveAndClose Button",this.opportunitySaveAndCloseButton);
    }

    async fillPrimaryProducerAllocation(allocation: string) {
        const producerAllocationInput = this.page.locator(locators.ManageAssignments.primaryProducerAllocationInput);
        await WebUserActions.waitForVisible('Producer Allocation Textbox', producerAllocationInput);
        await WebUserActions.clearInput('Producer Allocation Textbox', producerAllocationInput);
        await WebUserActions.sendText('Producer Allocation Textbox', producerAllocationInput, allocation);
        console.log('Rollover assignments details added');
    }
}