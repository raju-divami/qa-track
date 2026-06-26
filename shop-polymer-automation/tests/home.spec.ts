import { test, expect } from '@playwright/test';
import data from '../test-data/home.json';
import { HomePage } from '../pages';
import { clearCart } from '../utils';

test.describe('Home Page - Desktop', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearCart(page);
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('HOME_001 - Home page loads successfully', async () => {
    expect(await homePage.isVisible()).toBe(true);
    expect(await homePage.header.logoLink.isVisible()).toBe(true);
    expect(await homePage.getCategoryCount()).toBe(data.expectedCategoryCount);
  });

  test('HOME_002 - All four product categories are displayed', async () => {
    expect(await homePage.getCategoryCount()).toBe(data.expectedCategoryCount);
    const titles = await homePage.getAllCategoryTitles();
    expect(titles).toEqual(data.expectedCategories.map((c) => c.title));
  });

  test('HOME_003 - Each category tile is visible with title and Shop Now button', async () => {
    for (const category of data.expectedCategories) {
      await expect(homePage.getCategoryTile(category.name)).toBeVisible();
      await expect(homePage.getCategoryTitle(category.name).locator()).toBeVisible();
      await expect(homePage.getShopNowButton(category.name).locator()).toBeVisible();
    }
  });

  test('HOME_004 - Clicking a category tile navigates to the product list', async ({ page }) => {
    for (const category of data.expectedCategories) {
      await homePage.goto();
      await homePage.clickCategoryImage(category.name);
      await expect(page).toHaveURL(category.expectedListUrl);
    }
  });

  test('HOME_005 - Desktop category tabs are visible and navigate correctly', async ({ page }) => {
    expect(await homePage.categoryTabs.isVisible()).toBe(true);

    const tabLabels = await homePage.categoryTabs.getTabLabels();
    expect(tabLabels).toEqual(data.expectedCategories.map((c) => c.title));

    const tabNames = await homePage.categoryTabs.getTabNames();
    expect(tabNames).toEqual(data.expectedCategories.map((c) => c.name));

    const firstCategory = data.expectedCategories[0];
    await homePage.categoryTabs.clickTab(firstCategory.name);
    await expect(page).toHaveURL(firstCategory.expectedListUrl);
  });

  test('HOME_007 - Cart icon is visible and badge is hidden when cart is empty', async () => {
    expect(await homePage.header.cartButton.isVisible()).toBe(true);
    expect(await homePage.header.isCartBadgeVisible()).toBe(false);
    expect(await homePage.header.getCartCount()).toBe(0);
  });

  test('HOME_008 - Clicking the logo from a product list returns to home', async ({ page }) => {
    const firstCategory = data.expectedCategories[0];
    await homePage.clickCategoryImage(firstCategory.name);
    await expect(page).toHaveURL(firstCategory.expectedListUrl);

    await homePage.header.clickLogo();
    await expect(page).toHaveURL(data.homeUrl);
  });
});

test.describe('Home Page - Mobile', () => {
  test.use({ viewport: data.mobileViewport });

  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearCart(page);
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('HOME_006 - Hamburger drawer opens on mobile and navigates to category', async ({ page }) => {
    expect(await homePage.categoryTabs.isVisible()).toBe(false);
    expect(await homePage.header.isMenuButtonVisible()).toBe(true);

    await homePage.header.clickMenu();
    await expect
      .poll(() => homePage.categoryDrawer.isOpen(), { timeout: 5000 })
      .toBe(true);

    const links = await homePage.categoryDrawer.getCategoryLinks();
    expect(links).toHaveLength(data.expectedCategoryCount);
    expect(links.map((l) => l.name)).toEqual(data.expectedCategories.map((c) => c.name));
    expect(links.map((l) => l.label)).toEqual(data.expectedCategories.map((c) => c.title));

    const firstCategory = data.expectedCategories[0];
    await homePage.categoryDrawer.clickCategory(firstCategory.name);
    await expect(page).toHaveURL(firstCategory.expectedListUrl);
  });
});
