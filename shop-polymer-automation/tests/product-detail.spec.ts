/**
 * Product Detail Page Tests
 *
 * Classification:
 *   @sanity     – critical smoke checks
 *   @regression – full functional suite
 */
import { test, expect } from '@playwright/test';
import data from '../test-data/product-detail.json';
import { ProductListPage, ProductDetailPage } from '../pages';
import { clearCart } from '../utils';

test.describe('Product Detail Page', () => {
  let detailPage: ProductDetailPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearCart(page);
    // Navigate via list → first card to avoid hardcoding item slugs
    const listPage = new ProductListPage(page);
    await listPage.goto(data.testCategory);
    await listPage.getProductCard(0).click();
    detailPage = new ProductDetailPage(page);
    await detailPage.title.waitForVisible();
  });

  // ── DETAIL_001 ──────────────────────────────────────────────────────────────
  test(
    'DETAIL_001 - Detail page loads with all key elements visible',
    { tag: ['@sanity', '@regression'] },
    async () => {
      expect(await detailPage.isContentVisible()).toBe(true);
      expect(await detailPage.title.isVisible()).toBe(true);
      expect(await detailPage.price.isVisible()).toBe(true);
      expect(await detailPage.sizeSelect.isVisible()).toBe(true);
      expect(await detailPage.quantitySelect.isVisible()).toBe(true);
      expect(await detailPage.addToCartButton.isVisible()).toBe(true);
    },
  );

  // ── DETAIL_002 ──────────────────────────────────────────────────────────────
  test(
    'DETAIL_002 - Product title is non-empty',
    { tag: ['@regression'] },
    async () => {
      const title = await detailPage.getTitle();
      expect(title.length).toBeGreaterThan(0);
    },
  );

  // ── DETAIL_003 ──────────────────────────────────────────────────────────────
  test(
    'DETAIL_003 - Product price is displayed in $X.XX currency format',
    { tag: ['@regression'] },
    async () => {
      const price = await detailPage.getPrice();
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
      expect(await detailPage.getPriceValue()).toBeGreaterThan(0);
    },
  );

  // ── DETAIL_004 ──────────────────────────────────────────────────────────────
  test(
    'DETAIL_004 - Size picker defaults to M',
    { tag: ['@regression'] },
    async () => {
      expect(await detailPage.getSelectedSize()).toBe(data.defaultSize);
    },
  );

  // ── DETAIL_005 ──────────────────────────────────────────────────────────────
  test(
    'DETAIL_005 - Quantity picker defaults to 1',
    { tag: ['@regression'] },
    async () => {
      expect(await detailPage.getSelectedQuantity()).toBe(data.defaultQuantity);
    },
  );

  // ── DETAIL_006 ──────────────────────────────────────────────────────────────
  test(
    'DETAIL_006 - Size picker contains all expected size options',
    { tag: ['@regression'] },
    async () => {
      const options = await detailPage.sizeSelect.getOptions();
      const values = options.map((o) => o.value);
      for (const size of data.allSizes) {
        expect(values).toContain(size);
      }
    },
  );

  // ── DETAIL_007 ──────────────────────────────────────────────────────────────
  test(
    'DETAIL_007 - Quantity picker contains all expected quantity options',
    { tag: ['@regression'] },
    async () => {
      const options = await detailPage.quantitySelect.getOptions();
      const values = options.map((o) => o.value);
      for (const qty of data.allQuantities) {
        expect(values).toContain(qty);
      }
    },
  );

  // ── DETAIL_008 ──────────────────────────────────────────────────────────────
  test(
    'DETAIL_008 - Selecting a different size updates the picker value',
    { tag: ['@regression'] },
    async () => {
      await detailPage.selectSize(data.alternateSize);
      expect(await detailPage.getSelectedSize()).toBe(data.alternateSize);
    },
  );

  // ── DETAIL_009 ──────────────────────────────────────────────────────────────
  test(
    'DETAIL_009 - Selecting a different quantity updates the picker value',
    { tag: ['@regression'] },
    async () => {
      await detailPage.selectQuantity(data.alternateQuantity);
      expect(await detailPage.getSelectedQuantity()).toBe(data.alternateQuantity);
    },
  );

  // ── DETAIL_010 ──────────────────────────────────────────────────────────────
  test(
    'DETAIL_010 - Add to Cart opens the cart modal',
    { tag: ['@sanity', '@regression'] },
    async () => {
      await detailPage.addToCart();
      expect(await detailPage.cartModal.isOpen()).toBe(true);
    },
  );

  // ── DETAIL_011 ──────────────────────────────────────────────────────────────
  test(
    'DETAIL_011 - Add to Cart increments the header cart badge count',
    { tag: ['@regression'] },
    async () => {
      expect(await detailPage.header.isCartBadgeVisible()).toBe(false);
      await detailPage.addToCart();
      const count = await detailPage.header.getCartCount();
      expect(count).toBeGreaterThan(0);
    },
  );

  // ── DETAIL_012 ──────────────────────────────────────────────────────────────
  test(
    'DETAIL_012 - Adding same product again increments the cart count further',
    { tag: ['@regression'] },
    async () => {
      await detailPage.addToCart();
      const countAfterFirst = await detailPage.header.getCartCount();
      await detailPage.cartModal.close();
      await detailPage.addToCart();
      const countAfterSecond = await detailPage.header.getCartCount();
      expect(countAfterSecond).toBeGreaterThan(countAfterFirst);
    },
  );

  // ── DETAIL_013 ──────────────────────────────────────────────────────────────
  test(
    'DETAIL_013 - Back button is visible and returns to the list page',
    { tag: ['@regression'] },
    async ({ page }) => {
      expect(await detailPage.header.isBackButtonVisible()).toBe(true);
      await detailPage.header.clickBack();
      await expect(page).toHaveURL(/\/list\//);
    },
  );

  // ── DETAIL_014 ──────────────────────────────────────────────────────────────
  test(
    'DETAIL_014 - Network warning is not visible under normal conditions',
    { tag: ['@regression'] },
    async () => {
      expect(await detailPage.isNetworkWarningVisible()).toBe(false);
    },
  );
});
