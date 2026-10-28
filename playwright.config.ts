import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

// Use a pre-installed Chromium when one is provided (cloud containers); otherwise Playwright's own.
const preinstalled = '/opt/pw-browsers/chromium';

export default defineConfig({
  testDir: 'tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    launchOptions: existsSync(preinstalled) ? { executablePath: preinstalled } : {},
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node node_modules/serve/build/main.js out -l 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
  },
});
