import * as dotenv from 'dotenv';

dotenv.config();

const e = process.env;

/** Typed, single-source-of-truth for every environment variable used in the suite. */
export const env = {
  /** Base URL of the application under test. */
  baseUrl: e.BASE_URL ?? 'https://shop.polymer-project.org',

  /** Run browser in headless mode (default true). */
  headless: e.HEADLESS !== 'false',

  /** Milliseconds to slow down each Playwright action (useful for debugging). */
  slowMo: Number(e.SLOW_MO ?? 0),

  /** Default Playwright test timeout in ms. */
  defaultTimeout: Number(e.DEFAULT_TIMEOUT ?? 30_000),

  /** Navigation / page-load timeout in ms. */
  navigationTimeout: Number(e.NAVIGATION_TIMEOUT ?? 30_000),

  /** Per-action timeout in ms (click, fill, …). */
  actionTimeout: Number(e.ACTION_TIMEOUT ?? 10_000),

  /** Number of parallel workers. */
  workers: Number(e.WORKERS ?? 2),

  /** Number of test retries on failure. */
  retries: Number(e.RETRIES ?? 0),
} as const;
