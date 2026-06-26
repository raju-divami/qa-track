/**
 * Typed URL builders for every route in the Shop Polymer application.
 * Use these instead of raw strings so route changes are caught at compile time.
 *
 * All paths are relative — combine with env.baseUrl or pass directly to
 * page.goto() (Playwright uses baseURL from config automatically).
 *
 * Usage:
 *   await page.goto(routes.list('mens_tshirts'));
 *   await page.goto(routes.detail('mens_tshirts', 'classic-polo'));
 */

export type CategoryName =
  | 'mens_outerwear'
  | 'ladies_outerwear'
  | 'mens_tshirts'
  | 'ladies_tshirts';

export const routes = {
  home: (): string => '/',
  list: (category: CategoryName | string): string => `/list/${category}`,
  detail: (category: CategoryName | string, item: string): string =>
    `/detail/${category}/${item}`,
  cart: (): string => '/cart',
  checkout: (): string => '/checkout',
  checkoutSuccess: (): string => '/checkout/success',
  checkoutError: (): string => '/checkout/error',
} as const;

/** All four category identifiers used by the application. */
export const categories = {
  mensOuterwear: 'mens_outerwear' as CategoryName,
  ladiesOuterwear: 'ladies_outerwear' as CategoryName,
  mensTshirts: 'mens_tshirts' as CategoryName,
  ladiesTshirts: 'ladies_tshirts' as CategoryName,
} as const;

/** Human-readable title for each category name. */
export const categoryTitles: Record<CategoryName, string> = {
  mens_outerwear: "Men's Outerwear",
  ladies_outerwear: 'Ladies Outerwear',
  mens_tshirts: "Men's T-Shirts",
  ladies_tshirts: "Ladies T-Shirts",
};
