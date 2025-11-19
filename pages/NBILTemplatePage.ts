 
import { Page, expect } from '@playwright/test';
 
import { TestDataForTemplates } from "../resources/TemplatePage";
 
type TemplateName = keyof typeof TestDataForTemplates;
 
export class NBILTemplatePage {
 
 
    private readonly page: Page;
 
    constructor(page: Page) {
        this.page = page;
    }
 
    /**
     * Validates the NBIL template for static and dynamic fields and probability section.
     * Checks static texts, static fields (business rules), dynamic fields, and probability section visibility.
     * @param {Record<string, string>} dynamicFields - Dynamic values passed from step definition
     * @param {NBILTemplateValidationParams} params - All relevant parameters for static validation
     * @returns {Promise<void>} Resolves when all validations pass
     */
    async validateNBILTemplate(dynamicFields: Record<string, string>, params: NBILTemplateValidationParams): Promise<void> {
        const template = TestDataForTemplates[params.templateName as TemplateName];
        const emailBody = this.page.locator(".slds-rich-text-area__content");
        const { expectedFields, showProbability } = getExpectedTemplateFieldsAndProbability(params);
        console.log('Expected Fields:', expectedFields);
        console.log('Show Probability Section:', showProbability);
        // 1. Validate all static texts
        for (const staticText of template.staticTexts) {
            await expect(emailBody, `Expected static text "${staticText}" not found in email body`).toContainText(staticText);
        }
 
        // 2. Validate static fields (from params/business rules)
        for (const [label, expectedValue] of Object.entries(expectedFields)) {
            const rowLocator = this.page.locator(`//div[@role='textbox']//td[contains(text(),"${label}")]`);
            await expect(rowLocator, `Label "${label}" is missing from the email`).toBeVisible();
            const valueLocator = rowLocator.locator("xpath=following-sibling::td[1]");
            const rawValue = await valueLocator.textContent();
            const actualValue = rawValue?.trim();
            if (!actualValue) {
                throw new Error(`No value found for label "${label}"`);
            }
            expect(actualValue, `Mismatch for static field "${label}": expected "${expectedValue}", got "${actualValue}"`).toContain(expectedValue);
        }
 
        // 3. Validate dynamic fields (from step definition)
        for (const [label, expectedValue] of Object.entries(dynamicFields)) {
            const rowLocator = this.page.locator(`//div[@role='textbox']//td[contains(text(),"${label}")]`);
            await expect(rowLocator, `Label "${label}" is missing from the email`).toBeVisible();
            const valueLocator = rowLocator.locator("xpath=following-sibling::td[1]");
            const rawValue = await valueLocator.textContent();
            const actualValue = rawValue?.trim();
            if (!actualValue) {
                throw new Error(`No value found for label "${label}"`);
            }
            expect(actualValue, `Mismatch for dynamic field "${label}": expected "${expectedValue}", got "${actualValue}"`).toBe(expectedValue);
        }
 
        // 4. Validate probability section
        if (showProbability) {
            await this.expectProbabilitySectionVisible();
        } else {
            await this.expectProbabilitySectionNotVisible();
        }
    }
 
    /**
     * Gets the value of a template field by label.
     * Finds the row by label and returns the trimmed value from the next cell.
     * @param {string} label - The label of the field to retrieve
     * @returns {Promise<string>} The trimmed value of the field
     */
    async getTemplateFieldValue(label: string): Promise<string> {
        const rowLocator = this.page.locator(`//div[@role='textbox']//td[contains(text(),"${label}")]`);
        await expect(rowLocator, `Label "${label}" is missing from the email`).toBeVisible();
        const valueLocator = rowLocator.locator("xpath=following-sibling::td[1]");
        const rawValue = await valueLocator.textContent();
        if (!rawValue) throw new Error(`No value found for label "${label}"`);
        return rawValue.trim();
    }
 
    /**
     * Checks that the probability section is visible.
     * @returns {Promise<void>} Resolves if the probability section is visible
     */
    async expectProbabilitySectionVisible(): Promise<void> {
        const probabilityLocator = this.page.locator("//td/p[contains(text(),'rollover amount at which a Seller NCD would be required')]");
        await expect(probabilityLocator, 'Probability section should be visible').toBeVisible();
    }
 
    /**
     * Checks that the probability section is not visible.
     * @returns {Promise<void>} Resolves if the probability section is not visible
     */
    async expectProbabilitySectionNotVisible(): Promise<void> {
        const probabilityLocator = this.page.locator("//td/p[contains(text(),'rollover amount at which a Seller NCD would be required')]");
        await expect(probabilityLocator, 'Probability section should NOT be visible').not.toBeVisible();
    }
}
 
// --- Business Rule Utility ---
/**
 * Parameters for NBIL template validation.
 */
export interface NBILTemplateValidationParams {
     templateName: string;
     rollover: number;
     indemnity: string; // 'nsi', 'split indemnity', 'both lsi and nsi'
     insuranceType: string; // e.g. 'Reps & Warranties', 'Tax Liability', etc.
     insuranceSubType: string; // 'Buyer-side R&W', 'Seller-side R&W', 'Buyer-side Secondaries R&W'
     requestType: string; // 'NBIL Request- No NDA', 'Joint NDA and NBIL Request', 'NBIL Request- Pre-Cleared NDA'
     clientName: string;
     projectName: string;
}
 
/**
 * Result of NBIL template validation, including expected fields and probability section visibility.
 */
export interface NBILTemplateValidationResult {
    expectedFields: Record<string, string>;
    showProbability: boolean;
}
 
/**
 * Computes expected static fields and probability section visibility for NBIL template validation.
 * Applies business rules based on rollover, indemnity, insurance type/subtype, and request type.
 * @param {NBILTemplateValidationParams} params - Validation parameters
 * @returns {NBILTemplateValidationResult} Object with expectedFields and showProbability
 */
export function getExpectedTemplateFieldsAndProbability(params: NBILTemplateValidationParams): NBILTemplateValidationResult {
    const { rollover, indemnity, insuranceSubType, requestType, clientName } = params;
    let expectedFields: Record<string, string> = {};
    let showProbability = false;
 
    // Policy period logic: Only add for Reps & Warranties and Buyer-side Secondaries R&W
    if ((params.insuranceType === 'Reps & Warranties') || insuranceSubType === 'Buyer-side Secondaries R&W') {
        let policyPeriod = '';
        if (insuranceSubType === 'Buyer-side Secondaries R&W') {
            policyPeriod = '7 years';
            expectedFields['Lead Investor:'] = clientName;
        } else {
            policyPeriod = '6 years';
            expectedFields['Proposed Insured/Buyer:'] = clientName;
        }
        expectedFields['Policy Period:'] = policyPeriod;
    } else {
        expectedFields['Proposed Insured/Buyer:'] = clientName;
    }
 
    // --- Probability logic ---
    // Rollover >= 35: Probability section shown for NSI or Split Indemnity
    if(params.insuranceType==='Reps & Warranties'){
    if (rollover >= 35) {
        console.log('Rollover is 35 or more: ' + rollover + ' sellers indemnity value: ' + indemnity);
        if (indemnity === 'NSI' || indemnity === 'Split Indemnity') {
            showProbability = true;
        } else{
            showProbability = false;
        }
    }
    // Rollover 31-35: Probability section shown for NSI (except No NDA) or Split Indemnity
    else if (rollover >= 31 && rollover <= 35) {
        if (indemnity === 'NSI') {
            if (requestType !== 'NBIL Request- No NDA') showProbability = true;
        }
        if (indemnity === 'Split Indemnity') {
            showProbability = true;
        }  
    }
    // Rollover <= 30: Probability section shown for Split Indemnity (specific subtypes) or NSI (except No NDA)
    else if (rollover <= 30) {
        if (indemnity === 'Split Indemnity' && (insuranceSubType === 'Buyer-side Secondaries R&W' || insuranceSubType === 'Seller-side R&W' || insuranceSubType === 'Buyer-side R&W')) {
            showProbability = true;
        }
        if (indemnity === 'NSI' && requestType !== 'NBIL Request- No NDA') {
            showProbability = true;
        }
    }
    // If indemnity is 'Both LSI & NSI', never show probability section
    if (indemnity === 'Both LSI & NSI') showProbability = false;
} else {
    showProbability = false;
}
    return { expectedFields, showProbability };
}