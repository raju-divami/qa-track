/**
 * Checkout Page Tests
 *
 * Classification:
 *   @sanity     – critical smoke checks
 *   @regression – full functional suite
 *
 * Each test requires at least one item in the cart before reaching checkout.
 * The beforeEach adds a product via the UI to keep tests realistic and
 * independent of internal storage utilities.
 */
import { test, expect, type Page } from '@playwright/test';
import checkoutData from '../test-data/checkout.json';
import cartData from '../test-data/cart.json';
import {
  ProductListPage,
  ProductDetailPage,
  CheckoutPage,
  CheckoutSuccessPage,
  CheckoutErrorPage,
} from '../pages';
import { clearCart } from '../utils';

// ── Shared helpers ────────────────────────────────────────────────────────────

async function addProductAndGoToCheckout(page: Page): Promise<CheckoutPage> {
  const listPage = new ProductListPage(page);
  await listPage.goto(cartData.primaryProduct.category);
  await listPage.getProductCard(0).click();
  const detailPage = new ProductDetailPage(page);
  await detailPage.title.waitForVisible();
  await detailPage.selectSize(cartData.primaryProduct.size);
  await detailPage.addToCart();
  await detailPage.cartModal.goToCheckout();
  const checkoutPage = new CheckoutPage(page);
  await expect(page).toHaveURL(/\/checkout/);
  return checkoutPage;
}

async function fillCompleteForm(checkoutPage: CheckoutPage): Promise<void> {
  await checkoutPage.fillAccountInfo(
    checkoutData.validAccount.email,
    checkoutData.validAccount.phone,
  );
  await checkoutPage.fillShippingAddress(checkoutData.validShipping);
  await checkoutPage.fillPaymentInfo(checkoutData.validPayment);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('Checkout Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearCart(page);
  });

  // ── CO_001 ──────────────────────────────────────────────────────────────────
  test(
    'CO_001 - Checkout page loads and shows all form sections',
    { tag: ['@sanity', '@regression'] },
    async ({ page }) => {
      const checkoutPage = await addProductAndGoToCheckout(page);
      expect(await checkoutPage.isVisible()).toBe(true);
      expect(await checkoutPage.email.isVisible()).toBe(true);
      expect(await checkoutPage.phone.isVisible()).toBe(true);
      expect(await checkoutPage.shipAddress.isVisible()).toBe(true);
      expect(await checkoutPage.shipCity.isVisible()).toBe(true);
      expect(await checkoutPage.shipState.isVisible()).toBe(true);
      expect(await checkoutPage.shipZip.isVisible()).toBe(true);
      expect(await checkoutPage.shipCountry.isVisible()).toBe(true);
      expect(await checkoutPage.ccName.isVisible()).toBe(true);
      expect(await checkoutPage.ccNumber.isVisible()).toBe(true);
      expect(await checkoutPage.ccCVV.isVisible()).toBe(true);
      expect(await checkoutPage.placeOrderButton.isVisible()).toBe(true);
    },
  );

  // ── CO_002 ──────────────────────────────────────────────────────────────────
  test(
    'CO_002 - Billing address fields are hidden until the toggle is checked',
    { tag: ['@regression'] },
    async ({ page }) => {
      const checkoutPage = await addProductAndGoToCheckout(page);
      expect(await checkoutPage.isBillingAddressVisible()).toBe(false);
      await checkoutPage.billingToggle.check();
      expect(await checkoutPage.isBillingAddressVisible()).toBe(true);
    },
  );

  // ── CO_003 ──────────────────────────────────────────────────────────────────
  test(
    'CO_003 - Unchecking the billing toggle hides billing fields again',
    { tag: ['@regression'] },
    async ({ page }) => {
      const checkoutPage = await addProductAndGoToCheckout(page);
      await checkoutPage.billingToggle.check();
      expect(await checkoutPage.isBillingAddressVisible()).toBe(true);
      await checkoutPage.billingToggle.uncheck();
      expect(await checkoutPage.isBillingAddressVisible()).toBe(false);
    },
  );

  // ── CO_004 ──────────────────────────────────────────────────────────────────
  test(
    'CO_004 - Shipping country dropdown has selectable options',
    { tag: ['@regression'] },
    async ({ page }) => {
      const checkoutPage = await addProductAndGoToCheckout(page);
      const options = await checkoutPage.shipCountry.getOptions();
      expect(options.length).toBeGreaterThan(1);
    },
  );

  // ── CO_005 ──────────────────────────────────────────────────────────────────
  test(
    'CO_005 - Expiry month and year dropdowns have selectable options',
    { tag: ['@regression'] },
    async ({ page }) => {
      const checkoutPage = await addProductAndGoToCheckout(page);
      const months = await checkoutPage.ccExpMonth.getOptions();
      expect(months.length).toBeGreaterThan(1);
      const years = await checkoutPage.ccExpYear.getOptions();
      expect(years.length).toBeGreaterThan(1);
    },
  );

  // ── CO_006 ──────────────────────────────────────────────────────────────────
  test(
    'CO_006 - Order summary row appears for each cart item',
    { tag: ['@regression'] },
    async ({ page }) => {
      const checkoutPage = await addProductAndGoToCheckout(page);
      const rowCount = await checkoutPage.getOrderSummaryRowCount();
      expect(rowCount).toBeGreaterThan(0);
    },
  );

  // ── CO_007 ──────────────────────────────────────────────────────────────────
  test(
    'CO_007 - Grand total is displayed and is greater than zero',
    { tag: ['@regression'] },
    async ({ page }) => {
      const checkoutPage = await addProductAndGoToCheckout(page);
      const total = await checkoutPage.getGrandTotal();
      expect(total).toMatch(/^\$\d+\.\d{2}$/);
      expect(await checkoutPage.getGrandTotalValue()).toBeGreaterThan(0);
    },
  );

  // ── CO_008 ──────────────────────────────────────────────────────────────────
  test(
    'CO_008 - Submitting a complete valid form navigates to the success page',
    { tag: ['@sanity', '@regression'] },
    async ({ page }) => {
      const checkoutPage = await addProductAndGoToCheckout(page);
      await fillCompleteForm(checkoutPage);
      await checkoutPage.placeOrder();

      const successPage = new CheckoutSuccessPage(page);
      await successPage.waitForVisible();
      await expect(page).toHaveURL(/\/checkout\/success/);
      const heading = await successPage.getHeading();
      expect(heading).toContain(checkoutData.successHeading);
    },
  );

  // ── CO_009 ──────────────────────────────────────────────────────────────────
  test(
    'CO_009 - Success page message confirms the order was received',
    { tag: ['@regression'] },
    async ({ page }) => {
      const checkoutPage = await addProductAndGoToCheckout(page);
      await fillCompleteForm(checkoutPage);
      await checkoutPage.placeOrder();

      const successPage = new CheckoutSuccessPage(page);
      await successPage.waitForVisible();
      const message = await successPage.getMessage();
      expect(message).toContain(checkoutData.successMessage);
    },
  );

  // ── CO_010 ──────────────────────────────────────────────────────────────────
  test(
    'CO_010 - Clicking Finish on success page returns to home',
    { tag: ['@regression'] },
    async ({ page }) => {
      const checkoutPage = await addProductAndGoToCheckout(page);
      await fillCompleteForm(checkoutPage);
      await checkoutPage.placeOrder();

      const successPage = new CheckoutSuccessPage(page);
      await successPage.waitForVisible();
      await successPage.clickFinish();
      await expect(page).toHaveURL('/');
    },
  );

  // ── CO_011 ──────────────────────────────────────────────────────────────────
  test(
    'CO_011 - Checkout with a separate billing address submits successfully',
    { tag: ['@regression'] },
    async ({ page }) => {
      const checkoutPage = await addProductAndGoToCheckout(page);
      await checkoutPage.fillAccountInfo(
        checkoutData.validAccount.email,
        checkoutData.validAccount.phone,
      );
      await checkoutPage.fillShippingAddress(checkoutData.validShipping);
      await checkoutPage.fillBillingAddress(checkoutData.validBilling);
      await checkoutPage.fillPaymentInfo(checkoutData.validPayment);
      await checkoutPage.placeOrder();

      const successPage = new CheckoutSuccessPage(page);
      await successPage.waitForVisible();
      await expect(page).toHaveURL(/\/checkout\/success/);
    },
  );

  // ── CO_012 ──────────────────────────────────────────────────────────────────
  test(
    'CO_012 - Checkout page shows empty-cart state when cart is empty',
    { tag: ['@regression'] },
    async ({ page }) => {
      // Navigate to checkout without adding anything to cart
      const checkoutPage = new CheckoutPage(page);
      await checkoutPage.goto();
      expect(await checkoutPage.isEmptyCartMessageVisible()).toBe(true);
    },
  );
});
