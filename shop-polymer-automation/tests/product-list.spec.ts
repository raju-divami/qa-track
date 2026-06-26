/**
 * Product List Page Tests
 *
 * Classification:
 *   @sanity     – basic smoke checks run after every deploy
 *   @regression – full functional suite run before every release
 *   @mobile     – mobile-viewport variants
 */
import { test, expect } from '@playwright/test';
import data from '../test-data/product-list.json';
import { ProductListPage } from '../pages';
import { clearCart } from '../utils';

test.describe('Product List Page', () => {
  let listPage: ProductListPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearCart(page);
    listPage = new ProductListPage(page);
    await listPage.goto(data.testCategory);
  });

  // ── LIST_001 ────────────────────────────────────────────────────────────────
  test(
    'LIST_001 - Product list loads for a valid category',
    { tag: ['@sanity', '@regression'] },
    async () => {
      expect(await listPage.isVisible()).toBe(true);
      expect(await listPage.getCategoryTitle()).toBe(data.testCategoryTitle);
      expect(await listPage.getProductCardCount()).toBeGreaterThan(0);
    },
  );

  // ── LIST_002 ────────────────────────────────────────────────────────────────
  test(
    'LIST_002 - Product cards display a non-empty title and formatted price',
    { tag: ['@regression'] },
    async () => {
      const count = await listPage.getProductCardCount();
      expect(count).toBeGreaterThan(0);

      const card = listPage.getProductCard(0);
      const title = await card.getTitle();
      expect(title.length).toBeGreaterThan(0);

      const price = await card.getPrice();
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
      expect(await card.getPriceValue()).toBeGreaterThan(0);
    },
  );

  // ── LIST_003 ────────────────────────────────────────────────────────────────
  test(
    'LIST_003 - All four category lists load with the correct title',
    { tag: ['@regression'] },
    async ({ page }) => {
      for (const category of data.allCategories) {
        await listPage.goto(category.name);
        expect(await listPage.isVisible()).toBe(true);
        expect(await listPage.getCategoryTitle()).toBe(category.title);
        expect(await listPage.getProductCardCount()).toBeGreaterThan(0);
      }
    },
  );

  // ── LIST_004 ────────────────────────────────────────────────────────────────
  test(
    'LIST_004 - Clicking a product card navigates to the detail page',
    { tag: ['@sanity', '@regression'] },
    async ({ page }) => {
      const card = listPage.getProductCard(0);
      const href = await card.getHref();
      expect(href).toMatch(/\/detail\//);

      await card.click();
      await expect(page).toHaveURL(/\/detail\//);
    },
  );

  // ── LIST_005 ────────────────────────────────────────────────────────────────
  test(
    'LIST_005 - Product card href contains the category name',
    { tag: ['@regression'] },
    async () => {
      const card = listPage.getProductCard(0);
      const href = await card.getHref();
      expect(href).toContain(data.testCategory);
    },
  );

  // ── LIST_006 ────────────────────────────────────────────────────────────────
  test(
    'LIST_006 - Item count label is displayed and contains a number',
    { tag: ['@regression'] },
    async () => {
      const text = await listPage.getItemCountText();
      expect(text).toMatch(/\d+ items?/i);
    },
  );

  // ── LIST_007 ────────────────────────────────────────────────────────────────
  test(
    'LIST_007 - Network warning is not visible under normal conditions',
    { tag: ['@regression'] },
    async () => {
      expect(await listPage.isNetworkWarningVisible()).toBe(false);
    },
  );

  // ── LIST_008 ────────────────────────────────────────────────────────────────
  test(
    'LIST_008 - Active category tab is highlighted on the desktop list page',
    { tag: ['@regression'] },
    async () => {
      expect(await listPage.categoryTabs.isTabActive(data.testCategory)).toBe(true);
    },
  );
});

// ── Mobile describe ──────────────────────────────────────────────────────────
test.describe('Product List Page - Mobile', () => {
  test.use({ viewport: data.mobileViewport });

  let listPage: ProductListPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearCart(page);
    listPage = new ProductListPage(page);
    await listPage.goto(data.testCategory);
  });

  // ── LIST_009 ────────────────────────────────────────────────────────────────
  test(
    'LIST_009 - Product list renders correctly on a mobile viewport',
    { tag: ['@regression', '@mobile'] },
    async () => {
      expect(await listPage.isVisible()).toBe(true);
      expect(await listPage.getProductCardCount()).toBeGreaterThan(0);
      // Desktop tabs are hidden; hamburger is visible instead
      expect(await listPage.categoryTabs.isVisible()).toBe(false);
      expect(await listPage.header.isMenuButtonVisible()).toBe(true);
    },
  );
});
