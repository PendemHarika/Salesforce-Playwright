# Lockton-TL Test Automation

This project is a robust, scalable, and maintainable end-to-end test automation framework for Salesforce Transaction Liability workflows. It leverages Playwright, Cucumber, and TypeScript, and is designed for both local and CI/CD execution.

---

## Project Overview

This framework enables:
- BDD-style test authoring using Cucumber and Gherkin feature files
- Page Object Model (POM) for maintainable UI automation
- Data-driven testing via JSON, CSV, and Excel
- Rich reporting (HTML, traces, logs)
- Environment management via `.env` files
- Seamless integration with Azure DevOps pipelines

---

## Directory Structure & Key Utilities

- **config/**: Centralized configuration files for Cucumber, ESLint, Prettier, and lint-staged. Keeps the project root clean and organized.
- **scripts/**: Node.js scripts for custom orchestration, such as running tests and generating reports. All automation scripts are now under this folder.
  - Example: `generate-report.js` creates rich HTML reports from Cucumber JSON output.
- **features/**: Contains Gherkin feature files and step definitions for NDA, NBIL, and other business flows.
  - Step definitions map Gherkin steps to automation code, using page objects and utilities.
- **pages/**: Implements the Page Object Model. Each file represents a screen or workflow in Salesforce.
  - Example: `LoginPage.ts`, `HomePage.ts`, `NdaPage.ts`, `OpportunityPage.ts`.
  - **Significance**: Encapsulates selectors and actions, making tests readable and maintainable.
- **utils/**: Core utility modules for data, actions, randomization, and logging:
  - `logger.ts`: Centralized logger utility for consistent logging, error handling, and traceability across the framework.
  - `webUserActions.ts`: Centralizes Playwright actions (click, type, wait, etc.) with custom logging and error handling. Ensures consistent interaction and easier debugging.
  - `dataProvider.ts`: Reads test data from JSON, CSV, XLSX. Enables data-driven scenarios and separates test logic from data.
  - `randomDataGenerator.ts`: Uses `@faker-js/faker` to generate realistic random data (names, numbers, dates, etc.) for dynamic test coverage.
  - `locators.ts`: (Reserved for shared locators/constants across pages.)
- **test-results/**: Stores output files—Cucumber JSON, HTML reports, Playwright traces, etc.
- **.env.qa**: Stores environment variables for QA runs (never commit secrets).
- **.env.example**: Template for environment variables—copy and fill for your environment.

---

## Utility Modules: Significance & Usage

### webUserActions.ts
- **Purpose**: Abstracts Playwright actions (click, type, wait, etc.) into reusable methods.
- **Significance**: Reduces code duplication, improves reliability, and adds custom logging for better traceability.
- **Usage**:
  ```typescript
  await WebUserActions.clickOnElement('Login Button', this.loginButton);
  await WebUserActions.waitForVisible('Dashboard', this.dashboardLocator);
  ```

### dataProvider.ts
- **Purpose**: Loads test data from JSON, CSV, or Excel for data-driven testing.
- **Significance**: Decouples test logic from test data, enabling easy scenario expansion and maintenance.
- **Usage**:
  ```typescript
  const testData = DataProvider.readTestDataFromJson('test-data/nda-data.json');
  ```

### randomDataGenerator.ts
- **Purpose**: Generates random but realistic data for test fields.
- **Significance**: Increases test coverage and robustness by avoiding hardcoded values.
- **Usage**:
  ```typescript
  const randomName = RandomDataGenerator.generateName();
  const randomDate = RandomDataGenerator.generateDate();
  ```

---



## Code Quality & Tooling

- **ESLint**: Enforces consistent code style and best practices across your TypeScript and JavaScript files. It automatically detects code issues, potential bugs, and deviations from your chosen style guide. In this project, ESLint is configured via `config/.eslintrc.json` and can be run manually with `npm run lint` or automatically on staged files before each commit.

- **Prettier**: Automatically formats your code to a consistent style (indentation, quotes, spacing, etc.) every time you save or commit. This eliminates debates over code formatting and ensures all code looks the same, regardless of who wrote it. Prettier is configured via `config/.prettierrc` and is run together with ESLint on staged files.

- **lint-staged**: Optimizes pre-commit checks by running ESLint and Prettier only on files that are staged for commit (not the entire codebase). This makes pre-commit checks fast, so you never wait long for formatting or linting. The configuration is in `config/.lintstagedrc`.

- **Husky**: Manages Git hooks for your project. Here, Husky is set up to run lint-staged before every commit (pre-commit hook). This guarantees that only code passing lint and formatting checks can be committed, preventing code quality issues from entering the repository. Husky is initialized with `npm run prepare` and its hooks are stored in the `.husky/` folder.

### Advantages in Your Project

- **Automatic Code Quality Enforcement**: No code can be committed unless it passes linting and formatting, ensuring a clean and consistent codebase.
- **Faster Code Reviews**: Reviewers can focus on logic and functionality, not style or formatting issues.
- **Reduced Bugs**: ESLint catches many common mistakes and potential bugs before code is even committed.
- **Consistent Style**: Prettier ensures all code looks the same, making it easier to read and maintain.
- **Efficient Workflow**: lint-staged and Husky make checks fast and automatic, so developers don’t have to remember to run them manually.
- **Professional Standards**: These tools are industry best practices and help maintain a high-quality, professional codebase as your team grows.

## Environment Management

- Use `.env.qa` for environment-specific variables (URLs, credentials, etc.).
- Reference variables in your code using `process.env.VARIABLE_NAME`.
- Never commit real secrets—use `.env.example` as a template.

---

## Test Execution

- **Run NDA tests:**
  ```powershell
  $env:ENV="qa"; npm run test:nda
  ```
- **Run NBIL tests:**
  ```powershell
  $env:ENV="qa"; npm run test:nbil
  ```
- **Generate and view HTML report:**
  ```powershell
  npm run report:open
  ```

---

## Reporting & Debugging

- **HTML Report:**
  - Generated at `html-report/index.html` after each run.
  - Includes scenario details, metadata, and custom data (browser, environment, timestamps).
- **Playwright Traces:**
  - Saved in `traces/` for failed scenarios.
  - Open with `npx playwright show-trace <trace-file>` for step-by-step debugging.
- **Test Script Execution Videos:**
  - Saved in the `videos/` folder for each scenario run (as configured in Playwright).
  - Useful for visually reviewing test execution, debugging UI flows, and sharing evidence of test results.
  - Videos are automatically recorded for each scenario and retained on failure (see Playwright config for details).
- **Console Logs:**
  - All output is visible in the terminal.
  - For advanced logging, use the centralized `logger.ts` utility in `utils/` for consistent and structured logs across the framework.

---

## CI/CD Integration

- Ready for Azure DevOps pipelines via `azure-pipelines.yml`.
- Installs dependencies, runs tests, and publishes artifacts (HTML report, logs, test results).
- Parameters allow flexible environment and script selection.

---

## Extending the Framework

- **Add new page objects:** Create a new file in `pages/` and follow the POM pattern.
- **Add new step definitions:** Place in `features/step-definitions/` and map Gherkin steps to automation code.
- **Use dataProvider.ts:** For data-driven scenarios, reference your test data file and key.
- **Use randomDataGenerator.ts:** For dynamic test data, call the appropriate generator method.

---

## Step-by-Step Guide: Building New Features & Tests

### 1. Define Feature Files
- Write Gherkin scenarios in `features/nda/` or `features/nbil/`.
- Use Given/When/Then steps to describe business flows.
- **Use Scenario Outline for Data-Driven Testing:**
  - Scenario Outline allows you to run the same scenario multiple times with different sets of data using the Examples table.
  - **Benefits:**
    - Enables comprehensive test coverage with minimal duplication.
    - Makes it easy to validate workflows against multiple data sets.
    - Improves maintainability—add new data sets by updating the Examples table, not the scenario logic.
    - Reduces effort and errors compared to writing separate scenarios for each data set.
  - **Example:**
    ```gherkin
    Scenario Outline: Login with multiple users
      Given I am on the login page
      When I login with username <username> and password <password>
      Then I should see the dashboard
    
    Examples:
      | username      | password   |
      | user1@test.com| pass123    |
      | user2@test.com| pass456    |
    ```

### 2. Create Step Definitions
- Map each Gherkin step to automation code in `features/step-definitions/`.
- Import page objects and utilities for UI actions and data handling.

### 3. Add or Update Page Classes
- Create new `.ts` files in `pages/` for each screen or workflow.
- Import locators from JSON (`locators/locators.json`).
- Define getter methods for each locator:
  ```typescript
  private get loginButton(): Locator {
    return this.page.locator(locators.LoginPage.loginButton);
  }
  ```
- Implement actions using `WebUserActions` for reliability and logging:
  ```typescript
  await WebUserActions.clickOnElement('Login Button', this.loginButton);
  ```

### 4. Define Locators in JSON
- Add new selectors to `locators/locators.json` under the relevant page section.
- Reference these selectors in your page classes for maintainability.
- For dynamic locators, use utility methods like `WebUserActions.getDynamicLocator`.

### 5. Provide Test Data
- Add or update files in `test-data/` (JSON, CSV, Excel).
- Use `DataProvider` to load test data:
  ```typescript
  const testData = DataProvider.readTestDataFromJson('test-data/nda-data.json');
  ```

### 6. Utilize Reusable Utilities
- Use `webUserActions.ts` for all Playwright actions (click, type, wait, select, etc.).
- Use `randomDataGenerator.ts` for dynamic, realistic test data.
- Use `logger.ts` for structured logging and error reporting.

### 7. Configure & Support Files
- **playwright.config.ts**: Set global timeouts, browser options, trace/screenshot/video settings, and test directory.
- **test.config.ts**: Store app URLs, credentials, and other test parameters.
- **tsconfig.json**: TypeScript compiler settings—ensures strict type checking and includes all relevant folders.
- **features/support/world.ts**: Defines the Cucumber world, storing browser, context, and page objects for each scenario.
- **features/support/hooks.ts**: Manages test lifecycle (setup, teardown, reporting, screenshot on failure).
- **features/support/helper.ts**: Add custom helpers for reporting, data, or orchestration as needed.

---

## Framework Lifecycle: Usage & Benefits of hooks.ts and world.ts

### hooks.ts
- **Usage:**
  - Manages test lifecycle events (Before, After, AfterAll) for each scenario.
  - Sets up browser, context, and page objects before each scenario.
  - Handles login, environment setup, and resource cleanup.
  - Captures screenshots and Playwright traces on failure for debugging.
  - Writes metadata (start/end time, browser info) for reporting.
- **Benefits:**
  - Ensures each scenario runs in a clean, isolated environment.
  - Prevents resource leaks and test flakiness by robust cleanup.
  - Automates reporting and debugging artifacts for failed tests.
  - Centralizes lifecycle logic for maintainability and consistency.

### world.ts
- **Usage:**
  - Defines the Cucumber World object (`CustomWorld`) for each scenario.
  - Stores browser, context, page, and page objects as scenario-local properties.
  - Makes scenario state and resources available to step definitions and hooks.
- **Benefits:**
  - Provides a clean, isolated context for every scenario.
  - Enables easy sharing of resources (browser, page, data) across steps.
  - Supports robust resource management and cleanup.
  - Simplifies step definitions by exposing scenario state via `this`.

---

## Detailed Breakdown: hooks.ts & world.ts Functions

### hooks.ts
- **Before Hook**
  - Launches browser/context/page for each scenario.
  - Performs login and environment setup.
  - Writes run metadata (start time, browser info).
  - Ensures clean state for every test.
- **After Hook**
  - Closes page, context, and browser after each scenario.
  - Captures screenshot and Playwright trace on failure.
  - Updates run metadata (end time).
  - Prevents resource leaks and enables debugging.
- **AfterAll Hook**
  - (Optional) For global cleanup after all tests.
- **Error Handling & Logging**
  - Logs all actions and errors for traceability.

### world.ts
- **CustomWorld Class**
  - Extends Cucumber World for scenario-local context.
  - Declares browser, context, page, and page objects as properties.
  - Makes resources available to step definitions and hooks via `this`.
- **Constructor**
  - Initializes World object for each scenario.
- **close() Method**
  - Closes page and browser if present (additional cleanup).
- **setWorldConstructor**
  - Registers CustomWorld for all scenarios.

### Usage Example in Step Definitions
```typescript
Given('I am logged in', async function () {
  await this.loginPage.loginWithValidCredentials(...);
});
```
- `this` refers to the scenario’s CustomWorld, set up in the Before hook.

---

## Best Practices
- Centralize locators in JSON for maintainability.
- Use POM for readable, reusable code.
- Keep test data separate from logic.
- Use utilities for common actions and data.
- Leverage config files for environment and test settings.
- Use Playwright traces and HTML reports for debugging.
- Enforce code quality with ESLint, Prettier, lint-staged, and Husky.

---

## Example: Adding a New Page Object with JSON Locators
```typescript
import { Page, Locator } from 'playwright';
import locators from '../locators/locators.json';
import { WebUserActions } from '../utils/webUserActions';

export class MyNewPage {
  constructor(private page: Page) {}

  private get myButton(): Locator {
    return this.page.locator(locators.MyNewPage.myButton);
  }

  async clickMyButton() {
    await WebUserActions.clickOnElement('My Button', this.myButton);
  }
}
```

---

## Quick Reference
- **Feature files:** `features/nda/`, `features/nbil/`
- **Step definitions:** `features/step-definitions/`
- **Page classes:** `pages/`
- **Locators:** `locators/locators.json`
- **Test data:** `test-data/`
- **Utilities:** `utils/`
- **Config:** `playwright.config.ts`, `test.config.ts`, `tsconfig.json`
- **Support:** `features/support/`

---


For more details, see the code in the `pages/` and `utils/` folders, and the sample step definitions in `features/step-definitions/`.

If you have questions or want to contribute, please reach out to the project maintainers.
