// Generate Multiple Cucumber HTML report from JSON
const report = require('multiple-cucumber-html-reporter');
const fs = require('fs');
const path = require('path');
let startTime = new Date();
let endTime = new Date();
// Ensure output dir is clean
const outDir = 'html-report';
if (fs.existsSync(outDir)) {
	try { fs.rmSync(outDir, { recursive: true, force: true }); } catch {}
}

// Read start/end times from metadata if available
try {
	const metaPath = path.join('test-results', '_meta', 'run-meta.json');
	if (fs.existsSync(metaPath)) {
		const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
		if (meta.startTime) startTime = new Date(meta.startTime);
		if (meta.endTime) endTime = new Date(meta.endTime);
	}
} catch {}

// Build a clean folder with only valid Cucumber JSON (arrays)
const sourceDir = 'test-results';
const validDir = path.join(sourceDir, '_valid');
try {
	if (fs.existsSync(validDir)) fs.rmSync(validDir, { recursive: true, force: true });
	fs.mkdirSync(validDir, { recursive: true });
	const files = fs.readdirSync(sourceDir).filter(f => f.toLowerCase().endsWith('.json'));
	for (const f of files) {
		try {
			const full = path.join(sourceDir, f);
			const text = fs.readFileSync(full, 'utf-8');
			const parsed = JSON.parse(text);
			if (Array.isArray(parsed)) {
				fs.copyFileSync(full, path.join(validDir, f));
			} else {
				// skip non-array json; likely metadata or other output
			}
		} catch {
			// skip invalid json
		}
	}
} catch {}

// Try to read runtime metadata produced by hooks

const runtimeMeta = {};
const getStartTime = () => startTime.toLocaleString();

report.generate({
	jsonDir: validDir,
	reportPath: outDir,
	reportName: 'Automation Test Results Report',
	pageTitle: 'Transaction Liability',
	displayDuration: false,
	metadata: {
		browser: {
			name: (runtimeMeta.browserName || process.env.BROWSER || process.env.PLAYWRIGHT_BROWSER || 'chromium').toLowerCase(),
			version: `${(runtimeMeta.browserName || process.env.BROWSER || process.env.PLAYWRIGHT_BROWSER || 'chromium').toLowerCase()} (` +
				(
					runtimeMeta.browserVersion ||
					process.env.BROWSER_VERSION ||
					process.env.CHROMIUM_VERSION ||
					process.env.FIREFOX_VERSION ||
					process.env.WEBKIT_VERSION ||
					'unknown'
				) + ')',
		},
		device: 'Local test machine',
		platform: {
			name: (runtimeMeta.platform && runtimeMeta.platform.name) || process.platform,
			version: (runtimeMeta.platform && runtimeMeta.platform.release) || process.arch,
		},
	},
	customData: {
		title: 'Run info',
		data: [
	{ label: 'Project', value: 'lockton-tl' },
	{ label: 'Release', value: '1.2.3' },
	{ label: 'Cycle', value: 'ADO-Smoke' },
	{ label: 'Browser Name', value: (process.env.BROWSER || process.env.PLAYWRIGHT_BROWSER || 'chromium').toLowerCase() },
	{ label: 'Execution Start Time', value: getStartTime() },
	{ label: 'Execution End Time', value: endTime.toLocaleString() },
		],
	},
	});

	const browserName = (runtimeMeta.browserName || process.env.BROWSER || process.env.PLAYWRIGHT_BROWSER || 'chromium').toLowerCase();
	const browserVersion =
		runtimeMeta.browserVersion ||
		process.env.BROWSER_VERSION ||
		process.env.CHROMIUM_VERSION ||
		process.env.FIREFOX_VERSION ||
		process.env.WEBKIT_VERSION ||
		'unknown';
	
	try {
		console.log(`✅ HTML report generated at ${outDir}/index.html`);
		console.log(`Browser: ${browserName} (version: ${browserVersion})`);
	} catch (err) {
		console.error('❌ Report generation failed:', err);
		process.exit(1);
	}
	
console.log('HTML report generated at', `${outDir}/index.html`);
