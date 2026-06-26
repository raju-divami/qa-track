/**
 * Navigation Tests
 *
 * Classification:
 *   @sanity     – critical routing smoke checks
 *   @regression – full routing and URL-handling suite
 *
 * These tests verify that the SPA router correctly loads pages for
 * valid paths, shows 404 for invalid paths, and that browser
 * back/forward navigation behaves as expected.
 */
import { test, expect } from '@playwright/test';
import data from '../test-data/navigation.json';
import homeData from '../test-data/home.json';
import { HomePage, ProductListPage, CartPage, CheckoutPage, NotFoundPage } from '../pages';
import { clearCart } from '../utils';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearCart(page);
  });

  // ── NAV_001 ─────────────────────────────────────────────────────────────────
  test(
    'NAV_001 - Direct navigation to / loads the home page',
    { tag: ['@sanity', '@regression'] },
    async ({ page }) => {
      await expect(page).toHaveURL('/');
      const homePage = new HomePage(page);
      expect(await homePage.isVisible()).toBe(true);
    },
  );

  // ── NAV_002 ─────────────────────────────────────────────────────────────────
  test(
    'NAV_002 - Direct navigation to a category list URL loads the list page',
    { tag: ['@sanity', '@regression'] },
    async ({ page }) => {
      const listPage = new ProductListPage(page);
      await listPage.goto('mens_tshirts');
      await expect(page).toHaveURL(data.validCategoryRoute);
      expect(await listPage.isVisible()).toBe(true);
    },
  );

  // ── NAV_003 ─────────────────────────────────────────────────────────────────
  test(
    'NAV_003 - Direct navigation to /cart loads the cart page',
    { tag: ['@regression'] },
    async ({ page }) => {
      const cartPage = new CartPage(page);
      await cartPage.goto();
      await expect(page).toHaveURL(data.cartUrl);
      expect(await cartPage.isVisible()).toBe(true);
    },
  );

  // ── NAV_004 ─────────────────────────────────────────────────────────────────
  test(
    'NAV_004 - Navigating to an invalid route shows the 404 page',
    { tag: ['@regression'] },
    async ({ page }) => {
      const notFoundPage = new NotFoundPage(page);
      for (const path of data.invalidPaths) {
        await notFoundPage.goto(path);
        expect(await notFoundPage.isVisible()).toBe(true);
      }
    },
  );

  // ── NAV_005 ─────────────────────────────────────────────────────────────────
  test(
    'NAV_005 - Browser back button returns to the previous page',
    { tag: ['@regression'] },
    async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      // Navigate to a category list
      await homePage.clickCategoryImage(homeData.expectedCategories[0].name);
      await expect(page).toHaveURL(homeData.expectedCategories[0].expectedListUrl);

      // Go back
      await page.goBack();
      await expect(page).toHaveURL('/');
      expect(await homePage.isVisible()).toBe(true);
    },
  );

  // ── NAV_006 ─────────────────────────────────────────────────────────────────
  test(
    'NAV_006 - Browser forward button re-navigates to the next page',
    { tag: ['@regression'] },
    async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      const firstCategory = homeData.expectedCategories[0];
      await homePage.clickCategoryImage(firstCategory.name);
      await expect(page).toHaveURL(firstCategory.expectedListUrl);

      await page.goBack();
      await expect(page).toHaveURL('/');

      await page.goForward();
      await expect(page).toHaveURL(firstCategory.expectedListUrl);
    },
  );

  // ── NAV_007 ─────────────────────────────────────────────────────────────────
  test(
    'NAV_007 - Cart icon in header navigates to /cart',
    { tag: ['@regression'] },
    async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();
      await homePage.header.clickCart();
      await expect(page).toHaveURL(data.cartUrl);
    },
  );

  // ── NAV_008 ─────────────────────────────────────────────────────────────────
  test(
    'NAV_008 - Category tabs on desktop navigate to the correct list URL',
    { tag: ['@regression'] },
    async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();

      for (const category of homeData.expectedCategories) {
        await homePage.goto();
        await homePage.categoryTabs.clickTab(category.name);
        await expect(page).toHaveURL(category.expectedListUrl);
      }
    },
  );

  // ── NAV_009 ─────────────────────────────────────────────────────────────────
  test(
    'NAV_009 - "Shop Now" button on home page navigates to the correct list URL',
    { tag: ['@regression'] },
    async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();
      const firstCategory = homeData.expectedCategories[0];
      await homePage.clickShopNow(firstCategory.name);
      await expect(page).toHaveURL(firstCategory.expectedListUrl);
    },
  );

  // ── NAV_010 ─────────────────────────────────────────────────────────────────
  test(
    'NAV_010 - Checkout page is reachable directly via /checkout URL',
    { tag: ['@regression'] },
    async ({ page }) => {
      const checkoutPage = new CheckoutPage(page);
      await checkoutPage.goto();
      await expect(page).toHaveURL(data.checkoutUrl);
      expect(await checkoutPage.isVisible()).toBe(true);
    },
  );
});
