import { Page } from '@playwright/test';

/** localStorage key used by app-localstorage-document in shop-cart-data.js. */
const CART_KEY = 'shop-cart-data';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CartProduct {
  name: string;
  title: string;
  category: string;
  price: number;
  description: string;
  image: string;
  largeImage: string;
}

export interface CartEntry {
  item: CartProduct;
  quantity: number;
  size: string;
}

// ── Cart helpers ──────────────────────────────────────────────────────────────

/**
 * Read the current cart from localStorage.
 * Returns an empty array when the cart is absent or empty.
 */
export async function getCart(page: Page): Promise<CartEntry[]> {
  return page.evaluate((key: string) => {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as CartEntry[];
    } catch {
      return [];
    }
  }, CART_KEY);
}

/**
 * Remove the cart from localStorage entirely.
 * Use this as a beforeEach / afterEach teardown to guarantee a clean state.
 */
export async function clearCart(page: Page): Promise<void> {
  await page.evaluate((key: string) => localStorage.removeItem(key), CART_KEY);
}

/**
 * Write a cart directly into localStorage, bypassing the UI.
 * Useful for setting up a pre-populated cart state before a test.
 */
export async function setCart(page: Page, entries: CartEntry[]): Promise<void> {
  await page.evaluate(
    ({ key, data }: { key: string; data: CartEntry[] }) =>
      localStorage.setItem(key, JSON.stringify(data)),
    { key: CART_KEY, data: entries },
  );
}

/** Total number of items across all cart entries (sum of quantities). */
export async function getCartItemCount(page: Page): Promise<number> {
  const cart = await getCart(page);
  return cart.reduce((sum, e) => sum + e.quantity, 0);
}

/** Monetary total of the cart (sum of price × quantity). */
export async function getCartTotal(page: Page): Promise<number> {
  const cart = await getCart(page);
  return cart.reduce((sum, e) => sum + e.item.price * e.quantity, 0);
}

/** True when localStorage contains no cart data or an empty array. */
export async function isCartEmpty(page: Page): Promise<boolean> {
  const cart = await getCart(page);
  return cart.length === 0;
}

// ── General localStorage helpers ──────────────────────────────────────────────

/** Read any localStorage entry and JSON-parse it. Returns null if absent. */
export async function getLocalStorageItem<T>(
  page: Page,
  key: string,
): Promise<T | null> {
  return page.evaluate((k: string) => {
    const raw = localStorage.getItem(k);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }, key);
}

/** Write any value to localStorage as a JSON string. */
export async function setLocalStorageItem(
  page: Page,
  key: string,
  value: unknown,
): Promise<void> {
  await page.evaluate(
    ({ k, v }: { k: string; v: string }) => localStorage.setItem(k, v),
    { k: key, v: JSON.stringify(value) },
  );
}

/** Remove a single localStorage entry. */
export async function removeLocalStorageItem(
  page: Page,
  key: string,
): Promise<void> {
  await page.evaluate((k: string) => localStorage.removeItem(k), key);
}

/** Wipe every localStorage entry for the current origin. */
export async function clearAllLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear());
}
