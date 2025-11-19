@policy
Feature: New Opportunity and Policy Management
  As a Salesforce user
  I want to create a new Policy while saving each Chevron
  So that I can manage opportunities and policies efficiently

  Scenario: Create New Opportunity and Policy - Save for Later on all Chevrons
    Given I log into the Salesforce application as admin
    And I switch to TL Broker User
    When I open Client account 
    Then I validate Account record type as "Client"
    And I create a new opportunity with "<Insurance Type>" and "<Subtype>"
    And I Verify Coverages In opportunity
    And I verify Opportunity Assignments allocation
    And I change Opportunity Stage to "Underwriting"
    And I create and save new Policy
    And I fill Coverage in Policy chevron and save for later
    And I fill Premium chevron and save for later
    And I fill Assignments chevron and save for later
    And I fill Fee chevron and save for later
    And I fill Surplus Line Tax chevron and save for later
    And I fill Agency Commissions chevron and save for later
    And I fill Other Commissions chevron and save for later
    And I fill Summary chevron and finalize the policy

  Examples:
    | Insurance Type        | Subtype                         |
    | Reps & Warranties     | Buyer-side R&W                  |
    | Reps & Warranties     | Buyer-side Secondaries R&W      |
    | Reps & Warranties     | Seller-side R&W                 |
    | Tax Liability         | Tax Credit                      |
    | Tax Liability         | Other Tax                       |
    | Tax Liability         | M&A                             |
    | Contingent Liability  | Contingent Portfolio            |
    | Contingent Liability  | Contingent Binary Risks         |
    | Contingent Liability  | Collateral Protection Insurance |
    | Contingent Liability  | Other IP                        |
    | Contingent Liability  | Credit                          |
