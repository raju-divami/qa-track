import { Locator, Page } from '@playwright/test';

/**
 * Wait for the Polymer app shell (shop-app) to be attached and visible.
 * Call this once after page.goto() before interacting with any page object.
 */
export async function waitForAppReady(page: Page, timeout = 15_000): Promise<void> {
  await page.locator('shop-app').waitFor({ state: 'attached', timeout });
}

/**
 * Wait for the network to be fully idle.
 * Use after navigation when the page fetches JSON product data.
 */
export async function waitForNetworkIdle(
  page: Page,
  timeout = 30_000,
): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Wait for a Polymer shadow-host element to have its shadow root upgraded
 * (i.e. its template rendered). Useful for custom elements that may not
 * immediately receive their shadow content after attachment.
 */
export async function waitForShadowReady(
  host: Locator,
  timeout = 10_000,
): Promise<void> {
  await host.waitFor({ state: 'visible', timeout });
}

/**
 * Poll until an element's text content matches the expected string.
 * Playwright's built-in toHaveText() is preferred inside expect(), but this
 * is useful inside helper functions that return a value rather than assert.
 */
export async function waitForText(
  locator: Locator,
  expectedText: string,
  timeout = 10_000,
): Promise<void> {
  await locator
    .filter({ hasText: expectedText })
    .waitFor({ state: 'visible', timeout });
}

/**
 * Wait for the cart badge in the header to display a specific count.
 * Pass 0 to wait for the badge to disappear (empty cart).
 */
export async function waitForCartCount(
  page: Page,
  expectedCount: number,
  timeout = 10_000,
): Promise<void> {
  const badge = page.locator('shop-app').locator('.cart-badge');
  if (expectedCount === 0) {
    await badge.waitFor({ state: 'hidden', timeout });
  } else {
    await waitForText(badge, String(expectedCount), timeout);
  }
}

/**
 * Wait for the shop-cart-modal to slide into view (class "opened" applied).
 */
export async function waitForCartModal(
  page: Page,
  timeout = 5_000,
): Promise<void> {
  const modal = page.locator('shop-app').locator('shop-cart-modal');
  await modal.waitFor({ state: 'visible', timeout });
  await page.waitForFunction(
    (el) => (el as Element).classList.contains('opened'),
    await modal.elementHandle(),
    { timeout },
  );
}

/**
 * Wait for a URL pattern to be reached.
 * Accepts a full URL string, a pathname, or a RegExp.
 */
export async function waitForUrl(
  page: Page,
  urlOrPath: string | RegExp,
  timeout = 15_000,
): Promise<void> {
  await page.waitForURL(urlOrPath, { timeout });
}

/**
 * Wait for the checkout page to transition to the success state.
 */
export async function waitForCheckoutSuccess(
  page: Page,
  timeout = 15_000,
): Promise<void> {
  await waitForUrl(page, /\/checkout\/success/, timeout);
}

/**
 * Wait for the checkout page to transition to the error state.
 */
export async function waitForCheckoutError(
  page: Page,
  timeout = 15_000,
): Promise<void> {
  await waitForUrl(page, /\/checkout\/error/, timeout);
}
