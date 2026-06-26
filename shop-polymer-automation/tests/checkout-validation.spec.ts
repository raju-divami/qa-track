/**
 * Checkout Form Validation Tests
 *
 * Classification:
 *   @regression – these verify field-level constraints; run before every release
 *
 * Strategy: each test fills all fields with valid values except the one under
 * test, then submits the form and asserts that the targeted field is marked
 * invalid while all other fields remain valid.
 */
import { test, expect, type Page } from '@playwright/test';
import checkoutData from '../test-data/checkout.json';
import cartData from '../test-data/cart.json';
import { ProductListPage, ProductDetailPage, CheckoutPage } from '../pages';
import { clearCart } from '../utils';

// ── Shared helpers ────────────────────────────────────────────────────────────

async function setupCheckoutWithProduct(page: Page): Promise<CheckoutPage> {
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

async function fillValidFormExcept(
  checkoutPage: CheckoutPage,
  skipField: string,
): Promise<void> {
  const d = checkoutData;
  if (skipField !== 'email') await checkoutPage.email.setValue(d.validAccount.email);
  if (skipField !== 'phone') await checkoutPage.phone.setValue(d.validAccount.phone);
  if (skipField !== 'address') await checkoutPage.shipAddress.setValue(d.validShipping.address);
  if (skipField !== 'city') await checkoutPage.shipCity.setValue(d.validShipping.city);
  if (skipField !== 'state') await checkoutPage.shipState.setValue(d.validShipping.state);
  if (skipField !== 'zip') await checkoutPage.shipZip.setValue(d.validShipping.zip);
  await checkoutPage.shipCountry.selectByValue(d.validShipping.country);
  if (skipField !== 'ccName') await checkoutPage.ccName.setValue(d.validPayment.name);
  if (skipField !== 'ccNumber') await checkoutPage.ccNumber.setValue(d.validPayment.number);
  await checkoutPage.ccExpMonth.selectByValue(d.validPayment.expMonth);
  await checkoutPage.ccExpYear.selectByValue(d.validPayment.expYear);
  if (skipField !== 'cvv') await checkoutPage.ccCVV.setValue(d.validPayment.cvv);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('Checkout Form Validation', () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearCart(page);
    checkoutPage = await setupCheckoutWithProduct(page);
  });

  // ── VAL_001 ─────────────────────────────────────────────────────────────────
  test(
    'VAL_001 - Submitting an empty form marks all required text fields as invalid',
    { tag: ['@regression'] },
    async () => {
      await checkoutPage.placeOrder();
      expect(await checkoutPage.email.isInvalid()).toBe(true);
      expect(await checkoutPage.phone.isInvalid()).toBe(true);
      expect(await checkoutPage.shipAddress.isInvalid()).toBe(true);
      expect(await checkoutPage.shipCity.isInvalid()).toBe(true);
      expect(await checkoutPage.shipState.isInvalid()).toBe(true);
      expect(await checkoutPage.shipZip.isInvalid()).toBe(true);
      expect(await checkoutPage.ccName.isInvalid()).toBe(true);
      expect(await checkoutPage.ccNumber.isInvalid()).toBe(true);
      expect(await checkoutPage.ccCVV.isInvalid()).toBe(true);
    },
  );

  // ── VAL_002 ─────────────────────────────────────────────────────────────────
  test(
    'VAL_002 - Invalid email format causes email field to be marked invalid',
    { tag: ['@regression'] },
    async () => {
      await fillValidFormExcept(checkoutPage, 'email');
      await checkoutPage.email.setValue(checkoutData.invalidFields.email);
      await checkoutPage.placeOrder();
      expect(await checkoutPage.email.isInvalid()).toBe(true);
      expect(await checkoutPage.phone.isInvalid()).toBe(false);
    },
  );

  // ── VAL_003 ─────────────────────────────────────────────────────────────────
  test(
    'VAL_003 - Phone shorter than 10 digits is marked invalid',
    { tag: ['@regression'] },
    async () => {
      await fillValidFormExcept(checkoutPage, 'phone');
      await checkoutPage.phone.setValue(checkoutData.invalidFields.phone);
      await checkoutPage.placeOrder();
      expect(await checkoutPage.phone.isInvalid()).toBe(true);
      expect(await checkoutPage.email.isInvalid()).toBe(false);
    },
  );

  // ── VAL_004 ─────────────────────────────────────────────────────────────────
  test(
    'VAL_004 - Address shorter than 5 characters is marked invalid',
    { tag: ['@regression'] },
    async () => {
      await fillValidFormExcept(checkoutPage, 'address');
      await checkoutPage.shipAddress.setValue(checkoutData.invalidFields.address);
      await checkoutPage.placeOrder();
      expect(await checkoutPage.shipAddress.isInvalid()).toBe(true);
      expect(await checkoutPage.shipCity.isInvalid()).toBe(false);
    },
  );

  // ── VAL_005 ─────────────────────────────────────────────────────────────────
  test(
    'VAL_005 - City shorter than 2 characters is marked invalid',
    { tag: ['@regression'] },
    async () => {
      await fillValidFormExcept(checkoutPage, 'city');
      await checkoutPage.shipCity.setValue(checkoutData.invalidFields.city);
      await checkoutPage.placeOrder();
      expect(await checkoutPage.shipCity.isInvalid()).toBe(true);
      expect(await checkoutPage.shipState.isInvalid()).toBe(false);
    },
  );

  // ── VAL_006 ─────────────────────────────────────────────────────────────────
  test(
    'VAL_006 - State shorter than 2 characters is marked invalid',
    { tag: ['@regression'] },
    async () => {
      await fillValidFormExcept(checkoutPage, 'state');
      await checkoutPage.shipState.setValue(checkoutData.invalidFields.state);
      await checkoutPage.placeOrder();
      expect(await checkoutPage.shipState.isInvalid()).toBe(true);
      expect(await checkoutPage.shipZip.isInvalid()).toBe(false);
    },
  );

  // ── VAL_007 ─────────────────────────────────────────────────────────────────
  test(
    'VAL_007 - ZIP code shorter than 4 characters is marked invalid',
    { tag: ['@regression'] },
    async () => {
      await fillValidFormExcept(checkoutPage, 'zip');
      await checkoutPage.shipZip.setValue(checkoutData.invalidFields.zip);
      await checkoutPage.placeOrder();
      expect(await checkoutPage.shipZip.isInvalid()).toBe(true);
      expect(await checkoutPage.shipCity.isInvalid()).toBe(false);
    },
  );

  // ── VAL_008 ─────────────────────────────────────────────────────────────────
  test(
    'VAL_008 - Card name shorter than 3 characters is marked invalid',
    { tag: ['@regression'] },
    async () => {
      await fillValidFormExcept(checkoutPage, 'ccName');
      await checkoutPage.ccName.setValue(checkoutData.invalidFields.cardName);
      await checkoutPage.placeOrder();
      expect(await checkoutPage.ccName.isInvalid()).toBe(true);
      expect(await checkoutPage.ccNumber.isInvalid()).toBe(false);
    },
  );

  // ── VAL_009 ─────────────────────────────────────────────────────────────────
  test(
    'VAL_009 - Card number shorter than 15 digits is marked invalid',
    { tag: ['@regression'] },
    async () => {
      await fillValidFormExcept(checkoutPage, 'ccNumber');
      await checkoutPage.ccNumber.setValue(checkoutData.invalidFields.cardNumber);
      await checkoutPage.placeOrder();
      expect(await checkoutPage.ccNumber.isInvalid()).toBe(true);
      expect(await checkoutPage.ccName.isInvalid()).toBe(false);
    },
  );

  // ── VAL_010 ─────────────────────────────────────────────────────────────────
  test(
    'VAL_010 - CVV shorter than 3 digits is marked invalid',
    { tag: ['@regression'] },
    async () => {
      await fillValidFormExcept(checkoutPage, 'cvv');
      await checkoutPage.ccCVV.setValue(checkoutData.invalidFields.cvv);
      await checkoutPage.placeOrder();
      expect(await checkoutPage.ccCVV.isInvalid()).toBe(true);
      expect(await checkoutPage.ccNumber.isInvalid()).toBe(false);
    },
  );

  // ── VAL_011 ─────────────────────────────────────────────────────────────────
  test(
    'VAL_011 - Boundary-valid phone (exactly 10 digits) is accepted',
    { tag: ['@regression'] },
    async () => {
      await fillValidFormExcept(checkoutPage, 'phone');
      await checkoutPage.phone.setValue(checkoutData.boundaryFields.phone);
      await checkoutPage.placeOrder();
      expect(await checkoutPage.phone.isInvalid()).toBe(false);
    },
  );

  // ── VAL_012 ─────────────────────────────────────────────────────────────────
  test(
    'VAL_012 - Billing address fields are validated when the billing toggle is checked',
    { tag: ['@regression'] },
    async () => {
      await fillValidFormExcept(checkoutPage, '');
      await checkoutPage.billingToggle.check();
      // Leave billing fields empty and submit
      await checkoutPage.placeOrder();
      expect(await checkoutPage.billAddress.isInvalid()).toBe(true);
      expect(await checkoutPage.billCity.isInvalid()).toBe(true);
      expect(await checkoutPage.billZip.isInvalid()).toBe(true);
    },
  );
});
