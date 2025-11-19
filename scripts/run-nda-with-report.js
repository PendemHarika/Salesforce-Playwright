const { spawn, spawnSync } = require('child_process');
const fs = require('fs');

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

/**
 * Synchronously runs a shell command with the given arguments and options.
 * @param {string} cmd - The command to execute (e.g., 'node', 'npx').
 * @param {string[]} args - Array of arguments to pass to the command.
 * @param {object} [opts={}] - Additional options for spawnSync (e.g., cwd, env).
 * @returns {number} - The exit status code of the command (0 for success).
 */
function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: true, env: process.env, ...opts });
  return res.status ?? 0;
}

/**
 * Removes the 'html-report' directory if it exists, to ensure a clean state before report generation.
 * Logs actions and errors to the console.
 */
function cleanReportDir() {
  const reportDir = 'html-report';
  try {
    if (fs.existsSync(reportDir)) {
      fs.rmSync(reportDir, { recursive: true, force: true });
      console.log('🧹 Cleaned old html-report directory before retry.');
    }
  } catch (err) {
    console.error('⚠️ Failed to clean report directory:', err.message);
  }
}

/**
 * Attempts to generate the HTML report by running the report script.
 * Retries the operation up to maxRetries times if it fails, cleaning the report directory between attempts.
 * @param {number} [maxRetries=1] - The maximum number of retry attempts on failure.
 * @returns {number} - The exit status code (0 for success, non-zero for failure after all retries).
 */
function generateReportWithRetry(maxRetries = 1) {
  let attempt = 0;
  let status;

  while (attempt <= maxRetries) {
    if (attempt > 0) {
      cleanReportDir();
    }

    console.log(`📊 Generating HTML report (attempt ${attempt + 1}/${maxRetries + 1})...`);
    status = run('node', ['./scripts/generate-report.js']);

    if (status === 0) {
      console.log('✅ HTML report generated at html-report/index.html');
      // Do not attempt to open the report in CI/pipeline
      // If you want to open locally, use a separate npm script or command
      return 0; // success
    }

    console.error(`⚠️ Report generation failed (attempt ${attempt + 1}).`);
    attempt++;

    if (attempt <= maxRetries) {
      console.log('🔄 Retrying report generation...');
    }
  }

  return status; // failed after retries
}

/**
 * Runs the Cucumber NDA test suite asynchronously using npx and the provided config.
 * Returns a promise that resolves with the exit code when the process completes.
 * @returns {Promise<number>} - Promise resolving to the exit code of the Cucumber process.
 */
function runCucumberAsync() {
  return new Promise((resolve) => {
    const child = spawn('npx', [
      'cucumber-js',
      '--config', 'config/cucumber.json'
    ], { stdio: 'inherit', shell: true, env: process.env });
    child.on('close', (code) => {
      resolve(code);
    });
  });
}

(async () => {
  // Ensure results dir
  run('node', ['-e', "require('fs').mkdirSync('test-results',{recursive:true})"]);

  const testStatus = await runCucumberAsync();

  // Always try to generate report (with retry + cleanup)
  const reportStatus = generateReportWithRetry(1); // retry once

  console.log(`Final Exit → Tests: ${testStatus}, Report: ${reportStatus}`);

  // Forceful exit fallback after 2 seconds
  setTimeout(() => {
    console.error('Forceful exit due to lingering handles.');
    process.exit(1);
  }, 2000);

  // If tests failed → pipeline must fail
  if (testStatus !== 0) {
    process.exit(testStatus);
  }

  // If tests passed but report failed → warn, don’t fail pipeline
  if (reportStatus !== 0) {
    console.error('⚠️ Tests passed but report generation failed after retry. Marking as warning only.');
    process.exit(0);
  }

  // Normal exit
  process.exit(0);
})();
