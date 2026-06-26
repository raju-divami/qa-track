/**
 * Error Handling Tests
 *
 * Classification:
 *   @regression – verify error states, 404 page, and checkout status pages
 *
 * Tests here verify edge cases and error states in the SPA router and
 * checkout flow. They are isolated from cart/checkout UI state where possible.
 */
import { test, expect } from '@playwright/test';
import data from '../test-data/navigation.json';
import checkoutData from '../test-data/checkout.json';
import { NotFoundPage, CheckoutSuccessPage, CheckoutErrorPage } from '../pages';
import { clearCart } from '../utils';

test.describe('Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearCart(page);
  });

  // ── ERR_001 ─────────────────────────────────────────────────────────────────
  test(
    'ERR_001 - Navigating to an unknown path shows the 404 page',
    { tag: ['@regression'] },
    async ({ page }) => {
      const notFoundPage = new NotFoundPage(page);
      await notFoundPage.goto(data.invalidPaths[0]);
      expect(await notFoundPage.isVisible()).toBe(true);
    },
  );

  // ── ERR_002 ─────────────────────────────────────────────────────────────────
  test(
    'ERR_002 - 404 page displays the expected "page not found" message',
    { tag: ['@regression'] },
    async ({ page }) => {
      const notFoundPage = new NotFoundPage(page);
      await notFoundPage.goto(data.invalidPaths[0]);
      const message = await notFoundPage.getMessage();
      expect(message).toContain(data.notFoundMessage);
    },
  );

  // ── ERR_003 ─────────────────────────────────────────────────────────────────
  test(
    'ERR_003 - Clicking "Go to the home page" on the 404 page navigates to /',
    { tag: ['@regression'] },
    async ({ page }) => {
      const notFoundPage = new NotFoundPage(page);
      await notFoundPage.goto(data.invalidPaths[0]);
      await notFoundPage.goHome();
      await expect(page).toHaveURL('/');
    },
  );

  // ── ERR_004 ─────────────────────────────────────────────────────────────────
  test(
    'ERR_004 - 404 page renders for every known invalid path variant',
    { tag: ['@regression'] },
    async ({ page }) => {
      const notFoundPage = new NotFoundPage(page);
      for (const path of data.invalidPaths) {
        await notFoundPage.goto(path);
        expect(await notFoundPage.isVisible()).toBe(true);
        const message = await notFoundPage.getMessage();
        expect(message.length).toBeGreaterThan(0);
      }
    },
  );

  // ── ERR_005 ─────────────────────────────────────────────────────────────────
  test(
    'ERR_005 - Direct navigation to /checkout/success shows the success state',
    { tag: ['@regression'] },
    async ({ page }) => {
      const successPage = new CheckoutSuccessPage(page);
      await successPage.goto();
      expect(await successPage.isVisible()).toBe(true);
      await expect(page).toHaveURL(/\/checkout\/success/);
    },
  );

  // ── ERR_006 ─────────────────────────────────────────────────────────────────
  test(
    'ERR_006 - Success page heading and message match expected strings',
    { tag: ['@regression'] },
    async ({ page }) => {
      const successPage = new CheckoutSuccessPage(page);
      await successPage.goto();
      const heading = await successPage.getHeading();
      expect(heading).toContain(checkoutData.successHeading);
      const message = await successPage.getMessage();
      expect(message).toContain(checkoutData.successMessage);
    },
  );

  // ── ERR_007 ─────────────────────────────────────────────────────────────────
  test(
    'ERR_007 - Clicking Finish on the success page returns to home',
    { tag: ['@regression'] },
    async ({ page }) => {
      const successPage = new CheckoutSuccessPage(page);
      await successPage.goto();
      await successPage.clickFinish();
      await expect(page).toHaveURL('/');
    },
  );

  // ── ERR_008 ─────────────────────────────────────────────────────────────────
  test(
    'ERR_008 - Direct navigation to /checkout/error shows the error state',
    { tag: ['@regression'] },
    async ({ page }) => {
      const errorPage = new CheckoutErrorPage(page);
      await errorPage.goto();
      expect(await errorPage.isVisible()).toBe(true);
      await expect(page).toHaveURL(/\/checkout\/error/);
    },
  );

  // ── ERR_009 ─────────────────────────────────────────────────────────────────
  test(
    'ERR_009 - Checkout error page heading matches expected string',
    { tag: ['@regression'] },
    async ({ page }) => {
      const errorPage = new CheckoutErrorPage(page);
      await errorPage.goto();
      const heading = await errorPage.getHeading();
      expect(heading).toContain(checkoutData.errorHeading);
    },
  );

  // ── ERR_010 ─────────────────────────────────────────────────────────────────
  test(
    'ERR_010 - "Try again" on the error page navigates back to /checkout',
    { tag: ['@regression'] },
    async ({ page }) => {
      const errorPage = new CheckoutErrorPage(page);
      await errorPage.goto();
      await errorPage.clickTryAgain();
      await expect(page).toHaveURL(/\/checkout/);
    },
  );
});
