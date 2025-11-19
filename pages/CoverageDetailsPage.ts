import locators from '../locators/locators.json';
import { WebUserActions } from '../utils/webUserActions';

export class CoverageDetailsPage{
    
    private readonly page: any;  

    constructor(page:any) {
        this.page = page;
    }

    private get newLimitsButton() {
        return this.page.locator(locators.CoverageDetailsPage.newLimitsButton);
    }

    private get primaryExcessDropDown() {
        return this.page.locator(locators.CoverageDetailsPage.primaryExcessDropDown);
    }

    private get limitTypeDropDown() {
        return this.page.locator(locators.CoverageDetailsPage.limitTypeDropDown);
    }

    private get limitTypeDropDownValue() {
        return this.page.locator(locators.CoverageDetailsPage.limitTypeDropDownValue);
    }

    private get limitInputValue() {
        return this.page.locator(locators.CoverageDetailsPage.limitInputValue);
    }

    private get limitSaveButton() {
        return this.page.locator(locators.CoverageDetailsPage.limitSaveButton);
    }

    /**
     * Adds limit details for coverage by selecting primary/excess, limit type, and entering limit value.
     * Clicks through the UI elements to set the values and save.
     * @param {string} primaryExcess - The primary or excess value to select.
     * @param {string} limitType - The type of limit to select.
     * @param {string} limitValue - The value to enter for the limit.
     * @returns {Promise<void>} Resolves when the limit details are added and saved.
     */
    async addLimitsDetails(primaryExcess: string, limitType: string, limitValue: string) {
        await WebUserActions.clickOnElement("New Limits Button",this.newLimitsButton);
        await WebUserActions.clickOnElement("Primary/Excess DropDown",this.primaryExcessDropDown);
        await WebUserActions.clickOnElement(`Primary/Excess Value - ${primaryExcess}`,this.page.locator(`//span[@title='${primaryExcess}']`));
        await WebUserActions.clickOnElement("Limit Type DropDown",this.limitTypeDropDown);
        await WebUserActions.clickOnElement(`Limit Type Value - ${limitType}`,this.limitTypeDropDownValue);
        //await WebUserActions.sendText(this.limitInputValue, limitValue, "Limit Input Value");
        await WebUserActions.clickOnElement("Limit Save Button",this.limitSaveButton);
    }
}