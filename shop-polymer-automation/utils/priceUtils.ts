/**
 * Utilities for parsing, formatting, and comparing price strings used
 * throughout the Shop Polymer UI (format: "$XX.XX").
 */

/**
 * Parse a price string like "$24.99" or "24.99" into a float.
 * Returns NaN if the string cannot be parsed.
 */
export function parsePrice(text: string): number {
  const cleaned = text.replace(/[^0-9.]/g, '').trim();
  return cleaned ? parseFloat(cleaned) : NaN;
}

/**
 * Format a numeric amount as a "$XX.XX" price string.
 * Matches the _formatPrice() function used in the app.
 */
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Return true when two price strings represent the same monetary value,
 * allowing for minor floating-point drift up to `tolerance` cents.
 *
 * arePricesEqual('$24.99', '$24.99')       // true
 * arePricesEqual('$24.99', '$25.00')       // false
 * arePricesEqual('$24.999', '$25.00', 0.1) // true
 */
export function arePricesEqual(
  a: string,
  b: string,
  toleranceCents = 0.001,
): boolean {
  return Math.abs(parsePrice(a) - parsePrice(b)) <= toleranceCents;
}

/**
 * Calculate the expected line-item total for a cart entry.
 * Mirrors the _computeTotal() logic in shop-cart-data.js.
 */
export function lineTotal(unitPrice: number, quantity: number): number {
  return unitPrice * quantity;
}

/**
 * Calculate the expected cart grand total from an array of entries.
 * Mirrors the _computeTotal() logic in shop-cart-data.js.
 */
export function cartTotal(
  entries: Array<{ price: number; quantity: number }>,
): number {
  return entries.reduce((sum, e) => sum + e.price * e.quantity, 0);
}

/**
 * Round to 2 decimal places to avoid floating-point comparison issues.
 * Use when comparing computed totals against UI-displayed values.
 */
export function roundPrice(amount: number): number {
  return Math.round(amount * 100) / 100;
}
