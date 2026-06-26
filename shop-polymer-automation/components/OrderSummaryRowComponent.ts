import { Locator, Page } from '@playwright/test';
import { TextElement } from '../elements';

/**
 * A single product row in the Order Summary section of the checkout page.
 *
 * DOM (inside shop-checkout's shadow root):
 *   <div class="row order-summary-row">
 *     <div class="flex">Men's Classic Polo</div>
 *     <div>$49.98</div>
 *   </div>
 *
 * Total row uses the same structure with class "total-row":
 *   <div class="row total-row">
 *     <div class="flex">Total</div>
 *     <div>$49.98</div>
 *   </div>
 *
 * Usage:
 *   // All item rows:
 *   const rows = page.locator('.order-summary-row');
 *   new OrderSummaryRowComponent(page, rows.nth(0))
 *
 *   // The grand total row:
 *   new OrderSummaryRowComponent(page, page.locator('.total-row'))
 */
export class OrderSummaryRowComponent {
  readonly label: TextElement;
  readonly amount: TextElement;

  /** Initializes the label and amount elements from the given root locator. */
  constructor(
    private readonly page: Page,
    private readonly root: Locator,
  ) {
    this.label = new TextElement(page, root.locator('.flex'));
    // The price is the second direct <div> child (no class)
    this.amount = new TextElement(page, root.locator('div:not(.flex)').last());
  }

  /** Returns the row label text (e.g. "Men's Classic Polo" or "Total"). */
  async getLabel(): Promise<string> {
    return this.label.getText();
  }

  /** Returns the formatted amount string (e.g. "$49.98"). */
  async getAmount(): Promise<string> {
    return this.amount.getText();
  }

  /** Returns the amount as a parsed float with the dollar sign stripped. */
  async getAmountValue(): Promise<number> {
    const raw = await this.getAmount();
    return parseFloat(raw.replace('$', ''));
  }

  /** Returns whether this summary row is visible on the page. */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  /** Returns the root locator for this component. */
  locator(): Locator {
    return this.root;
  }
}
