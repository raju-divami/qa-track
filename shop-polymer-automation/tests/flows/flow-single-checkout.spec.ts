/**
 * FLOW_001 – Single Product Checkout (Happy Path)
 *
 * Classification: @e2e
 *
 * Complete journey from browsing the home page through purchasing one product.
 * This is the primary end-to-end smoke test for the entire purchase flow.
 *
 * Steps:
 *   1. Start on home page
 *   2. Navigate to a category via the tab bar
 *   3. Click the first product card
 *   4. Add to cart with default size and quantity
 *   5. Dismiss the modal and inspect the cart
 *   6. Proceed to checkout
 *   7. Fill the complete form with valid data
 *   8. Place the order
 *   9. Assert the success page is shown and cart is cleared
 */
import { test, expect } from '@playwright/test';
import checkoutData from '../../test-data/checkout.json';
import homeData from '../../test-data/home.json';
import cartData from '../../test-data/cart.json';
import {
  HomePage,
  ProductListPage,
  ProductDetailPage,
  CartPage,
  CheckoutPage,
  CheckoutSuccessPage,
} from '../../pages';
import { clearCart, isCartEmpty } from '../../utils';

test(
  'FLOW_001 - Single product happy-path checkout',
  { tag: ['@e2e', '@sanity'] },
  async ({ page }) => {
    await page.goto('/');
    await clearCart(page);

    // ── Step 1: Home page is visible ──────────────────────────────────────────
    const homePage = new HomePage(page);
    await homePage.goto();
    expect(await homePage.isVisible()).toBe(true);
    expect(await homePage.header.isCartBadgeVisible()).toBe(false);

    // ── Step 2: Navigate to category via tab ──────────────────────────────────
    const targetCategory = homeData.expectedCategories.find(
      (c) => c.name === cartData.primaryProduct.category,
    )!;
    await homePage.categoryTabs.clickTab(targetCategory.name);
    await expect(page).toHaveURL(targetCategory.expectedListUrl);

    // ── Step 3: Click the first product card ─────────────────────────────────
    const listPage = new ProductListPage(page);
    expect(await listPage.isVisible()).toBe(true);
    const card = listPage.getProductCard(0);
    const productTitle = await card.getTitle();
    const listedPrice = await card.getPriceValue();
    expect(listedPrice).toBeGreaterThan(0);
    await card.click();
    await expect(page).toHaveURL(/\/detail\//);

    // ── Step 4: Verify detail page and add to cart ────────────────────────────
    const detailPage = new ProductDetailPage(page);
    await detailPage.title.waitForVisible();
    expect(await detailPage.getTitle()).toBe(productTitle);
    const detailPrice = await detailPage.getPriceValue();
    expect(detailPrice).toBeCloseTo(listedPrice, 1);

    await detailPage.selectSize(cartData.primaryProduct.size);
    await detailPage.selectQuantity(cartData.primaryProduct.quantity);
    await detailPage.addToCart();

    expect(await detailPage.cartModal.isOpen()).toBe(true);
    expect(await detailPage.header.getCartCount()).toBeGreaterThan(0);

    // ── Step 5: Dismiss modal and verify cart ─────────────────────────────────
    await detailPage.cartModal.close();
    await detailPage.header.clickCart();
    await expect(page).toHaveURL(/\/cart/);

    const cartPage = new CartPage(page);
    expect(await cartPage.hasItems()).toBe(true);
    expect(await cartPage.getCartItemCount()).toBe(1);
    const cartItem = cartPage.getCartItem(0);
    expect(await cartItem.getSize()).toBe(cartData.primaryProduct.size);
    expect(await cartItem.getQuantity()).toBe(cartData.primaryProduct.quantity);
    expect(await cartPage.getTotalValue()).toBeCloseTo(detailPrice, 1);

    // ── Step 6–7: Go to checkout and fill form ────────────────────────────────
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/\/checkout/);

    const checkoutPage = new CheckoutPage(page);
    expect(await checkoutPage.isVisible()).toBe(true);
    expect(await checkoutPage.getOrderSummaryRowCount()).toBe(1);

    await checkoutPage.fillAccountInfo(
      checkoutData.validAccount.email,
      checkoutData.validAccount.phone,
    );
    await checkoutPage.fillShippingAddress(checkoutData.validShipping);
    await checkoutPage.fillPaymentInfo(checkoutData.validPayment);

    // ── Step 8: Place order ───────────────────────────────────────────────────
    await checkoutPage.placeOrder();

    // ── Step 9: Assert success page ───────────────────────────────────────────
    const successPage = new CheckoutSuccessPage(page);
    await successPage.waitForVisible();
    await expect(page).toHaveURL(/\/checkout\/success/);

    expect(await successPage.getHeading()).toContain(checkoutData.successHeading);
    expect(await successPage.getMessage()).toContain(checkoutData.successMessage);

    // Finish → home
    await successPage.clickFinish();
    await expect(page).toHaveURL('/');
    expect(await isCartEmpty(page)).toBe(true);
  },
);
