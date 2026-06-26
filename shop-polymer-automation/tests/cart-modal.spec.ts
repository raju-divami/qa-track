/**
 * Cart Modal Tests
 *
 * Classification:
 *   @sanity     – critical smoke checks
 *   @regression – full functional suite
 *
 * The cart modal (shop-cart-modal) appears after clicking "Add to Cart"
 * on the product detail page. It slides in from the right and offers
 * shortcuts to view the cart or proceed to checkout.
 */
import { test, expect, type Page } from '@playwright/test';
import data from '../test-data/cart.json';
import { ProductListPage, ProductDetailPage, CartPage, CheckoutPage } from '../pages';
import { clearCart } from '../utils';

// ── Shared helper ─────────────────────────────────────────────────────────────

async function openCartModal(page: Page): Promise<ProductDetailPage> {
  const listPage = new ProductListPage(page);
  await listPage.goto(data.primaryProduct.category);
  await listPage.getProductCard(0).click();
  const detailPage = new ProductDetailPage(page);
  await detailPage.title.waitForVisible();
  await detailPage.selectSize(data.primaryProduct.size);
  await detailPage.addToCart(); // waits for modal to open internally
  return detailPage;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('Cart Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearCart(page);
  });

  // ── MODAL_001 ───────────────────────────────────────────────────────────────
  test(
    'MODAL_001 - Cart modal appears after clicking Add to Cart',
    { tag: ['@sanity', '@regression'] },
    async ({ page }) => {
      const detailPage = await openCartModal(page);
      expect(await detailPage.cartModal.isOpen()).toBe(true);
    },
  );

  // ── MODAL_002 ───────────────────────────────────────────────────────────────
  test(
    'MODAL_002 - Cart modal displays the "Added to cart" label',
    { tag: ['@regression'] },
    async ({ page }) => {
      const detailPage = await openCartModal(page);
      const labelText = await detailPage.cartModal.getLabelText();
      expect(labelText.toLowerCase()).toContain('added to cart');
    },
  );

  // ── MODAL_003 ───────────────────────────────────────────────────────────────
  test(
    'MODAL_003 - View Cart button in modal navigates to the cart page',
    { tag: ['@regression'] },
    async ({ page }) => {
      const detailPage = await openCartModal(page);
      await detailPage.cartModal.goToCart();
      await expect(page).toHaveURL(/\/cart/);
      const cartPage = new CartPage(page);
      expect(await cartPage.hasItems()).toBe(true);
    },
  );

  // ── MODAL_004 ───────────────────────────────────────────────────────────────
  test(
    'MODAL_004 - Checkout button in modal navigates to the checkout page',
    { tag: ['@regression'] },
    async ({ page }) => {
      const detailPage = await openCartModal(page);
      await detailPage.cartModal.goToCheckout();
      await expect(page).toHaveURL(/\/checkout/);
      const checkoutPage = new CheckoutPage(page);
      expect(await checkoutPage.isVisible()).toBe(true);
    },
  );

  // ── MODAL_005 ───────────────────────────────────────────────────────────────
  test(
    'MODAL_005 - Close button dismisses the cart modal',
    { tag: ['@regression'] },
    async ({ page }) => {
      const detailPage = await openCartModal(page);
      expect(await detailPage.cartModal.isOpen()).toBe(true);
      await detailPage.cartModal.close();
      await expect
        .poll(() => detailPage.cartModal.isOpen(), { timeout: 3000 })
        .toBe(false);
    },
  );

  // ── MODAL_006 ───────────────────────────────────────────────────────────────
  test(
    'MODAL_006 - Header cart badge reflects the correct item count after modal appears',
    { tag: ['@regression'] },
    async ({ page }) => {
      const detailPage = await openCartModal(page);
      const count = await detailPage.header.getCartCount();
      expect(count).toBeGreaterThan(0);
      expect(await detailPage.header.isCartBadgeVisible()).toBe(true);
    },
  );
});
