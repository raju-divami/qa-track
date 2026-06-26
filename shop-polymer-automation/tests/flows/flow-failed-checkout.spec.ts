/**
 * FLOW_005 – Checkout Error Page
 *
 * Classification: @e2e
 *
 * Verifies the checkout error experience: the error page displays the correct
 * heading, provides a "Try again" action, and navigating "Try again" returns
 * the user to the checkout form.
 *
 * Note: The Shop Polymer demo server always returns a success response for POST
 * /checkout, so this flow tests the error UI by navigating directly to
 * /checkout/error — which the SPA router fully supports.
 */
import { test, expect } from '@playwright/test';
import checkoutData from '../../test-data/checkout.json';
import { CheckoutErrorPage, CheckoutPage } from '../../pages';
import { clearCart } from '../../utils';

test(
  'FLOW_005 - Checkout error page shows correct UI and Try Again links back to checkout',
  { tag: ['@e2e'] },
  async ({ page }) => {
    await page.goto('/');
    await clearCart(page);

    // ── Step 1: Navigate directly to the checkout error state ─────────────────
    const errorPage = new CheckoutErrorPage(page);
    await errorPage.goto();
    await expect(page).toHaveURL(/\/checkout\/error/);

    // ── Step 2: Verify error heading ──────────────────────────────────────────
    expect(await errorPage.isVisible()).toBe(true);
    const heading = await errorPage.getHeading();
    expect(heading).toContain(checkoutData.errorHeading);

    // ── Step 3: Verify "Try again" restores the checkout form ─────────────────
    await errorPage.clickTryAgain();
    await expect(page).toHaveURL(/\/checkout/);
    const checkoutPage = new CheckoutPage(page);
    expect(await checkoutPage.isVisible()).toBe(true);
  },
);
