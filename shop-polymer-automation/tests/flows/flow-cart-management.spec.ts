/**
 * FLOW_003 – Cart Management Then Checkout
 *
 * Classification: @e2e
 *
 * Adds two products, updates one item's quantity, removes the other,
 * verifies the final cart state, and completes checkout.
 *
 * Steps:
 *   1. Add two products from two different categories
 *   2. In cart: update the first item's quantity to 3
 *   3. In cart: remove the second item entirely
 *   4. Verify only one item remains with updated quantity and recalculated total
 *   5. Complete checkout and confirm success
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
  'FLOW_003 - Cart management: update quantity, remove item, then checkout',
  { tag: ['@e2e'] },
  async ({ page }) => {
    await page.goto('/');
    await clearCart(page);

    // ── Step 1: Add two products ──────────────────────────────────────────────
    const first = await addFirstProductFromCategory(
      page,
      cartData.primaryProduct.category,
      cartData.primaryProduct.size,
    );
    const second = await addFirstProductFromCategory(
      page,
      cartData.secondaryProduct.category,
      cartData.secondaryProduct.size,
    );

    // ── Steps 2 & 3: Manage cart ──────────────────────────────────────────────
    const cartPage = new CartPage(page);
    await cartPage.goto();
    expect(await cartPage.getCartItemCount()).toBe(2);

    // Update first item quantity to 3
    const firstItem = cartPage.getCartItemByTitle(first.title.split(' ')[0]);
    await firstItem.setQuantity(cartData.updatedQuantity);
    await expect
      .poll(() => cartPage.getTotalValue(), { timeout: 5000 })
      .toBeGreaterThan(first.priceValue + second.priceValue);

    // Remove second item
    const secondItem = cartPage.getCartItemByTitle(second.title.split(' ')[0]);
    await secondItem.remove();
    await expect
      .poll(() => cartPage.getCartItemCount(), { timeout: 5000 })
      .toBe(1);

    // ── Step 4: Verify final cart state ───────────────────────────────────────
    expect(await cartPage.getCartItemCount()).toBe(1);
    const remainingItem = cartPage.getCartItem(0);
    expect(await remainingItem.getQuantity()).toBe(cartData.updatedQuantity);

    const expectedTotal = first.priceValue * Number(cartData.updatedQuantity);
    const displayedTotal = await cartPage.getTotalValue();
    expect(displayedTotal).toBeCloseTo(expectedTotal, 1);

    // ── Step 5: Complete checkout ──────────────────────────────────────────────
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/\/checkout/);

    const checkoutPage = new CheckoutPage(page);
    expect(await checkoutPage.getOrderSummaryRowCount()).toBe(1);
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
