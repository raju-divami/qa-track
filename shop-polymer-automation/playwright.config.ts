import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const env = process.env;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!env.CI,
  retries: env.CI ? 2 : Number(env.RETRIES ?? 0),
  workers: env.CI ? 1 : Number(env.WORKERS ?? 2),
  reporter: 'html',
  use: {
    baseURL: env.BASE_URL ?? 'https://shop.polymer-project.org',
    headless: env.HEADLESS !== 'false',
    launchOptions: {
      slowMo: Number(env.SLOW_MO ?? 0),
    },
    actionTimeout: Number(env.ACTION_TIMEOUT ?? 10_000),
    navigationTimeout: Number(env.NAVIGATION_TIMEOUT ?? 30_000),
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  timeout: Number(env.DEFAULT_TIMEOUT ?? 30_000),
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
