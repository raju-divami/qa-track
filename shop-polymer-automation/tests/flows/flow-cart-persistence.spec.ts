/**
 * FLOW_006 – Cart Persistence Across Navigation and Reload
 *
 * Classification: @e2e
 *
 * Verifies that the cart (backed by localStorage) survives:
 *   - Navigating to other pages and returning
 *   - A full browser page reload
 *
 * After confirming persistence the test also completes checkout.
 *
 * Steps:
 *   1. Add a product to the cart
 *   2. Navigate to the home page (cart should persist)
 *   3. Navigate to a different category list (cart should persist)
 *   4. Reload the browser (cart should persist via localStorage)
 *   5. Return to the cart and confirm contents
 *   6. Complete checkout
 */
import { test, expect } from '@playwright/test';
import checkoutData from '../../test-data/checkout.json';
import cartData from '../../test-data/cart.json';
import homeData from '../../test-data/home.json';
import {
  ProductListPage,
  ProductDetailPage,
  HomePage,
  CartPage,
  CheckoutPage,
  CheckoutSuccessPage,
} from '../../pages';
import { clearCart } from '../../utils';

test(
  'FLOW_006 - Cart contents persist across navigation and a full page reload',
  { tag: ['@e2e'] },
  async ({ page }) => {
    await page.goto('/');
    await clearCart(page);

    // ── Step 1: Add a product ─────────────────────────────────────────────────
    const listPage = new ProductListPage(page);
    await listPage.goto(cartData.primaryProduct.category);
    const card = listPage.getProductCard(0);
    const productTitle = await card.getTitle();
    await card.click();
    const detailPage = new ProductDetailPage(page);
    await detailPage.title.waitForVisible();
    const priceValue = await detailPage.getPriceValue();
    await detailPage.selectSize(cartData.primaryProduct.size);
    await detailPage.addToCart();
    expect(await detailPage.header.getCartCount()).toBe(1);
    await detailPage.cartModal.close();

    // ── Step 2: Navigate to home — cart badge should still show 1 ─────────────
    const homePage = new HomePage(page);
    await homePage.goto();
    expect(await homePage.header.getCartCount()).toBe(1);
    expect(await homePage.isVisible()).toBe(true);

    // ── Step 3: Navigate to another category list ─────────────────────────────
    const otherCategory = homeData.expectedCategories.find(
      (c) => c.name !== cartData.primaryProduct.category,
    )!;
    await listPage.goto(otherCategory.name);
    expect(await listPage.isVisible()).toBe(true);
    expect(await listPage.header.getCartCount()).toBe(1);

    // ── Step 4: Full page reload ──────────────────────────────────────────────
    await page.reload();
    await listPage.isVisible(); // wait for page to re-render
    expect(await listPage.header.getCartCount()).toBe(1);

    // ── Step 5: Return to cart and verify contents ────────────────────────────
    const cartPage = new CartPage(page);
    await cartPage.goto();
    expect(await cartPage.hasItems()).toBe(true);
    expect(await cartPage.getCartItemCount()).toBe(1);
    expect(await cartPage.getCartItem(0).getName()).toContain(productTitle.split(' ')[0]);
    expect(await cartPage.getCartItem(0).getSize()).toBe(cartData.primaryProduct.size);
    expect(await cartPage.getTotalValue()).toBeCloseTo(priceValue, 1);

    // ── Step 6: Complete checkout ─────────────────────────────────────────────
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/\/checkout/);

    const checkoutPage = new CheckoutPage(page);
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
