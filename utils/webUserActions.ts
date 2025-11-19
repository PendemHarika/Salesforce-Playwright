import { Locator, FrameLocator, Page, BrowserContext, Frame } from 'playwright';
import { Logger } from './logger';

/**
 * WebUserActions: Reusable Playwright utility methods for web automation.
 * All methods accept locatorName (for logging), locator (Playwright Locator), and testData (if needed).
 * These methods are intended for use in POM page classes.
 */
export class WebUserActions {
  
  // ------------------------------
  // Wait Methods
  // ------------------------------

  /**
   * Wait for an element to be visible
   */
  // static async waitForVisible(locatorName: string, locator: Locator, timeout = 10000) : Promise<void>{
  //   try {
  //     console.log(`Waiting for ${locatorName} to be visible`);
  //     await locator.waitFor({ state: 'visible', timeout });
  //   } catch (error) {
  //     console.error(`Failed to wait for ${locatorName} to be visible`, error);
  //     throw error;
  //   }
  // }

  /**
   * Wait for an element to be hidden
   */
  static async waitForHidden(locatorName: string, locator: Locator, timeout = 5000) {
    try {
      console.log(`Waiting for ${locatorName} to be hidden`);
      await locator.waitFor({ state: 'hidden', timeout });
    } catch (error) {
      console.error(`Failed to wait for ${locatorName} to be hidden`, error);
      throw error;
    }
  }

  /**
   * Wait until an element is clickable (Visible and enabled)
   */
  static async waitUntilClickable(locator: Locator, timeout: number = 10000): Promise<void> {
    console.log(`Waiting until element is clickable: ${locator}`);
    
    await locator.waitFor({ state: 'attached', timeout });
    await locator.waitFor({ state: 'visible', timeout });

    const isEnabled = await locator.isEnabled();
    if (!isEnabled) {
      throw new Error('Element is not enabled and cannot be clicked');
    }

    console.log('✅ Element is now clickable');
  }

  // ------------------------------
  // UI Action Methods
  // ------------------------------

  /**
   * Send text to an input field
   */
  static async sendText(locatorName: string, locator: Locator, text: string) : Promise<void>{
    try {
      Logger.info(`Sending text '${text}' to ${locatorName}`);
      await WebUserActions.waitForVisible(locatorName, locator, 10000); // Wait for element to be visible
      await locator.clear();//needs to clear the text first
      await locator.fill(text,{timeout:2000});
      Logger.debug(`Sent text '${text}' to ${locatorName}`);
    } catch (error) {
      Logger.error(`Failed to send text to ${locatorName}: ${error}`);
      throw error;
    }
  }

  /**
   * Click on an element
   */
  static async clickOnElement(locatorName: string, locator: Locator) : Promise<void>{
    try {
      Logger.info(`Clicking on element ${locatorName}`);
      await WebUserActions.waitUntilClickable(locator); // Ensure element is clickable
      await locator.click();
      Logger.debug(`Clicked on element ${locatorName}`);
    } catch (error) {
      Logger.error(`Failed to click on element ${locatorName}: ${error}`);
      throw error;
    }
  }

  /**
   * Select a value from a dropdown
   */
  static async selectDropdown(locatorName: string, locator: Locator, optionValue: string): Promise<void> {
    try {
      console.log(`Selecting option '${optionValue}' from dropdown ${locatorName}`);
      await WebUserActions.waitForVisible(locatorName, locator, 10000); // Wait for element to be visible
      await locator.selectOption(optionValue);
    } catch (error) {
      console.error(`Failed to select option from dropdown ${locatorName}`, error);
      throw error;
    }
  }

  /**
   * Drag and drop from one element to another
   */
  static async dragAndDrop(sourceName: string, source: Locator, targetName: string, target: Locator) {
    try {
      console.log(`Dragging from ${sourceName} to ${targetName}`);
      await WebUserActions.waitForVisible(sourceName, source, 10000); // Wait for source to be visible
      await WebUserActions.waitForVisible(targetName, target, 10000); // Wait for target to be visible
      await source.dragTo(target);
    } catch (error) {
      console.error(`Failed to drag and drop from ${sourceName} to ${targetName}`, error);
      throw error;
    }
  }

  /**
   * Get text content from an element
   */
  static async getTextForElement(locatorName: string, locator: Locator): Promise<string> {
    try {
      console.log(`Getting text from ${locatorName}`);
      await WebUserActions.waitForVisible(locatorName, locator, 10000); // Wait for element to be visible
      //return await locator.textContent();
      return await locator.innerText();
    } catch (error) {
      console.error(`Failed to get text from ${locatorName}`, error);
      throw error;
    }
  }

  /**
   * Check if an element is visible
   */
  static async isVisible(locatorName: string, locator: Locator): Promise<boolean> {
    try {
      
      const visible = await locator.isVisible({timeout: 5000});
      console.log(`Element ${locatorName} is visible: ${visible}`);
      return visible;
    } catch (error) {
      console.error(`Failed to check visibility of ${locatorName}`, error);
      throw error;
    }
  }


  /**
   * Wait for an element to be visible
   */
  static async waitForVisible(locatorName: string, locator: Locator, timeout = 10000) {
    try {
      console.log(`Waiting for ${locatorName} to be visible`);
 
      await locator.waitFor({ state: 'visible', timeout });
 
    } catch (error) {
      console.error(`Failed to wait for ${locatorName} to be visible`, error);
      throw error;
    }
  }

  /**
   * Hover over an element
   */
  static async hover(locatorName: string, locator: Locator) {
    try {
      console.log(`Hovering over ${locatorName}`);
      await WebUserActions.waitForVisible(locatorName, locator, 10000); // Wait for element to be visible
      await locator.hover();
    } catch (error) {
      console.error(`Failed to hover over ${locatorName}`, error);
      throw error;
    }
  }

  /**
   * Double click on an element
   */
  static async doubleClick(locatorName: string, locator: Locator) {
    try {
      console.log(`Double clicking on ${locatorName}`);
      await WebUserActions.waitForVisible(locatorName, locator, 10000); // Wait for element to be visible
      await locator.dblclick();
    } catch (error) {
      console.error(`Failed to double click ${locatorName}`, error);
      throw error;
    }
  }

  /**
   * Clear input field
   */
  static async clearInput(locatorName: string, locator: Locator) {
    try {
      console.log(`Clearing input ${locatorName}`);
      await WebUserActions.waitForVisible(locatorName, locator, 10000); // Wait for element to be visible
      await locator.clear();
    } catch (error) {
      console.error(`Failed to clear input ${locatorName}`, error);
      throw error;
    }
  }

  /**
   * Get a list of elements and return their text contents
   */
  static async getListOfElementsText(locatorName: string, locator: Locator): Promise<string[]> {
    try {
      console.log(`Getting list of elements for ${locatorName}`);
      await WebUserActions.waitForVisible(locatorName, locator, 10000); // Wait for element to be visible
      const elements = await locator.elementHandles();
      const texts = await Promise.all(elements.map(async el => await el.textContent() || ''));
      return texts;
    } catch (error) {
      console.error(`Failed to get list of elements for ${locatorName}`, error);
      throw error;
    }
  }

  /**
   * Get a FrameLocator for interacting with elements inside an iframe.
   */
  static getFrameLocator(locatorName: string, frameLocator: FrameLocator): FrameLocator {
    try {
      console.log(`Getting frame locator: ${locatorName}`);
      return frameLocator;
    } catch (error) {
      console.error('Failed to get frame locator', error);
      throw error;
    }
  }

  /**
   * Switch to a new window (waits for new page)
   */
  static async switchToNewWindow(context: BrowserContext, actionToOpenNewWindow: () => Promise<void>): Promise<Page> {
    try {
      console.log('Waiting for new window/tab to open...');
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        actionToOpenNewWindow()
      ]);
      await newPage.waitForLoadState();
      console.log('Switched to new window/tab');
      return newPage;
    } catch (error) {
      console.error('Failed to switch to new window/tab', error);
      throw error;
    }
  }

  /**
   * Switch to a new tab (alias for switchToNewWindow)
   */
  static async switchToNewTab(context: BrowserContext, actionToOpenNewTab: () => Promise<void>): Promise<Page> {
    return this.switchToNewWindow(context, actionToOpenNewTab);
  }

  /**
   * Generates a dynamic locator string by replacing `{{value}}` in the template.
   */
  static getDynamicLocator(locatorTemplate: string, value: string): string { 
    const finalLocator = locatorTemplate.replace(/{{value}}/g, value); 
    console.log('Generated dynamic locator:', finalLocator);
    return finalLocator; 
  }

  /**
   * Switch to an iframe and return its Playwright Frame object
   */
  static async switchToIFrame(locatorName: string, page: Page, iframeSelector: string): Promise<Frame> {
    try {
      console.log(`Switching to iframe: ${locatorName} using selector: ${iframeSelector}`);
      const iframeElement = await page.waitForSelector(iframeSelector, { timeout: 20000 });
      const frame = await iframeElement.contentFrame();
      if (!frame) {
        throw new Error(`Unable to find frame for selector: ${iframeSelector}`);
      }
      console.log(`Switched to iframe: ${locatorName}`);
      return frame;
    } catch (error) {
      console.error(`Failed to switch to iframe: ${locatorName}`, error);
      throw error;
    }
  }

  /**
   * Pointing the cursor to the end of a text element
   */
  static async pointCursorToEnd(page: Page,locator:string){
     await page.locator(locator).evaluate((el: HTMLElement) => {
       const range = document.createRange();
       const sel = window.getSelection();
       range.selectNodeContents(el);
       range.collapse(false); // move to end
       sel?.removeAllRanges();
       sel?.addRange(range);
     });
  }
  
  /**
   * Selects an option from a long scrollable dropdown by searching and scrolling
   */
  static async selectFromScrollableDropdown(
  page: Page,
  dropdownLocator: Locator,
  optionsLocator: Locator,
  optionToSelect: string
) {
  // Step 1: Click dropdown to open & focus it
  await dropdownLocator.click();
  await page.waitForTimeout(300);
  await dropdownLocator.focus();
 
  // Step 2: Type first letter to jump to relevant section
  const firstLetter = optionToSelect.charAt(0).toLowerCase();
  await page.keyboard.press(firstLetter);
  await page.waitForTimeout(500);
 
  // Step 3: Check if the option is now visible
  let targetOption = optionsLocator.filter({ hasText: optionToSelect }).first();
  let isOptionVisible = await targetOption.isVisible();
 
  // Step 4: Scroll (ArrowDown) until found
  let scrollAttempts = 0;
  const maxScrollAttempts = 80;
 
  while (!isOptionVisible && scrollAttempts < maxScrollAttempts) {
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(150);
    isOptionVisible = await targetOption.isVisible();
    scrollAttempts++;
  }
 
  // Step 5: Click the matched option
  if (isOptionVisible) {
    await targetOption.click();
    console.log(`Selected option: ${optionToSelect}`);
  } else {
    throw new Error(`Option "${optionToSelect}" not found after ${scrollAttempts} scrolls.`);
  }
}

  static async scrollUntilElementVisible(
    page: Page,
    locator: Locator,
    maxScrolls: number = 10,
    scrollDelay: number = 500
  ): Promise<void> {
    for (let i = 0; i < maxScrolls; i++) {
      const isVisible = await locator.isVisible();
      if (isVisible) {
        Logger.info("Element became visible during scroll.");
        return;
      }
 
      Logger.info(`Scrolling attempt ${i + 1}`);
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight / 2); // Scroll half the viewport height
      });
      await page.waitForTimeout(scrollDelay);
    }
 
    throw new Error("Element not visible after scrolling attempts.");
  }
 
  /**
   * Clicks a dynamic element by replacing {{value}} in the locator string.
   */
  static async clickDynamicElement(
    value: string,
    locatorString: string,
    elementName: string,
    page: Page
  ) {
    try {
      // Replace {{value}} with the actual text
      const resolvedLocator = locatorString.replace(/{{value}}/g, value);
 
      Logger.info(`Attempting to click dynamic element: ${elementName} → ${resolvedLocator}`);
 
      // Create a Playwright locator directly from the string
      const element = page.locator(resolvedLocator);
 
      // Wait until visible and clickable
      await element.waitFor({ state: 'visible', timeout: 10000 });
      await element.click();
 
      Logger.info(`✅ Successfully clicked dynamic element: ${elementName} [${value}]`);
    } catch (error) {
      Logger.error(`❌ Failed to click dynamic element: ${elementName}. Error: ${error}`);
      throw new Error(`Unable to click on dynamic element: ${elementName} with value '${value}'`);
    }
  }
 
  static async selectDropDownOption(
    dropdownName: string,
    dropdownLocator: Locator,
    dropdownType: 'selectByValue' | 'selectByVisibleText' | 'selectByIndex',
    dropdownValue: string
  ): Promise<void> {
    Logger.info(`Selecting value from ${dropdownName}`);
 
    try {
      await WebUserActions.waitForVisible(dropdownName, dropdownLocator);
 
      switch (dropdownType) {
        case 'selectByValue':
          Logger.info(`Selecting dropdown value by value: ${dropdownValue}`);
          await dropdownLocator.selectOption({ value: dropdownValue });
          break;
 
        case 'selectByVisibleText':
          Logger.info(`Selecting dropdown value by visible text: ${dropdownValue}`);
          await dropdownLocator.selectOption({ label: dropdownValue });
          break;
 
        case 'selectByIndex':
          Logger.info(`Selecting dropdown value by index: ${dropdownValue}`);
          const index = parseInt(dropdownValue);
          const options = await dropdownLocator.locator('option').all();
          if (index < 0 || index >= options.length) {
            throw new Error(`Invalid dropdown index: ${index}. Dropdown only has ${options.length} options.`);
          }
          const value = await options[index].getAttribute('value');
          await dropdownLocator.selectOption({ value: value || '' });
          break;
 
        default:
          Logger.warn(`Invalid dropdown type provided for ${dropdownName}`);
          break;
      }
 
      Logger.info(`✅ Successfully selected "${dropdownValue}" from ${dropdownName}`);
    } catch (error) {
      Logger.error(`❌ Failed to select value from ${dropdownName}: ${error}`);
      throw error;
    }
  }

}