/**
 * FLOW_004 – Checkout with Separate Billing Address
 *
 * Classification: @e2e
 *
 * Verifies that a user can complete checkout using a billing address
 * that differs from the shipping address.
 *
 * Steps:
 *   1. Add a product to the cart
 *   2. Navigate to checkout
 *   3. Fill account info and shipping address
 *   4. Enable the billing address toggle
 *   5. Fill a different billing address
 *   6. Fill payment info
 *   7. Place order and assert success
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
  'FLOW_004 - Checkout completes successfully with a separate billing address',
  { tag: ['@e2e'] },
  async ({ page }) => {
    await page.goto('/');
    await clearCart(page);

    // ── Step 1: Add a product ─────────────────────────────────────────────────
    const listPage = new ProductListPage(page);
    await listPage.goto(cartData.primaryProduct.category);
    await listPage.getProductCard(0).click();
    const detailPage = new ProductDetailPage(page);
    await detailPage.title.waitForVisible();
    await detailPage.selectSize(cartData.primaryProduct.size);
    await detailPage.addToCart();
    await detailPage.cartModal.goToCheckout();

    // ── Step 2: Verify checkout loaded ───────────────────────────────────────
    await expect(page).toHaveURL(/\/checkout/);
    const checkoutPage = new CheckoutPage(page);
    expect(await checkoutPage.isVisible()).toBe(true);

    // ── Steps 3–4: Billing toggle is off; turn it on ───────────────────────────
    expect(await checkoutPage.isBillingAddressVisible()).toBe(false);
    expect(await checkoutPage.billingToggle.isChecked()).toBe(false);

    await checkoutPage.fillAccountInfo(
      checkoutData.validAccount.email,
      checkoutData.validAccount.phone,
    );
    await checkoutPage.fillShippingAddress(checkoutData.validShipping);

    // ── Step 5: Enable and fill a separate billing address ────────────────────
    await checkoutPage.billingToggle.check();
    expect(await checkoutPage.isBillingAddressVisible()).toBe(true);
    expect(await checkoutPage.billingToggle.isChecked()).toBe(true);

    await checkoutPage.billAddress.setValue(checkoutData.validBilling.address);
    await checkoutPage.billCity.setValue(checkoutData.validBilling.city);
    await checkoutPage.billState.setValue(checkoutData.validBilling.state);
    await checkoutPage.billZip.setValue(checkoutData.validBilling.zip);
    await checkoutPage.billCountry.selectByValue(checkoutData.validBilling.country);

    // ── Step 6: Fill payment ───────────────────────────────────────────────────
    await checkoutPage.fillPaymentInfo(checkoutData.validPayment);

    // ── Step 7: Place order ────────────────────────────────────────────────────
    await checkoutPage.placeOrder();

    const successPage = new CheckoutSuccessPage(page);
    await successPage.waitForVisible();
    await expect(page).toHaveURL(/\/checkout\/success/);
    expect(await successPage.getHeading()).toContain(checkoutData.successHeading);
    expect(await successPage.getMessage()).toContain(checkoutData.successMessage);
  },
);
