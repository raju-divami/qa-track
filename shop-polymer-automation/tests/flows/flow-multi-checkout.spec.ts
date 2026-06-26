/**
 * FLOW_002 – Multi-Product Checkout
 *
 * Classification: @e2e
 *
 * Adds two products from different categories, verifies the combined cart,
 * and completes checkout successfully.
 *
 * Steps:
 *   1. Add a product from Men's T-Shirts
 *   2. Add a product from Ladies Outerwear
 *   3. Verify cart has 2 line items with correct totals
 *   4. Proceed through checkout and confirm success
 */
import { test, expect, type Page } from '@playwright/test';
import checkoutData from '../../test-data/checkout.json';
import cartData from '../../test-data/cart.json';
import {
  ProductListPage,
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  CheckoutSuccessPage,
} from '../../pages';
import { clearCart } from '../../utils';

async function addFirstProductFromCategory(
  page: Page,
  category: string,
  size: string,
): Promise<{ title: string; priceValue: number }> {
  const listPage = new ProductListPage(page);
  await listPage.goto(category);
  const card = listPage.getProductCard(0);
  const title = await card.getTitle();
  await card.click();
  const detailPage = new ProductDetailPage(page);
  await detailPage.title.waitForVisible();
  await detailPage.selectSize(size);
  const priceValue = await detailPage.getPriceValue();
  await detailPage.addToCart();
  await detailPage.cartModal.close();
  return { title, priceValue };
}

test(
  'FLOW_002 - Multi-product checkout: two categories, correct totals, and success',
  { tag: ['@e2e'] },
  async ({ page }) => {
    await page.goto('/');
    await clearCart(page);

    // ── Step 1: Add first product ─────────────────────────────────────────────
    const first = await addFirstProductFromCategory(
      page,
      cartData.primaryProduct.category,
      cartData.primaryProduct.size,
    );

    // ── Step 2: Add second product ────────────────────────────────────────────
    const second = await addFirstProductFromCategory(
      page,
      cartData.secondaryProduct.category,
      cartData.secondaryProduct.size,
    );

    // ── Step 3: Verify combined cart ──────────────────────────────────────────
    const cartPage = new CartPage(page);
    await cartPage.goto();

    expect(await cartPage.getCartItemCount()).toBe(2);

    const expectedTotal = first.priceValue + second.priceValue;
    const displayedTotal = await cartPage.getTotalValue();
    expect(displayedTotal).toBeCloseTo(expectedTotal, 1);

    // Header badge should show 2
    expect(await cartPage.header.getCartCount()).toBe(2);

    // ── Step 4: Checkout ──────────────────────────────────────────────────────
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/\/checkout/);

    const checkoutPage = new CheckoutPage(page);
    expect(await checkoutPage.getOrderSummaryRowCount()).toBe(2);

    const grandTotal = await checkoutPage.getGrandTotalValue();
    expect(grandTotal).toBeCloseTo(expectedTotal, 1);

    await checkoutPage.fillAccountInfo(
      checkoutData.validAccount.email,
      checkoutData.validAccount.phone,
    );
    await checkoutPage.fillShippingAddress(checkoutData.validShipping);
    await checkoutPage.fillPaymentInfo(checkoutData.validPayment);
    await checkoutPage.placeOrder();

    const successPage = new CheckoutSuccessPage(page);
    await successPage.waitForVisible();
    await expect(page).toHaveURL(/\/checkout\/success/);
    expect(await successPage.getHeading()).toContain(checkoutData.successHeading);
  },
);
