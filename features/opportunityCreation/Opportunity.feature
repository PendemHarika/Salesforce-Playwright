@opportunity 
Feature: Opportunity Creation and Validation
  As a TL Team User
  I want to create and edit new Opportunities for different Insurance types
  So that I can validate the workflow and all Opportunity sections end-to-end

  Background:
    Given I log into the Salesforce application as admin
    And I switch to TL Broker User
    When I open Client account
    Then I validate Account record type as "Client"

  # ------------------------------------------------------------------------------
  # SCENARIO 1: Create Opportunity and Add Coverage
  # ------------------------------------------------------------------------------
  @regression
  Scenario Outline: Create a new Opportunity of <insuranceType> and <insuranceSubtype> and add Standalone Coverage
    And I create a new opportunity with "<insuranceType>" and "<insuranceSubtype>"
    When I add New Coverage with "<standaloneCoverageType>"
    Then I validate the stage is Intake
    And I validate "<coverageType>" and "<lineOfCoverage>"

    Examples:
      | ScenarioNumber | insuranceType       | insuranceSubtype            | standaloneCoverageType | coverageType       | lineOfCoverage        |
      | TC_001         | Reps & Warranties   | Buyer-side R&W              | Reps & Warranties      | Reps & Warranties  | Transaction Liability |
      | TC_002         | Reps & Warranties   | Buyer-side R&W              | Tax Liability          | Tax Liability  | Transaction Liability |
      | TC_003         | Reps & Warranties   | Buyer-side R&W              |  Contingent Liability  | Contingent Liability  | Transaction Liability |
      | TC_004         | Reps & Warranties   | Buyer-side Secondaries R&W  | Reps & Warranties      | Reps & Warranties  | Transaction Liability |
      | TC_005         | Reps & Warranties   | Buyer-side Secondaries R&W  | Tax Liability          | Tax Liability   | Transaction Liability |
      | TC_006         | Reps & Warranties   | Buyer-side Secondaries R&W  | Contingent Liability   | Contingent Liability  | Transaction Liability |
      | TC_007         | Reps & Warranties   | Seller-side R&W             | Reps & Warranties      | Reps & Warranties  | Transaction Liability |
      | TC_008         | Reps & Warranties   | Seller-side R&W             | Tax Liability          | Tax Liability    | Transaction Liability |
      | TC_009         | Reps & Warranties   | Seller-side R&W             |  Contingent Liability  | Contingent Liability   | Transaction Liability |

# ------------------------------------------------------------------------------
# SCENARIO 2: Add Opportunity Team Member and Create Notes
# ------------------------------------------------------------------------------
@regression
Scenario Outline: <TestCaseNumber> New Opportunity --- Add Opportunity Team Member --- Create Notes
    When I create a new opportunity with "<Insurance Type>" and "<Insurance Subtype>"
    Then I validate the stage is Intake
    When I add Opportunity Team Member with "<Team Member Name>" and "<Role>" and "<Access Type>"
    Then I validate the Opportunity Team Member with "<Team Member Name>" and "<Role>" and "<Access Type>"
    When I create Notes with "<Note Title>" and "<Note Body>"
    Then I validate the Notes with "<Note Title>" and "<Note Body>"

    Examples:
    | TestCaseNumber|Insurance Type    | Insurance Subtype | Team Member Name  | Role        | Access Type | Note Title | Note Body               |
    | TC_010        |Reps & Warranties | Buyer-side R&W    | Nuguri Charitha    | Team Member | Read/Write  | Test Title | This is a nda/nbil flow.|  
    
  # ------------------------------------------------------------------------------
  # SCENARIO 3: Edit and verify all Opportunity details across all sections
  # ------------------------------------------------------------------------------
  @only @regression
  Scenario Outline: Edit and verify Opportunity details of <insuranceType> and <insuranceSubtype> across all sections
    And I create a new opportunity with "<insuranceType>" and "<insuranceSubtype>"
    When I edit and verify fields in Deal Overview section
    And I edit and verify fields in Purchase Agreement Details section
    And I edit and verify fields in Counsel Information section
    And I edit and verify fields in Insurance Requirements & Submission Info section
    And I edit and verify fields in Diligence Advisors section
    And I edit and verify fields in NDA Request section
    And I edit and verify fields in Binding Items section
    And I edit and verify fields in Subjectivity Tracking section

    Examples:
      | ScenarioNumber  | insuranceType         | insuranceSubtype                |
      | TC_011          | Reps & Warranties     | Buyer-side R&W                  |
      | TC_012          | Reps & Warranties     | Buyer-side Secondaries R&W      |
      | TC_013          | Reps & Warranties     | Seller-side R&W                 |
      | TC_014          | Tax Liability         | Tax Credit                      |
      | TC_015          | Tax Liability         | Other Tax                       |
      | TC_016          | Tax Liability         | M&A                             |
      | TC_017          | Contingent Liability  | Contingent Portfolio            |
      | TC_018          | Contingent Liability  | Contingent Binary Risks         |
      | TC_019          | Contingent Liability  | Collateral Protection Insurance |
      | TC_020          | Contingent Liability  | Other IP                        |
      | TC_021          | Contingent Liability  | Credit                          |

  # ------------------------------------------------------------------------------
  # SCENARIO 4: Individual section validations (modular runs)
  # ------------------------------------------------------------------------------
  @regression
  Scenario Outline: Edit and verify Opportunity details of <sectionName> section
    And I create a new opportunity with "<insuranceType>" and "<insuranceSubtype>"
    When I edit and verify fields in <sectionName> section

    Examples:
      | ScenarioNumber  | sectionName                               | insuranceType       | insuranceSubtype |
      | TC_022          | Deal Overview                             | Reps & Warranties   | Buyer-side R&W   |
      | TC_023          | Purchase Agreement Details                | Reps & Warranties   | Buyer-side R&W   |
      | TC_024          | Counsel Information                       | Reps & Warranties   | Buyer-side R&W   |
      | TC_025          | Insurance Requirements & Submission Info  | Reps & Warranties   | Buyer-side R&W   |
      | TC_026          | Diligence Advisors                        | Reps & Warranties   | Buyer-side R&W   |
      | TC_027          | NDA Request                               | Reps & Warranties   | Buyer-side R&W   |
      | TC_028          | Binding Items                             | Reps & Warranties   | Buyer-side R&W   |
      | TC_029          | Subjectivity Tracking                     | Reps & Warranties   | Buyer-side R&W   |
      | TC_030          | Deal Overview                             | Reps & Warranties   | Buyer-side Secondaries R&W   |
      | TC_031          | Purchase Agreement Details                | Reps & Warranties   | Buyer-side Secondaries R&W   |
      | TC_032          | Counsel Information                       | Reps & Warranties   | Buyer-side Secondaries R&W   |
      | TC_033          | Insurance Requirements & Submission Info  | Reps & Warranties   | Buyer-side Secondaries R&W   |
      | TC_034          | Diligence Advisors                        | Reps & Warranties   | Buyer-side Secondaries R&W   |
      | TC_035          | NDA Request                               | Reps & Warranties   | Buyer-side Secondaries R&W   |
      | TC_036          | Binding Items                             | Reps & Warranties   | Buyer-side Secondaries R&W   |
      | TC_037          | Subjectivity Tracking                     | Reps & Warranties   | Buyer-side Secondaries R&W   |
      | TC_038          | Deal Overview                             | Reps & Warranties   | Seller-side R&W   |
      | TC_039          | Purchase Agreement Details                | Reps & Warranties   | Seller-side R&W   |
      | TC_040          | Counsel Information                       | Reps & Warranties   | Seller-side R&W   |
      | TC_041          | Insurance Requirements & Submission Info  | Reps & Warranties   | Seller-side R&W   |
      | TC_042          | Diligence Advisors                        | Reps & Warranties   | Seller-side R&W   |
      | TC_043          | NDA Request                               | Reps & Warranties   | Seller-side R&W   |
      | TC_044          | Binding Items                             | Reps & Warranties   | Seller-side R&W   |
      | TC_045          | Subjectivity Tracking                     | Reps & Warranties   | Seller-side R&W   |
      | TC_046          | Deal Overview                             | Tax Liability    | Tax Credit  |
      | TC_047          | Purchase Agreement Details                | Tax Liability    | Tax Credit  |
      | TC_048          | Counsel Information                       | Tax Liability    | Tax Credit  |
      | TC_049          | Insurance Requirements & Submission Info  | Tax Liability    | Tax Credit  |
      | TC_050          | Diligence Advisors                        | Tax Liability    | Tax Credit  |
      | TC_051          | NDA Request                               | Tax Liability    | Tax Credit  |
      | TC_052          | Binding Items                             | Tax Liability    | Tax Credit  |
      | TC_053          | Subjectivity Tracking                     | Tax Liability    | Tax Credit  |
      | TC_054          | Deal Overview                             | Tax Liability    | M&A  |
      | TC_055          | Purchase Agreement Details                | Tax Liability    | M&A  |
      | TC_056          | Counsel Information                       | Tax Liability    | M&A  |
      | TC_057          | Insurance Requirements & Submission Info  | Tax Liability    | M&A  |
      | TC_058          | Diligence Advisors                        | Tax Liability    | M&A  |
      | TC_059          | NDA Request                               | Tax Liability    | M&A  |
      | TC_060          | Binding Items                             | Tax Liability    | M&A  |
      | TC_061          | Subjectivity Tracking                     | Tax Liability    | M&A  |
      | TC_062          | Deal Overview                             | Tax Liability    | Other Tax  |
      | TC_063          | Purchase Agreement Details                | Tax Liability    | Other Tax  |
      | TC_064          | Counsel Information                       | Tax Liability    | Other Tax  |
      | TC_065          | Insurance Requirements & Submission Info  | Tax Liability    | Other Tax  |
      | TC_066          | Diligence Advisors                        | Tax Liability    | Other Tax  |
      | TC_067          | NDA Request                               | Tax Liability    | Other Tax  |
      | TC_068          | Binding Items                             | Tax Liability    | Other Tax  |
      | TC_069          | Subjectivity Tracking                     | Tax Liability    | Other Tax  |
      | TC_070          | Deal Overview                             | Contingent Liability    | Contingent Portfolio  |
      | TC_071          | Purchase Agreement Details                | Contingent Liability    | Contingent Portfolio  |
      | TC_072          | Counsel Information                       | Contingent Liability    | Contingent Portfolio  |
      | TC_073          | Insurance Requirements & Submission Info  | Contingent Liability    | Contingent Portfolio  |
      | TC_074          | Diligence Advisors                        | Contingent Liability    | Contingent Portfolio  |
      | TC_075          | NDA Request                               | Contingent Liability    | Contingent Portfolio  |
      | TC_076          | Binding Items                             | Contingent Liability    | Contingent Portfolio  |
      | TC_077          | Subjectivity Tracking                     | Contingent Liability    | Contingent Portfolio  |
      | TC_078          | Deal Overview                             | Contingent Liability    | Contingent Binary Risks  |
      | TC_079          | Purchase Agreement Details                | Contingent Liability    | Contingent Binary Risks  |
      | TC_080          | Counsel Information                       | Contingent Liability    | Contingent Binary Risks  |
      | TC_081          | Insurance Requirements & Submission Info  | Contingent Liability    | Contingent Binary Risks  |
      | TC_082          | Diligence Advisors                        | Contingent Liability    | Contingent Binary Risks  |
      | TC_083          | NDA Request                               | Contingent Liability    | Contingent Binary Risks  |
      | TC_084          | Binding Items                             | Contingent Liability    | Contingent Binary Risks  |
      | TC_085          | Subjectivity Tracking                     | Contingent Liability    | Contingent Binary Risks  |
      | TC_086          | Deal Overview                             | Contingent Liability    | Collateral Protection Insurance  |
      | TC_087          | Purchase Agreement Details                | Contingent Liability    | Collateral Protection Insurance  |
      | TC_088          | Counsel Information                       | Contingent Liability    | Collateral Protection Insurance  |
      | TC_089          | Insurance Requirements & Submission Info  | Contingent Liability    | Collateral Protection Insurance  |
      | TC_090          | Diligence Advisors                        | Contingent Liability    | Collateral Protection Insurance  |
      | TC_091          | NDA Request                               | Contingent Liability    | Collateral Protection Insurance  |
      | TC_092          | Binding Items                             | Contingent Liability    | Collateral Protection Insurance  |
      | TC_093          | Subjectivity Tracking                     | Contingent Liability    | Collateral Protection Insurance  |
      | TC_094          | Deal Overview                             | Contingent Liability    | Other IP  |
      | TC_095          | Purchase Agreement Details                | Contingent Liability    | Other IP  |
      | TC_096          | Counsel Information                       | Contingent Liability    | Other IP  |
      | TC_097          | Insurance Requirements & Submission Info  | Contingent Liability    | Other IP  |
      | TC_098          | Diligence Advisors                        | Contingent Liability    | Other IP  |
      | TC_099          | NDA Request                               | Contingent Liability    | Other IP  |
      | TC_100          | Binding Items                             | Contingent Liability    | Other IP  |
      | TC_101          | Subjectivity Tracking                     | Contingent Liability    | Other IP  |
      | TC_102          | Deal Overview                             | Contingent Liability    | Credit  |
      | TC_103          | Purchase Agreement Details                | Contingent Liability    | Credit  |
      | TC_104          | Counsel Information                       | Contingent Liability    | Credit  |
      | TC_105          | Insurance Requirements & Submission Info  | Contingent Liability    | Credit  |
      | TC_106          | Diligence Advisors                        | Contingent Liability    | Credit  |
      | TC_107          | NDA Request                               | Contingent Liability    | Credit  |
      | TC_108          | Binding Items                             | Contingent Liability    | Credit  |
      | TC_109          | Subjectivity Tracking                     | Contingent Liability    | Credit  |