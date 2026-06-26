/**
 * FLOW_007 – Same Product in Multiple Sizes
 *
 * Classification: @e2e
 *
 * Adds the same product in three different sizes and verifies that the cart
 * creates a separate line item per size combination. Confirms total calculation
 * and completes checkout.
 *
 * Steps:
 *   1. Navigate to a product detail page
 *   2. Add the product in size S, L, and XL (three Add-to-Cart actions)
 *   3. Go to the cart and verify 3 separate line items with correct sizes
 *   4. Verify the grand total equals price × 3
 *   5. Complete checkout
 */
import { test, expect } from '@playwright/test';
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

test(
  'FLOW_007 - Same product added in multiple sizes creates separate cart line items',
  { tag: ['@e2e'] },
  async ({ page }) => {
    await page.goto('/');
    await clearCart(page);

    // ── Navigate to a product and capture its price ───────────────────────────
    const listPage = new ProductListPage(page);
    await listPage.goto(cartData.primaryProduct.category);
    await listPage.getProductCard(0).click();
    const detailPage = new ProductDetailPage(page);
    await detailPage.title.waitForVisible();
    const unitPrice = await detailPage.getPriceValue();

    // ── Steps 1–2: Add the same product in each of the three sizes ────────────
    const sizes = cartData.sameProductSizes;
    for (const size of sizes) {
      await detailPage.selectSize(size);
      await detailPage.addToCart();
      await detailPage.cartModal.close();
    }

    // Header badge should show 3
    expect(await detailPage.header.getCartCount()).toBe(sizes.length);

    // ── Step 3: Cart has 3 separate line items ────────────────────────────────
    const cartPage = new CartPage(page);
    await cartPage.goto();
    expect(await cartPage.getCartItemCount()).toBe(sizes.length);

    const cartSizes: string[] = [];
    for (let i = 0; i < sizes.length; i++) {
      cartSizes.push(await cartPage.getCartItem(i).getSize());
    }
    for (const size of sizes) {
      expect(cartSizes).toContain(size);
    }

    // ── Step 4: Grand total = unit price × number of sizes ────────────────────
    const expectedTotal = unitPrice * sizes.length;
    const displayedTotal = await cartPage.getTotalValue();
    expect(displayedTotal).toBeCloseTo(expectedTotal, 1);

    // ── Step 5: Complete checkout ─────────────────────────────────────────────
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/\/checkout/);

    const checkoutPage = new CheckoutPage(page);
    expect(await checkoutPage.getOrderSummaryRowCount()).toBe(sizes.length);
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
