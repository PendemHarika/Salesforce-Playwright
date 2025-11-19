Feature: NDA Workflow
  As a TL Team User
  I want to create new Opportunity and submit NDA request for various Insurancetypes
  So that I can validate the NDA workflow for all business cases

  @NDA @sanity
  Scenario Outline: <ScenarioNumber>_New Opportunity---NDA---IT - <Insurance Type>---IST - <Insurance Subtype> - Validate Attachments scenarios
    Given I log into the Salesforce application as admin
    And I switch to TL Broker User
    When I open Client account 
    Then I validate Account record type as "Client"
    When I create a new opportunity with "<Insurance Type>" and "<Insurance Subtype>"
    Then I validate the stage is Intake
    When I submit a new NDA request with "<Carrier>", "<Message>" and upload "set1" files
    Then I should see the NDA request success message
    And I validate the stage after NDA submission is Quoting
    And I validate the NDA email is sent and "set1" files is uploaded
    And I close the "Files" tab
    When I resend NDA request with carrier "<Carrier>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list

  
  Examples:
    |ScenarioNumber| Insurance Type        | Insurance Subtype              | Carrier   | Message  | Service Lead     | allocation |
    | TC_001       | Reps & Warranties     | Buyer-side R&W                 | Chubb     | Test     | Patricia Urraca  | 100        |
    | TC_002       | Reps & Warranties     | Buyer-side Secondaries R&W     | ASQ       | Test     | Patricia Urraca  | 100        |
    | TC_003       | Reps & Warranties     | Seller-side R&W                | AIG       | Test     | Patricia Urraca  | 100        |
    | TC_004       | Tax Liability         | Tax Credit                     | Ambridge  | Test     | Patricia Urraca  | 100        |
    | TC_005       | Tax Liability         | M&A                            | AIG       | Test     | Patricia Urraca  | 100        |
    | TC_006       | Tax Liability         | Other Tax                      | AIG       | Test     | Patricia Urraca  | 100        |
    | TC_007       | Contingent Liability  | Contingent Portfolio           | AIG       | Test     | Patricia Urraca  | 100        |
    | TC_008       | Contingent Liability  | Contingent Binary Risks        | Chubb     | Test     | Patricia Urraca  | 100        |
    | TC_009       | Contingent Liability  | Collateral Protection Insurance| Ambridge  | Test     | Patricia Urraca  | 100        |
    | TC_010       | Contingent Liability  | Other IP                       | AIG       | Test     | Patricia Urraca  | 100        |
    | TC_011       | Contingent Liability  | Credit                         | AIG       | Test     | Patricia Urraca  | 100        |