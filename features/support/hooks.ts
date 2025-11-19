import { AfterStep } from '@cucumber/cucumber';
// Attach screenshot to failed step definitions
AfterStep(async function (this: CustomWorld, { result }) {
  if (result?.status === 'FAILED' && this.page && this.attach) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
  }
});

import { AfterAll } from '@cucumber/cucumber';
import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import { Browser, BrowserContext, chromium, firefox, webkit } from 'playwright';
import fs from 'fs';
import path from 'path';
import os from 'os';
import dotenv from 'dotenv';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';

// Load environment variables from the correct .env file
dotenv.config({ path: process.env.ENV ? `.env.${process.env.ENV}` : '.env' });

// Remove global browser/context
setDefaultTimeout(80000);


// Ensure browser is closed after all tests to prevent hanging processes
// No global cleanup needed; scenario-local resources are cleaned in After hook

Before(async function (this: CustomWorld) {
  const bw = (process.env.BROWSER || 'chromium').toLowerCase();
  const launcher = bw === 'firefox' ? firefox : bw === 'webkit' ? webkit : chromium;
  const isCI = process.env.CI === 'true' || process.env.CI === '1';
  this.browser = await launcher.launch({ headless: isCI ? true : false });
  this.context = await this.browser.newContext({
    recordVideo: { dir: 'videos/' }
  });
  await this.context.tracing.start({ screenshots: true, snapshots: true });
  this.page = await this.context.newPage();
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.gotoLoginPage(process.env.BASE_URL!);
  await this.loginPage.loginWithValidCredentials(process.env.QA_USERNAME!, process.env.QA_PASSWORD!);
  this.homePage = new HomePage(this.page);
  // Write run metadata (start) for report generator
  try {
    const resultsDir = path.join(process.cwd(), 'test-results');
    const metaDir = path.join(resultsDir, '_meta');
    if (!fs.existsSync(metaDir)) fs.mkdirSync(metaDir, { recursive: true });
    const metaPath = path.join(metaDir, 'run-meta.json');
    const existing = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf-8')) : {};
    const meta = {
      ...existing,
      startTime: new Date().toISOString(),
      browserName: bw,
      browserVersion: this.browser.version(),
      platform: {
        name: os.platform(),
        release: os.release(),
        arch: os.arch(),
      },
    };
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
  } catch {}
});



After(async function (this: CustomWorld, scenario) {
  console.log('After hook called for scenario:', scenario.pickle.name);
  if (scenario.result?.status === 'FAILED' && this.context) {
    const safeName = scenario.pickle.name.replace(/[^a-zA-Z0-9-_]/g, '_');
    await this.context.tracing.stop({ path: `traces/${safeName}.zip` });
  } else if (this.context) {
    await this.context.tracing.stop();
  }
  if (this.page) {
    try {
      await this.page.close();
      console.log('Page closed in After');
    } catch (e) {
      console.log('Error closing page in After:', e);
    }
    this.page = undefined;
  }
  if (this.context) {
    try {
      await this.context.close();
      console.log('Context closed in After');
    } catch (e) {
      console.log('Error closing context in After:', e);
    }
    this.context = undefined;
  }
  if (this.browser) {
    try {
      await this.browser.close();
      console.log('Browser closed in After');
    } catch (e) {
      console.log('Error closing browser in After:', e);
    }
    this.browser = undefined;
  }
  // Update run metadata (end)
  try {
    const resultsDir = path.join(process.cwd(), 'test-results');
    const metaDir = path.join(resultsDir, '_meta');
    const metaPath = path.join(metaDir, 'run-meta.json');
    const existing = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf-8')) : {};
    const meta = {
      ...existing,
      endTime: new Date().toISOString(),
    };
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
  } catch {}
});