/**
 * FLOW_008 – Validation Correction Then Successful Checkout
 *
 * Classification: @e2e
 *
 * Simulates a user who first submits the checkout form with invalid data,
 * observes the validation errors, corrects each field, and then successfully
 * places the order.
 *
 * Steps:
 *   1. Add a product and navigate to checkout
 *   2. Submit the form with all fields empty → all required fields become invalid
 *   3. Fill in invalid values for several fields and submit again
 *   4. Correct every invalid field with valid data
 *   5. Submit the corrected form and confirm success
 */
import { test, expect } from '@playwright/test';
import checkoutData from '../../test-data/checkout.json';
import cartData from '../../test-data/cart.json';
import {
  ProductListPage,
  ProductDetailPage,
  CheckoutPage,
  CheckoutSuccessPage,
} from '../../pages';
import { clearCart } from '../../utils';

test(
  'FLOW_008 - Validation errors are shown then corrected and checkout succeeds',
  { tag: ['@e2e'] },
  async ({ page }) => {
    await page.goto('/');
    await clearCart(page);

    // ── Step 1: Add a product and navigate to checkout ────────────────────────
    const listPage = new ProductListPage(page);
    await listPage.goto(cartData.primaryProduct.category);
    await listPage.getProductCard(0).click();
    const detailPage = new ProductDetailPage(page);
    await detailPage.title.waitForVisible();
    await detailPage.selectSize(cartData.primaryProduct.size);
    await detailPage.addToCart();
    await detailPage.cartModal.goToCheckout();
    await expect(page).toHaveURL(/\/checkout/);

    const checkoutPage = new CheckoutPage(page);
    expect(await checkoutPage.isVisible()).toBe(true);

    // ── Step 2: Submit empty form — all required fields become invalid ─────────
    await checkoutPage.placeOrder();
    expect(await checkoutPage.email.isInvalid()).toBe(true);
    expect(await checkoutPage.phone.isInvalid()).toBe(true);
    expect(await checkoutPage.shipAddress.isInvalid()).toBe(true);
    expect(await checkoutPage.ccNumber.isInvalid()).toBe(true);

    // ── Step 3: Fill some fields with invalid data and resubmit ──────────────
    await checkoutPage.email.setValue(checkoutData.invalidFields.email);
    await checkoutPage.phone.setValue(checkoutData.invalidFields.phone);
    await checkoutPage.shipAddress.setValue(checkoutData.invalidFields.address);
    await checkoutPage.ccNumber.setValue(checkoutData.invalidFields.cardNumber);
    await checkoutPage.placeOrder();

    // Specific invalid fields remain invalid
    expect(await checkoutPage.email.isInvalid()).toBe(true);
    expect(await checkoutPage.phone.isInvalid()).toBe(true);
    expect(await checkoutPage.shipAddress.isInvalid()).toBe(true);
    expect(await checkoutPage.ccNumber.isInvalid()).toBe(true);

    // ── Step 4: Correct every field ───────────────────────────────────────────
    await checkoutPage.fillAccountInfo(
      checkoutData.validAccount.email,
      checkoutData.validAccount.phone,
    );
    await checkoutPage.fillShippingAddress(checkoutData.validShipping);
    await checkoutPage.fillPaymentInfo(checkoutData.validPayment);

    // After filling valid values, invalid markers clear on next interaction
    // (The app re-validates when the user fixes a field and submits.)

    // ── Step 5: Submit the corrected form ─────────────────────────────────────
    await checkoutPage.placeOrder();

    const successPage = new CheckoutSuccessPage(page);
    await successPage.waitForVisible();
    await expect(page).toHaveURL(/\/checkout\/success/);
    expect(await successPage.getHeading()).toContain(checkoutData.successHeading);
    expect(await successPage.getMessage()).toContain(checkoutData.successMessage);
  },
);
