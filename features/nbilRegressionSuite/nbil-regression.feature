Feature: NBIL Regression Workflow
  As a TL Team User
  I want to create new opportunities and submit NBIL requests for various types
  So that I can validate the NBIL workflow for all business cases

  @regression @NBILEmailModifications @cc
  Scenario Outline: <ScenarioNumber>New Opportunity---NBIL---IT-<insuranceType> --- IST - <insuranceSubtype> --- Templates - <template1>, <template2>, <template3> with cc field modifications
    Given I log into the Salesforce application as admin
    And I switch to TL Broker User
    When I open Client account 
    Then I validate Account record type as "Client"
    When I create a new opportunity with "<Insurance Type>" and "<Insurance Subtype>"
    Then I validate the stage is Intake
    And I allocate "<allocation>" percentage to primary producer and add "<Service Lead>"
    And I fill NBIL mandatory fields with values "<enterpriseValue>", "<targetInput>", "<targetDescription>", "<quoteDueTimeValue>", "<sellersidemnityvalue>", "<buyersCouncilValue>", "<limitValue>" for "<Insurance Type>"
    And I fill aditional fields "<purchaseAgreement>", "<rolloverPercentage>", "<limitRequested2Value>", "<sellersCouncilOption>", "<typeOfFinancialsValue>", "<legalOption>", "<financialOption>", "<taxOption>", "<limitCommentsInputValue>", "<otherRequestedTermsInputValue>"
    Then I validate valid "<fullCarrierName>" for "<carrier>"
    And I navigate to Opportunity tab 

    # ---- NBIL Request 1 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template1>"
    And I validate the email page, template data, Upload the "set1" files and send the email for "<template1>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "change_cc_field" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set1" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template1>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list
    And I close the "Files" tab

    # ---- NBIL Request 2 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template2>"
    And I validate the email page, template data, Upload the "set2" files and send the email for "<template2>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "change_cc_field" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set2" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template2>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list
    And I close the "Files" tab

    # ---- NBIL Request 3 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template3>"
    And I validate the email page, template data, Upload the "set3" files and send the email for "<template3>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "change_cc_field" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set3" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template3>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list

Examples:

  |ScenarioNumber|Insurance Type      | Insurance Subtype          | carrier  | message      | allocation | Service Lead     | enterpriseValue | targetInput                                         | targetDescription                                                                    | quoteDueTimeValue  | sellersidemnityvalue | buyersCouncilValue    | limitValue | template1            | template2                  | template3                     | purchaseAgreement       |rolloverPercentage|limitRequested2Value|sellersCouncilOption|typeOfFinancialsValue|legalOption                         |financialOption|taxOption  | fullCarrierName                       |requestType|limitCommentsInputValue|otherRequestedTermsInputValue|
  |TC_001        |Reps & Warranties   | Buyer-side R&W             | Chubb    | Test Email   | 100        | Patricia Urraca  | 100000          | ImageFIRST Healthcare Laundry Specialists, LLC      | The traget provides outpatient and specialty healthcare laundry services in the U.S. | 10 AM              | NSI                  | Akin Gump             | 102        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |50                | 1000               | Akin Gump          | Audited             |Adams and Reese                     |CDS            |Kroll      | Chubb                                 |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_002        |Reps & Warranties   | Buyer-side Secondaries R&W | AIG      | Test Email   | 100        | Patricia Urraca  | 2000            | Goldman Sachs Asset Management                      | This target company provides healthcare laundry services in the U.S.                 | 12 PM              | Split Indemnity      | Abrams Fensterman     | 103        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |35                | 500                | Altheimer & Gray   | Unaudited           |Abrams Fensterman                   |BKD            |KPMG       |AIG Specialty Insurance Company        |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_003        |Reps & Warranties   | Seller-side R&W            | ASQ      | Test Email   | 100        | Patricia Urraca  | 20000           | Heritage Vet Partners                               | Target provides a mixed animal vet practice with 28 locations across 12 states.      | 10 AM              | Both LSI & NSI       | Alston & Bird         | 104        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |50                | 2000               | Avila              | Reviewed            |Advant Beiten - HK Legal Matters    |BMF            |Accuracy   |ASQ Underwriting                       |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_004        | Tax Liability      | Tax Credit                 | ANV      | Test Email   | 100        | Patricia Urraca  | 800           | Progeny Health LLC                                  | The company provides Utilization and healthcare services in the U.S.                 | COB                | NSI                  | Altheimer & Gray      | 108        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |35                | 300              | Atrium             | QofE                |Aird & Berlis                       |BRG            |Aprio      |ANV Underwriters|NBIL       |Test limit Comments   | Test other requested terms  |
  |TC_005        | Tax Liability      | M&A                        | CFC      | Test Email   | 100        | Patricia Urraca  | 900           | A&M Home Services                                   | It is for New Single-Family Housing Construction (except For-Sale Builders)          | 12 PM              | Both LSI & NSI       | Atrium                | 109        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |40                | 100               | Abrams Fensterman  | Reviewed            |Akerman Senterfitt                  |Blythe         |Baker Tilly| CFC Underwriting Limited                                |NBIL       |Test limit Comments   | Test other requested terms  |
  |TC_006        | Tax Liability      | Other Tax                  | Ambridge | Test Email   | 100        | Patricia Urraca  | 700             | AAK Foodservice                                     | Target provides Fats and Oils Refining and Blending                                  | COB                | Split Indemnity      | Avila                 | 110        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |15                | 500                | Alston & Bird      | Unaudited           |Alston & Bird                       |CBIZ           |BDO        | Ambridge Partners LLC                                 |NBIL       |Test limit Comments   | Test other requested terms  |

 @regression @NBILEmailModifications 
Scenario Outline: <ScenarioNumber>New Opportunity---NBIL---IT-<insuranceType> --- IST - <insuranceSubtype> --- Templates - <template1>, <template2>, <template3> with email body modifications
    Given I log into the Salesforce application as admin
    And I switch to TL Broker User
    When I open Client account 
    Then I validate Account record type as "Client"
    When I create a new opportunity with "<Insurance Type>" and "<Insurance Subtype>"
    Then I validate the stage is Intake
    And I allocate "<allocation>" percentage to primary producer and add "<Service Lead>"
    And I fill NBIL mandatory fields with values "<enterpriseValue>", "<targetInput>", "<targetDescription>", "<quoteDueTimeValue>", "<sellersidemnityvalue>", "<buyersCouncilValue>", "<limitValue>" for "<Insurance Type>"
    And I fill aditional fields "<purchaseAgreement>", "<rolloverPercentage>", "<limitRequested2Value>", "<sellersCouncilOption>", "<typeOfFinancialsValue>", "<legalOption>", "<financialOption>", "<taxOption>", "<limitCommentsInputValue>", "<otherRequestedTermsInputValue>"
    Then I validate valid "<fullCarrierName>" for "<carrier>"
    And I navigate to Opportunity tab 

    # ---- NBIL Request 1 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template1>"
    And I validate the email page, template data, Upload the "set1" files and send the email for "<template1>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "change_whole_emailbody" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set1" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template1>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list
    And I close the "Files" tab

    # ---- NBIL Request 2 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template2>"
    And I validate the email page, template data, Upload the "set2" files and send the email for "<template2>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "change_whole_emailbody" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set2" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template2>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list
    And I close the "Files" tab

    # ---- NBIL Request 3 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template3>"
    And I validate the email page, template data, Upload the "set3" files and send the email for "<template3>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "change_whole_emailbody" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set3" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template3>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list

Examples:

  |ScenarioNumber|Insurance Type      | Insurance Subtype          | carrier  | message      | allocation | Service Lead     | enterpriseValue | targetInput                                         | targetDescription                                                                    | quoteDueTimeValue  | sellersidemnityvalue | buyersCouncilValue    | limitValue | template1            | template2                  | template3                     | purchaseAgreement       |rolloverPercentage|limitRequested2Value|sellersCouncilOption|typeOfFinancialsValue|legalOption                         |financialOption|taxOption  | fullCarrierName                       |requestType|limitCommentsInputValue|otherRequestedTermsInputValue|
  |TC_007        |Reps & Warranties   | Buyer-side R&W             | Chubb    | Test Email   | 100        | Patricia Urraca  | 100000          | ImageFIRST Healthcare Laundry Specialists, LLC      | The traget provides outpatient and specialty healthcare laundry services in the U.S. | 10 AM              | NSI                  | Akin Gump             | 102        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |50                | 1000               | Akin Gump          | Audited             |Adams and Reese                     |CDS            |Kroll      | Chubb                                 |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_008        |Reps & Warranties   | Buyer-side Secondaries R&W | AIG      | Test Email   | 100        | Patricia Urraca  | 2000            | Goldman Sachs Asset Management                      | This target company provides healthcare laundry services in the U.S.                 | 12 PM              | Split Indemnity      | Abrams Fensterman     | 103        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |35                | 500                | Altheimer & Gray   | Unaudited           |Abrams Fensterman                   |BKD            |KPMG       |AIG Specialty Insurance Company        |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_009        |Reps & Warranties   | Seller-side R&W            | ASQ      | Test Email   | 100        | Patricia Urraca  | 20000           | Heritage Vet Partners                               | Target provides a mixed animal vet practice with 28 locations across 12 states.      | 10 AM              | Both LSI & NSI       | Alston & Bird         | 104        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |50                | 2000               | Avila              | Reviewed            |Advant Beiten - HK Legal Matters    |BMF            |Accuracy   |ASQ Underwriting                       |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_010        | Tax Liability      | Tax Credit                 | ANV      | Test Email   | 100        | Patricia Urraca  | 900          | Progeny Health LLC                                  | The company provides Utilization and healthcare services in the U.S.                 | COB                | NSI                  | Altheimer & Gray      | 108        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |35                | 300               | Atrium             | QofE                |Aird & Berlis                       |BRG            |Aprio      |ANV Underwriters |NBIL       |Test limit Comments   | Test other requested terms  |
  |TC_011        | Tax Liability      | M&A                        | CFC      | Test Email   | 100        | Patricia Urraca  | 800           | A&M Home Services                                   | It is for New Single-Family Housing Construction (except For-Sale Builders)          | 12 PM              | Both LSI & NSI       | Atrium                | 109        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |40                | 500               | Abrams Fensterman  | Reviewed            |Akerman Senterfitt                  |Blythe         |Baker Tilly| CFC Underwriting Limited                                |NBIL       |Test limit Comments   | Test other requested terms  |
  |TC_012        | Tax Liability      | Other Tax                  | Ambridge | Test Email   | 100        | Patricia Urraca  | 700             | AAK Foodservice                                     | Target provides Fats and Oils Refining and Blending                                  | COB                | Split Indemnity      | Avila                 | 110        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |15                | 600                | Alston & Bird      | Unaudited           |Alston & Bird                       |CBIZ           |BDO        | Ambridge Partners LLC                                 |NBIL       |Test limit Comments   | Test other requested terms  |

 @regression @NBILEmailModifications
 Scenario Outline: <ScenarioNumber>New Opportunity---NBIL---IT-<insuranceType> --- IST - <insuranceSubtype> --- Templates - <template1>, <template2>, <template3> with static email body modifications
    Given I log into the Salesforce application as admin
    And I switch to TL Broker User
    When I open Client account 
    Then I validate Account record type as "Client"
    When I create a new opportunity with "<Insurance Type>" and "<Insurance Subtype>"
    Then I validate the stage is Intake
    And I allocate "<allocation>" percentage to primary producer and add "<Service Lead>"
    And I fill NBIL mandatory fields with values "<enterpriseValue>", "<targetInput>", "<targetDescription>", "<quoteDueTimeValue>", "<sellersidemnityvalue>", "<buyersCouncilValue>", "<limitValue>" for "<Insurance Type>"
    And I fill aditional fields "<purchaseAgreement>", "<rolloverPercentage>", "<limitRequested2Value>", "<sellersCouncilOption>", "<typeOfFinancialsValue>", "<legalOption>", "<financialOption>", "<taxOption>", "<limitCommentsInputValue>", "<otherRequestedTermsInputValue>"
    Then I validate valid "<fullCarrierName>" for "<carrier>"
    And I navigate to Opportunity tab 

    # ---- NBIL Request 1 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template1>"
    And I validate the email page, template data, Upload the "set1" files and send the email for "<template1>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "change_static_text" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set1" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template1>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list
    And I close the "Files" tab

    # ---- NBIL Request 2 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template2>"
    And I validate the email page, template data, Upload the "set2" files and send the email for "<template2>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "change_static_text" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set2" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template2>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list
    And I close the "Files" tab

    # ---- NBIL Request 3 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template3>"
    And I validate the email page, template data, Upload the "set3" files and send the email for "<template3>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "change_static_text" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set3" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template3>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list

Examples:

  |ScenarioNumber|Insurance Type      | Insurance Subtype          | carrier  | message      | allocation | Service Lead     | enterpriseValue | targetInput                                         | targetDescription                                                                    | quoteDueTimeValue  | sellersidemnityvalue | buyersCouncilValue    | limitValue | template1            | template2                  | template3                     | purchaseAgreement       |rolloverPercentage|limitRequested2Value|sellersCouncilOption|typeOfFinancialsValue|legalOption                         |financialOption|taxOption  | fullCarrierName                       |requestType|limitCommentsInputValue|otherRequestedTermsInputValue|
  |TC_013        |Reps & Warranties   | Buyer-side R&W             | Chubb    | Test Email   | 100        | Patricia Urraca  | 100000          | ImageFIRST Healthcare Laundry Specialists, LLC      | The traget provides outpatient and specialty healthcare laundry services in the U.S. | 10 AM              | NSI                  | Akin Gump             | 102        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |50                | 1000               | Akin Gump          | Audited             |Adams and Reese                     |CDS            |Kroll      | Chubb                                 |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_014        |Reps & Warranties   | Buyer-side Secondaries R&W | AIG      | Test Email   | 100        | Patricia Urraca  | 2000            | Goldman Sachs Asset Management                      | This target company provides healthcare laundry services in the U.S.                 | 12 PM              | Split Indemnity      | Abrams Fensterman     | 103        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |35                | 500                | Altheimer & Gray   | Unaudited           |Abrams Fensterman                   |BKD            |KPMG       |AIG Specialty Insurance Company        |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_015        |Reps & Warranties   | Seller-side R&W            | ASQ      | Test Email   | 100        | Patricia Urraca  | 20000           | Heritage Vet Partners                               | Target provides a mixed animal vet practice with 28 locations across 12 states.      | 10 AM              | Both LSI & NSI       | Alston & Bird         | 104        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |50                | 2000               | Avila              | Reviewed            |Advant Beiten - HK Legal Matters    |BMF            |Accuracy   |ASQ Underwriting                       |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_016        | Tax Liability      | Tax Credit                 | ANV      | Test Email   | 100        | Patricia Urraca  | 900           | Progeny Health LLC                                  | The company provides Utilization and healthcare services in the U.S.                 | COB                | NSI                  | Altheimer & Gray      | 108        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |35                | 300               | Atrium             | QofE                |Aird & Berlis                       |BRG            |Aprio      |ANV Underwriters |NBIL       |Test limit Comments   | Test other requested terms  |
  |TC_017        | Tax Liability      | M&A                        | CFC      | Test Email   | 100        | Patricia Urraca  | 800           | A&M Home Services                                   | It is for New Single-Family Housing Construction (except For-Sale Builders)          | 12 PM              | Both LSI & NSI       | Atrium                | 109        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |40                | 500               | Abrams Fensterman  | Reviewed            |Akerman Senterfitt                  |Blythe         |Baker Tilly| CFC Underwriting Limited                                |NBIL       |Test limit Comments   | Test other requested terms  |
  |TC_018        | Tax Liability      | Other Tax                  | Ambridge | Test Email   | 100        | Patricia Urraca  | 700             | AAK Foodservice                                     | Target provides Fats and Oils Refining and Blending                                  | COB                | Split Indemnity      | Avila                 | 110        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |15                | 600                | Alston & Bird      | Unaudited           |Alston & Bird                       |CBIZ           |BDO        | Ambridge Partners LLC                                 |NBIL       |Test limit Comments   | Test other requested terms  |
 
 @regression @NBILEmailModifications
 Scenario Outline: <ScenarioNumber>New Opportunity---NBIL---IT-<insuranceType> --- IST - <insuranceSubtype> --- Templates - <template1>, <template2>, <template3> with dynamic email body modifications
    Given I log into the Salesforce application as admin
    And I switch to TL Broker User
    When I open Client account 
    Then I validate Account record type as "Client"
    When I create a new opportunity with "<Insurance Type>" and "<Insurance Subtype>"
    Then I validate the stage is Intake
    And I allocate "<allocation>" percentage to primary producer and add "<Service Lead>"
    And I fill NBIL mandatory fields with values "<enterpriseValue>", "<targetInput>", "<targetDescription>", "<quoteDueTimeValue>", "<sellersidemnityvalue>", "<buyersCouncilValue>", "<limitValue>" for "<Insurance Type>"
    And I fill aditional fields "<purchaseAgreement>", "<rolloverPercentage>", "<limitRequested2Value>", "<sellersCouncilOption>", "<typeOfFinancialsValue>", "<legalOption>", "<financialOption>", "<taxOption>", "<limitCommentsInputValue>", "<otherRequestedTermsInputValue>"
    Then I validate valid "<fullCarrierName>" for "<carrier>"
    And I navigate to Opportunity tab 

    # ---- NBIL Request 1 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template1>"
    And I validate the email page, template data, Upload the "set1" files and send the email for "<template1>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "change_dynamic_text" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set1" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template1>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list
    And I close the "Files" tab

    # ---- NBIL Request 2 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template2>"
    And I validate the email page, template data, Upload the "set2" files and send the email for "<template2>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "change_dynamic_text" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set2" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template2>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list
    And I close the "Files" tab

    # ---- NBIL Request 3 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template3>"
    And I validate the email page, template data, Upload the "set3" files and send the email for "<template3>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "change_dynamic_text" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set3" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template3>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list

Examples:

  |ScenarioNumber|Insurance Type      | Insurance Subtype          | carrier  | message      | allocation | Service Lead     | enterpriseValue | targetInput                                         | targetDescription                                                                    | quoteDueTimeValue  | sellersidemnityvalue | buyersCouncilValue    | limitValue | template1            | template2                  | template3                     | purchaseAgreement       |rolloverPercentage|limitRequested2Value|sellersCouncilOption|typeOfFinancialsValue|legalOption                         |financialOption|taxOption  | fullCarrierName                       |requestType|limitCommentsInputValue|otherRequestedTermsInputValue|
  |TC_019        |Reps & Warranties   | Buyer-side R&W             | Chubb    | Test Email   | 100        | Patricia Urraca  | 100000          | ImageFIRST Healthcare Laundry Specialists, LLC      | The traget provides outpatient and specialty healthcare laundry services in the U.S. | 10 AM              | NSI                  | Akin Gump             | 102        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |50                | 1000               | Akin Gump          | Audited             |Adams and Reese                     |CDS            |Kroll      | Chubb                                 |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_020        |Reps & Warranties   | Buyer-side Secondaries R&W | AIG      | Test Email   | 100        | Patricia Urraca  | 2000            | Goldman Sachs Asset Management                      | This target company provides healthcare laundry services in the U.S.                 | 12 PM              | Split Indemnity      | Abrams Fensterman     | 103        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |35                | 500                | Altheimer & Gray   | Unaudited           |Abrams Fensterman                   |BKD            |KPMG       |AIG Specialty Insurance Company        |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_021        |Reps & Warranties   | Seller-side R&W            | ASQ      | Test Email   | 100        | Patricia Urraca  | 20000           | Heritage Vet Partners                               | Target provides a mixed animal vet practice with 28 locations across 12 states.      | 10 AM              | Both LSI & NSI       | Alston & Bird         | 104        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |50                | 2000               | Avila              | Reviewed            |Advant Beiten - HK Legal Matters    |BMF            |Accuracy   |ASQ Underwriting                       |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_022        | Tax Liability      | Tax Credit                 | ANV      | Test Email   | 100        | Patricia Urraca  | 900             | Progeny Health LLC                                  | The company provides Utilization and healthcare services in the U.S.                 | COB                | NSI                  | Altheimer & Gray      | 108        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |35                | 500               | Atrium             | QofE                |Aird & Berlis                       |BRG            |Aprio      |ANV Underwriters |NBIL       |Test limit Comments   | Test other requested terms  |
  |TC_023        | Tax Liability      | M&A                        | CFC      | Test Email   | 100        | Patricia Urraca  | 800             | A&M Home Services                                   | It is for New Single-Family Housing Construction (except For-Sale Builders)          | 12 PM              | Both LSI & NSI       | Atrium                | 109        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |40                | 600               | Abrams Fensterman  | Reviewed            |Akerman Senterfitt                  |Blythe         |Baker Tilly| CFC Underwriting Limited                                |NBIL       |Test limit Comments   | Test other requested terms  |
  |TC_024        | Tax Liability      | Other Tax                  | Ambridge | Test Email   | 100        | Patricia Urraca  | 700             | AAK Foodservice                                     | Target provides Fats and Oils Refining and Blending                                  | COB                | Split Indemnity      | Avila                 | 110        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |15                | 500                | Alston & Bird      | Unaudited           |Alston & Bird                       |CBIZ           |BDO        | Ambridge Partners LLC                                 |NBIL       |Test limit Comments   | Test other requested terms  |
 
 @regression @NBILEmailModifications
 Scenario Outline: <ScenarioNumber>New Opportunity---NBIL---IT-<insuranceType> --- IST - <insuranceSubtype> --- Templates - <template1>, <template2>, <template3> with table emailbody modifications
    Given I log into the Salesforce application as admin
    And I switch to TL Broker User
    When I open Client account 
    Then I validate Account record type as "Client"
    When I create a new opportunity with "<Insurance Type>" and "<Insurance Subtype>"
    Then I validate the stage is Intake
    And I allocate "<allocation>" percentage to primary producer and add "<Service Lead>"
    And I fill NBIL mandatory fields with values "<enterpriseValue>", "<targetInput>", "<targetDescription>", "<quoteDueTimeValue>", "<sellersidemnityvalue>", "<buyersCouncilValue>", "<limitValue>" for "<Insurance Type>"
    And I fill aditional fields "<purchaseAgreement>", "<rolloverPercentage>", "<limitRequested2Value>", "<sellersCouncilOption>", "<typeOfFinancialsValue>", "<legalOption>", "<financialOption>", "<taxOption>", "<limitCommentsInputValue>", "<otherRequestedTermsInputValue>"
    Then I validate valid "<fullCarrierName>" for "<carrier>"
    And I navigate to Opportunity tab 

    # ---- NBIL Request 1 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template1>"
    And I validate the email page, template data, Upload the "set1" files and send the email for "<template1>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "remove_table" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set1" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template1>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list
    And I close the "Files" tab

    # ---- NBIL Request 2 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template2>"
    And I validate the email page, template data, Upload the "set2" files and send the email for "<template2>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "remove_table" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set2" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template2>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list
    And I close the "Files" tab

    # ---- NBIL Request 3 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template3>"
    And I validate the email page, template data, Upload the "set3" files and send the email for "<template3>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "remove_table" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set3" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template3>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list

Examples:

  |ScenarioNumber|Insurance Type      | Insurance Subtype          | carrier  | message      | allocation | Service Lead     | enterpriseValue | targetInput                                         | targetDescription                                                                    | quoteDueTimeValue  | sellersidemnityvalue | buyersCouncilValue    | limitValue | template1            | template2                  | template3                     | purchaseAgreement       |rolloverPercentage|limitRequested2Value|sellersCouncilOption|typeOfFinancialsValue|legalOption                         |financialOption|taxOption  | fullCarrierName                       |requestType|limitCommentsInputValue|otherRequestedTermsInputValue|
  |TC_025        |Reps & Warranties   | Buyer-side R&W             | Chubb    | Test Email   | 100        | Patricia Urraca  | 100000          | ImageFIRST Healthcare Laundry Specialists, LLC      | The traget provides outpatient and specialty healthcare laundry services in the U.S. | 10 AM              | NSI                  | Akin Gump             | 102        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |50                | 1000               | Akin Gump          | Audited             |Adams and Reese                     |CDS            |Kroll      | Chubb                                 |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_026        |Reps & Warranties   | Buyer-side Secondaries R&W | AIG      | Test Email   | 100        | Patricia Urraca  | 2000            | Goldman Sachs Asset Management                      | This target company provides healthcare laundry services in the U.S.                 | 12 PM              | Split Indemnity      | Abrams Fensterman     | 103        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |35                | 500                | Altheimer & Gray   | Unaudited           |Abrams Fensterman                   |BKD            |KPMG       |AIG Specialty Insurance Company        |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_027        |Reps & Warranties   | Seller-side R&W            | ASQ      | Test Email   | 100        | Patricia Urraca  | 20000           | Heritage Vet Partners                               | Target provides a mixed animal vet practice with 28 locations across 12 states.      | 10 AM              | Both LSI & NSI       | Alston & Bird         | 104        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |50                | 2000               | Avila              | Reviewed            |Advant Beiten - HK Legal Matters    |BMF            |Accuracy   |ASQ Underwriting                       |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_028        | Tax Liability      | Tax Credit                 | ANV      | Test Email   | 100        | Patricia Urraca  | 900             | Progeny Health LLC                                  | The company provides Utilization and healthcare services in the U.S.                 | COB                | NSI                  | Altheimer & Gray      | 108        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |35                | 600                | Atrium             | QofE                |Aird & Berlis                       |BRG            |Aprio      |ANV Underwriters                       |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_029        | Tax Liability      | M&A                        | CFC      | Test Email   | 100        | Patricia Urraca  | 800             | A&M Home Services                                   | It is for New Single-Family Housing Construction (except For-Sale Builders)          | 12 PM              | Both LSI & NSI       | Atrium                | 109        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |40                | 100                | Abrams Fensterman  | Reviewed            |Akerman Senterfitt                  |Blythe         |Baker Tilly| CFC Underwriting Limited              |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_030        | Tax Liability      | Other Tax                  | Ambridge | Test Email   | 100        | Patricia Urraca  | 700             | AAK Foodservice                                     | Target provides Fats and Oils Refining and Blending                                  | COB                | Split Indemnity      | Avila                 | 110        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |15                | 500                | Alston & Bird      | Unaudited           |Alston & Bird                       |CBIZ           |BDO        | Ambridge Partners LLC                 |NBIL       | Test limit Comments   | Test other requested terms  |

@regression @NBILEmailModifications
 Scenario Outline: <ScenarioNumber>New Opportunity---NBIL---IT-<insuranceType> --- IST - <insuranceSubtype> --- Templates - <template1>, <template2>, <template3> by changing all fields in email body
    Given I log into the Salesforce application as admin
    And I switch to TL Broker User
    When I open Client account 
    Then I validate Account record type as "Client"
    When I create a new opportunity with "<Insurance Type>" and "<Insurance Subtype>"
    Then I validate the stage is Intake
    And I allocate "<allocation>" percentage to primary producer and add "<Service Lead>"
    And I fill NBIL mandatory fields with values "<enterpriseValue>", "<targetInput>", "<targetDescription>", "<quoteDueTimeValue>", "<sellersidemnityvalue>", "<buyersCouncilValue>", "<limitValue>" for "<Insurance Type>"
    And I fill aditional fields "<purchaseAgreement>", "<rolloverPercentage>", "<limitRequested2Value>", "<sellersCouncilOption>", "<typeOfFinancialsValue>", "<legalOption>", "<financialOption>", "<taxOption>", "<limitCommentsInputValue>", "<otherRequestedTermsInputValue>"
    Then I validate valid "<fullCarrierName>" for "<carrier>"
    And I navigate to Opportunity tab 

    # ---- NBIL Request 1 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template1>"
    And I validate the email page, template data, Upload the "set1" files and send the email for "<template1>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "change_all_fields" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set1" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template1>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list
    And I close the "Files" tab

    # ---- NBIL Request 2 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template2>"
    And I validate the email page, template data, Upload the "set2" files and send the email for "<template2>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "change_all_fields" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set2" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template2>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list
    And I close the "Files" tab

    # ---- NBIL Request 3 ----
    When I submit a new NBIL request
    And I select the valid "<carrier>" for "<template3>"
    And I validate the email page, template data, Upload the "set3" files and send the email for "<template3>" with "<message>" for "<Insurance Type>" and "<Insurance Subtype>"
    And I "change_all_fields" in NBIL Email Template for "<Insurance Type>"
    Then I send the NBIL Email
    And I validate the Success Message and Close the success message window
    When Navigate to activityTab and open the email request sent
    Then I validate the email body details with updated values for "<Insurance Type>", "<requestType>"
    And I close the "NBIL" tab
    And I validate the NBIL email is sent and "set3" files is uploaded
    And I close the "Files" tab
    When I resend NBIL request with carrier "<carrier>" and template "<template3>" and upload attachments and close the flow
    And I validate that uploaded files are not visible in Files related list

   
  Examples:

  |ScenarioNumber|Insurance Type      | Insurance Subtype          | carrier  | message      | allocation | Service Lead     | enterpriseValue | targetInput                                         | targetDescription                                                                    | quoteDueTimeValue  | sellersidemnityvalue | buyersCouncilValue    | limitValue | template1            | template2                  | template3                     | purchaseAgreement       |rolloverPercentage|limitRequested2Value|sellersCouncilOption|typeOfFinancialsValue|legalOption                         |financialOption|taxOption  | fullCarrierName                       |requestType|limitCommentsInputValue|otherRequestedTermsInputValue|
  |TC_031        |Reps & Warranties   | Buyer-side R&W             | Chubb    | Test Email   | 100        | Patricia Urraca  | 100000          | ImageFIRST Healthcare Laundry Specialists, LLC      | The traget provides outpatient and specialty healthcare laundry services in the U.S. | 10 AM              | NSI                  | Akin Gump             | 102        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |50                | 1000               | Akin Gump          | Audited             |Adams and Reese                     |CDS            |Kroll      | Chubb                                 |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_032        |Reps & Warranties   | Buyer-side Secondaries R&W | AIG      | Test Email   | 100        | Patricia Urraca  | 2000            | Goldman Sachs Asset Management                      | This target company provides healthcare laundry services in the U.S.                 | 12 PM              | Split Indemnity      | Abrams Fensterman     | 103        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |35                | 500                | Altheimer & Gray   | Unaudited           |Abrams Fensterman                   |BKD            |KPMG       |AIG Specialty Insurance Company        |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_033        |Reps & Warranties   | Seller-side R&W            | ASQ      | Test Email   | 100        | Patricia Urraca  | 20000           | Heritage Vet Partners                               | Target provides a mixed animal vet practice with 28 locations across 12 states.      | 10 AM              | Both LSI & NSI       | Alston & Bird         | 104        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |50                | 2000               | Avila              | Reviewed            |Advant Beiten - HK Legal Matters    |BMF            |Accuracy   |ASQ Underwriting                       |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_034        | Tax Liability      | Tax Credit                 | ANV      | Test Email   | 100        | Patricia Urraca  | 900             | Progeny Health LLC                                  | The company provides Utilization and healthcare services in the U.S.                 | COB                | NSI                  | Altheimer & Gray      | 108        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |35                | 300                | Atrium             | QofE                |Aird & Berlis                       |BRG            |Aprio      |ANV Underwriters                       |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_035        | Tax Liability      | M&A                        | CFC      | Test Email   | 100        | Patricia Urraca  | 800             | A&M Home Services                                   | It is for New Single-Family Housing Construction (except For-Sale Builders)          | 12 PM              | Both LSI & NSI       | Atrium                | 109        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |40                | 400                | Abrams Fensterman  | Reviewed            |Akerman Senterfitt                  |Blythe         |Baker Tilly| CFC Underwriting Limited              |NBIL       | Test limit Comments   | Test other requested terms  |
  |TC_036        | Tax Liability      | Other Tax                  | Ambridge | Test Email   | 100        | Patricia Urraca  | 700             | AAK Foodservice                                     | Target provides Fats and Oils Refining and Blending                                  | COB                | Split Indemnity      | Avila                 | 110        | NBIL Request- No NDA | Joint NDA and NBIL Request | NBIL Request- Pre-Cleared NDA | Test Purchase Agreement |15                | 500                | Alston & Bird      | Unaudited           |Alston & Bird                       |CBIZ           |BDO        | Ambridge Partners LLC                 |NBIL       | Test limit Comments   | Test other requested terms  |