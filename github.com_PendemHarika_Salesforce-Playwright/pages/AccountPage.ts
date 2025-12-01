// ADD THESE NEW METHODS TO EXISTING CLASS - DO NOT MODIFY EXISTING CODE

    /**
     * Complete the workflow to create an Opportunity, add a related Contact, and add a related Account for an existing Account.
     * This method covers the entire business flow for TC_001: Verify opportunity, Related contact and related account is created for existing account.
     *
     * @param accountName - The name of the existing account to use
     * @param opportunityData - An object containing all data needed for opportunity creation (name, stage, effective date, close date, etc.)
     * @param contactData - An object containing all data needed for related contact creation (name, title, role, etc.)
     * @param relatedAccountData - An object containing all data needed for related account creation (name, FEIN, etc.)
     */
    async createOpportunityWithRelatedContactAndAccount(
        accountName: string,
        opportunityData: {
            opportunityName: string,
            stage: string,
            effectiveDate: string,
            closeDate: string,
            allocationPercent: string
        },
        contactData: {
            contactName: string,
            title: string,
            role: string
        },
        relatedAccountData: {
            accountName: string,
            fein: string
        }
    ): Promise<void> {
        // 1. Search and select existing account
        await this.searchAndSelectAccount(accountName);
        // 2. Navigate to Related tab
        await this.navigateToRelatedTab();
        // 3. Create Opportunity
        await this.createRelatedOpportunity(opportunityData);
        // 4. Add Related Contact
        await this.addRelatedContact(contactData);
        // 5. Add Related Account
        await this.addRelatedAccount(relatedAccountData);
    }

    /**
     * Search for an account and select it from the list.
     * @param accountName - The name of the account to search for
     */
    async searchAndSelectAccount(accountName: string): Promise<void> {
        // TODO: Replace with actual locator for the global search input
        const searchInput = this.page.locator('input[placeholder="Search this list..."]'); // placeholder
        await searchInput.fill(accountName);
        await this.page.keyboard.press('Enter');
        // TODO: Replace with actual locator for account row selection
        const accountRow = this.page.locator(`a[title='${accountName}']`);
        await accountRow.waitFor({ state: 'visible', timeout: 10000 });
        await accountRow.click();
    }

    /**
     * Navigate to the Related tab on the Account details page.
     */
    async navigateToRelatedTab(): Promise<void> {
        // TODO: Replace with actual locator for Related tab
        const relatedTab = this.page.locator('#relatedListsTab2__item'); // From provided locator
        await relatedTab.waitFor({ state: 'visible', timeout: 5000 });
        await relatedTab.click();
    }

    /**
     * Create a new related Opportunity for the selected Account.
     * @param opportunityData - Data for opportunity creation
     */
    async createRelatedOpportunity(opportunityData: {
        opportunityName: string,
        stage: string,
        effectiveDate: string,
        closeDate: string,
        allocationPercent: string
    }): Promise<void> {
        // Click New button in Opportunities related list
        // TODO: Replace with actual locator for Opportunities New button
        const newButton = this.page.locator('button.slds-button[data-aura-rendered-by]'); // placeholder, refine as needed
        await newButton.first().click();
        // Select Initial Intake (P&C) radio button
        // TODO: Replace with actual locator for Initial Intake radio
        const intakeRadio = this.page.locator('span.slds-form-element__label', { hasText: 'Initial Intake (P&C)' });
        await intakeRadio.click();
        // Enter Opportunity details
        // TODO: Replace with actual locators for each field
        await this.page.locator('input[placeholder="Opportunity Name"]').fill(opportunityData.opportunityName); // placeholder
        await this.page.locator('button[aria-label="Stage"]').click();
        await this.page.locator(`span:has-text("${opportunityData.stage}")`).click();
        await this.page.locator('input[placeholder="Effective Date"]').fill(opportunityData.effectiveDate); // placeholder
        await this.page.locator('input[placeholder="Close Date"]').fill(opportunityData.closeDate); // placeholder
        // Save Opportunity
        await this.page.locator('button:has-text("Save")').click();
        // Enter allocation percent
        await this.page.locator('input[placeholder="Allocation Percent"]').fill(opportunityData.allocationPercent); // placeholder
        // Save and Close
        await this.page.locator('button:has-text("Save & Close")').click();
    }

    /**
     * Add a related Contact to the Opportunity.
     * @param contactData - Data for contact creation
     */
    async addRelatedContact(contactData: {
        contactName: string,
        title: string,
        role: string
    }): Promise<void> {
        // Click Add Contact button
        // TODO: Replace with actual locator for Add Contact button
        const addContactButton = this.page.locator('button:has-text("Add Contact")'); // placeholder
        await addContactButton.click();
        // Enter contact name in search
        await this.page.locator('input[placeholder="Search Contacts"]').fill(contactData.contactName); // placeholder
        // Enter title
        await this.page.locator('input[placeholder="Title"]').fill(contactData.title); // placeholder
        // Select contact role
        await this.page.locator('button[aria-label="Role"]').click();
        await this.page.locator(`span:has-text("${contactData.role}")`).click();
        // Save contact
        await this.page.locator('button:has-text("Save")').click();
    }

    /**
     * Add a related Account (e.g., Additional Named Insured) to the Opportunity.
     * @param relatedAccountData - Data for related account creation
     */
    async addRelatedAccount(relatedAccountData: {
        accountName: string,
        fein: string
    }): Promise<void> {
        // Click New button beside Related Accounts
        // TODO: Replace with actual locator for Related Accounts New button
        const newRelatedAccountButton = this.page.locator('button:has-text("New")'); // placeholder
        await newRelatedAccountButton.click();
        // Select Additional Named Insured radio button
        await this.page.locator('span.slds-form-element__label', { hasText: 'Additional Named Insured' }).click();
        // Next
        await this.page.locator('button:has-text("Next")').click();
        // Enter account name and FEIN
        await this.page.locator('input[placeholder="Account Name"]').fill(relatedAccountData.accountName); // placeholder
        await this.page.locator('input[placeholder="FEIN"]').fill(relatedAccountData.fein); // placeholder
        // Save
        await this.page.locator('button:has-text("Save")').click();
        // Confirm Save if needed
        const saveButton = this.page.locator('button:has-text("Save")');
        if (await saveButton.isVisible()) {
            await saveButton.click();
        }
    }

    /**
     * Validate that the Opportunity, Related Contact, and Related Account were created for the existing Account.
     * This can be expanded with more robust checks as needed.
     * @param opportunityName - Name of the created opportunity
     * @param contactName - Name of the related contact
     * @param relatedAccountName - Name of the related account
     */
    async validateOpportunityAndRelatedRecords(
        opportunityName: string,
        contactName: string,
        relatedAccountName: string
    ): Promise<void> {
        // Validate Opportunity exists
        const opportunityRow = this.page.locator(`a[title='${opportunityName}']`);
        await opportunityRow.waitFor({ state: 'visible', timeout: 10000 });
        // Validate Related Contact exists
        const contactRow = this.page.locator(`a[title='${contactName}']`);
        await contactRow.waitFor({ state: 'visible', timeout: 10000 });
        // Validate Related Account exists
        const relatedAccountRow = this.page.locator(`a[title='${relatedAccountName}']`);
        await relatedAccountRow.waitFor({ state: 'visible', timeout: 10000 });
    }
