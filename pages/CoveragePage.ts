import { Page } from 'playwright';
import { Locator } from 'playwright';
import { Logger } from '../utils/logger';
import { WebUserActions } from '../utils/webUserActions';
import locators from '../locators/locators.json';

export class CoveragePage {

    private page: Page;   

    constructor(page: Page) {
        this.page = page;
    }
 
    private get coverageBuilderHeader(): Locator {
        return this.page.locator(locators.CoveragePage.coverageBuilderHeader);
    }
    
    private get coverageNewButton(): Locator {
        return this.page.locator(locators.CoveragePage.coverageNewButton);
    }

    private get coverageCloseButton(): Locator {
        return this.page.locator(locators.CoveragePage.coverageCloseButton);
    }

    private get selectLinesOfCoverageValue():Locator{
        return this.page.locator(locators.CoveragePage.selectLinesOfCoverageValue);
    }

    private standaloneCoverageType(selectedCoverage :string): Locator {
        const xpath = WebUserActions.getDynamicLocator(locators.CoveragePage.standaloneCoverageType, selectedCoverage);
        return this.page.locator(xpath);
    }

    private get frontRowButton():Locator{
        return this.page.locator(locators.CoveragePage.frontRowButton);
    }

    private selectedCoverages(coverageValue:string):Locator{
        const xpath = WebUserActions.getDynamicLocator(locators.CoveragePage.selectedCoverages, coverageValue);
        return this.page.locator(xpath);
    }

    private get confirmButton():Locator{
        return this.page.locator(locators.CoveragePage.confirmButton);
    }

    private lineOfCoveragesHeader(): Locator {      
        return this.page.locator(locators.CoveragePage.lineOfCoveragesHeader);
    }

    private selectedLineOfCoveragesValue(coverageValue:string):Locator{
        const xpath = WebUserActions.getDynamicLocator(locators.CoveragePage.selectedLineOfCoveragesValue, coverageValue);
        return this.page.locator(xpath);
    }

    /**
     * Creates a new coverage by interacting with the Coverage Builder UI.
     * Selects the coverage type, confirms, and closes the coverage window.
     * Waits for all relevant UI elements to be visible before proceeding.
     * @param {string} coverageValue - The coverage type to select and add.
     * @returns {Promise<void>} Resolves when the new coverage is added and window is closed.
     */
    async createNewCoverage(coverageValue: string): Promise<void> {
        await this.coverageBuilderHeader.waitFor({ state: 'visible' });
        Logger.info("CoveragePage: Coverage Builder page is displayed.");
        await WebUserActions.clickOnElement("New Coverage Button", this.coverageNewButton);
        // const lineOfCoverageText = await WebUserActions.getTextForElement("line ofcoverage Value",this.selectLinesOfCoverageValue);
        // Logger.info("Line of Coverage value is: "+lineOfCoverageText);
        //need to add validation for default tl coverage type
        await WebUserActions.clickOnElement("Standalone Coverage Type", this.standaloneCoverageType(coverageValue));
        await WebUserActions.clickOnElement("Front Row Button", this.frontRowButton);
        await this.selectedCoverages(coverageValue).waitFor({state:"visible"});
        await WebUserActions.clickOnElement("Confirm Button", this.confirmButton);
        await this.lineOfCoveragesHeader().waitFor({state:"visible"});
        await this.selectedLineOfCoveragesValue(coverageValue).waitFor({state:"visible"});
        await WebUserActions.clickOnElement("Coverage Close Button", this.coverageCloseButton);
        Logger.info("New Coverages added and closed the coverage window.");  
    }
    
    async verifyCoverages() {
        await WebUserActions.clickOnElement("Actions dropdown", this.page.locator(locators.OpportunityPage.showMoreActionsDropDown));
        await WebUserActions.clickOnElement("Coverage builder option", this.page.locator(locators.OpportunityPage.coverageBuilderOption));
        const coverageCheckLocator = this.page.locator(locators.CoveragePage.coverageCheck);

        let isCoverageVisible = false;
        try {
            await WebUserActions.waitForVisible("Coverage", this.page.locator(locators.CoveragePage.coverageCheck), 10000);
            isCoverageVisible = true;
            Logger.info("existing coverage found.");
        } catch (error) {
            Logger.info("Coverage not visible — need to add new coverage.");
        }
        if (isCoverageVisible) {
            Logger.info("Existing coverages detected — clicking Close button instead.");
            await WebUserActions.clickOnElement("Close Button", this.page.locator(locators.CoveragePage.coverageCloseButton));
        } else {
            Logger.info("No coverage found — creating new coverage now...");
            await this.createNewCoverage("Reps & Warranties |TL");
        }
    }

    

}