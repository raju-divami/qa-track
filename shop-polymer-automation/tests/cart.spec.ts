/**
 * Shopping Cart Page Tests
 *
 * Classification:
 *   @sanity     – critical smoke checks
 *   @regression – full functional suite
 */
import { test, expect, type Page } from '@playwright/test';
import data from '../test-data/cart.json';
import { ProductListPage, ProductDetailPage, CartPage } from '../pages';
import { clearCart } from '../utils';

// ── Shared helper ─────────────────────────────────────────────────────────────

async function addFirstProductToCart(
  page: Page,
  category: string,
  size: string,
  quantity = '1',
): Promise<{ title: string; priceValue: number }> {
  const listPage = new ProductListPage(page);
  await listPage.goto(category);
  const card = listPage.getProductCard(0);
  const title = await card.getTitle();
  await card.click();
  const detailPage = new ProductDetailPage(page);
  await detailPage.title.waitForVisible();
  await detailPage.selectSize(size);
  await detailPage.selectQuantity(quantity);
  const priceValue = await detailPage.getPriceValue();
  await detailPage.addToCart();
  await detailPage.cartModal.close();
  return { title, priceValue };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('Shopping Cart Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearCart(page);
  });

  // ── CART_001 ────────────────────────────────────────────────────────────────
  test(
    'CART_001 - Empty cart shows the empty-cart message',
    { tag: ['@regression'] },
    async ({ page }) => {
      const cartPage = new CartPage(page);
      await cartPage.goto();
      expect(await cartPage.isEmpty()).toBe(true);
      expect(await cartPage.emptyMessage.isVisible()).toBe(true);
    },
  );

  // ── CART_002 ────────────────────────────────────────────────────────────────
  test(
    'CART_002 - Cart displays an added product with title, size, price, and quantity',
    { tag: ['@sanity', '@regression'] },
    async ({ page }) => {
      const { title, priceValue } = await addFirstProductToCart(
        page,
        data.primaryProduct.category,
        data.primaryProduct.size,
        data.primaryProduct.quantity,
      );
      const cartPage = new CartPage(page);
      await cartPage.goto();

      expect(await cartPage.hasItems()).toBe(true);
      expect(await cartPage.getCartItemCount()).toBe(1);

      const item = cartPage.getCartItem(0);
      expect(await item.isVisible()).toBe(true);
      expect(await item.getName()).toContain(title.split(' ')[0]);
      expect(await item.getSize()).toBe(data.primaryProduct.size);
      expect(await item.getQuantity()).toBe(data.primaryProduct.quantity);
      const itemPrice = await item.getPriceValue();
      expect(itemPrice).toBeCloseTo(priceValue, 1);
    },
  );

  // ── CART_003 ────────────────────────────────────────────────────────────────
  test(
    'CART_003 - Cart total equals the sum of all line-item prices',
    { tag: ['@regression'] },
    async ({ page }) => {
      const { priceValue } = await addFirstProductToCart(
        page,
        data.primaryProduct.category,
        data.primaryProduct.size,
        data.primaryProduct.quantity,
      );
      const cartPage = new CartPage(page);
      await cartPage.goto();

      const displayedTotal = await cartPage.getTotalValue();
      expect(displayedTotal).toBeCloseTo(priceValue * Number(data.primaryProduct.quantity), 1);
    },
  );

  // ── CART_004 ────────────────────────────────────────────────────────────────
  test(
    'CART_004 - Updating item quantity recalculates the cart total',
    { tag: ['@regression'] },
    async ({ page }) => {
      const { priceValue } = await addFirstProductToCart(
        page,
        data.primaryProduct.category,
        data.primaryProduct.size,
        data.primaryProduct.quantity,
      );
      const cartPage = new CartPage(page);
      await cartPage.goto();

      const item = cartPage.getCartItem(0);
      await item.setQuantity(data.updatedQuantity);

      const expectedTotal = priceValue * Number(data.updatedQuantity);
      await expect
        .poll(() => cartPage.getTotalValue(), { timeout: 5000 })
        .toBeCloseTo(expectedTotal, 1);
    },
  );

  // ── CART_005 ────────────────────────────────────────────────────────────────
  test(
    'CART_005 - Removing the only item leaves the cart empty',
    { tag: ['@regression'] },
    async ({ page }) => {
      await addFirstProductToCart(
        page,
        data.primaryProduct.category,
        data.primaryProduct.size,
        data.primaryProduct.quantity,
      );
      const cartPage = new CartPage(page);
      await cartPage.goto();

      expect(await cartPage.hasItems()).toBe(true);
      await cartPage.getCartItem(0).remove();

      await expect.poll(() => cartPage.isEmpty(), { timeout: 5000 }).toBe(true);
    },
  );

  // ── CART_006 ────────────────────────────────────────────────────────────────
  test(
    'CART_006 - Cart contents persist when navigating to another page and back',
    { tag: ['@regression'] },
    async ({ page }) => {
      const { title } = await addFirstProductToCart(
        page,
        data.primaryProduct.category,
        data.primaryProduct.size,
        data.primaryProduct.quantity,
      );
      // Navigate away to home page
      const cartPage = new CartPage(page);
      await cartPage.header.clickLogo();
      await expect(page).toHaveURL('/');

      // Return to cart
      await cartPage.goto();
      expect(await cartPage.hasItems()).toBe(true);
      expect(await cartPage.getCartItemCount()).toBe(1);
      expect(await cartPage.getCartItem(0).getName()).toContain(title.split(' ')[0]);
    },
  );

  // ── CART_007 ────────────────────────────────────────────────────────────────
  test(
    'CART_007 - Cart contents persist across a full page reload',
    { tag: ['@regression'] },
    async ({ page }) => {
      await addFirstProductToCart(
        page,
        data.primaryProduct.category,
        data.primaryProduct.size,
        data.primaryProduct.quantity,
      );
      await page.reload();
      const cartPage = new CartPage(page);
      await cartPage.goto();
      expect(await cartPage.hasItems()).toBe(true);
      expect(await cartPage.getCartItemCount()).toBe(1);
    },
  );

  // ── CART_008 ────────────────────────────────────────────────────────────────
  test(
    'CART_008 - Cart shows two separate line items after adding two different products',
    { tag: ['@regression'] },
    async ({ page }) => {
      await addFirstProductToCart(
        page,
        data.primaryProduct.category,
        data.primaryProduct.size,
        data.primaryProduct.quantity,
      );
      await addFirstProductToCart(
        page,
        data.secondaryProduct.category,
        data.secondaryProduct.size,
        data.secondaryProduct.quantity,
      );
      const cartPage = new CartPage(page);
      await cartPage.goto();
      expect(await cartPage.getCartItemCount()).toBe(2);
      expect(await cartPage.getTotalValue()).toBeGreaterThan(0);
    },
  );

  // ── CART_009 ────────────────────────────────────────────────────────────────
  test(
    'CART_009 - Checkout button navigates to the checkout page',
    { tag: ['@regression'] },
    async ({ page }) => {
      await addFirstProductToCart(
        page,
        data.primaryProduct.category,
        data.primaryProduct.size,
        data.primaryProduct.quantity,
      );
      const cartPage = new CartPage(page);
      await cartPage.goto();
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(/\/checkout/);
    },
  );
});
