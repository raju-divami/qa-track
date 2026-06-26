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

  constructor(
    private readonly page: Page,
    private readonly root: Locator,
  ) {
    this.label = new TextElement(page, root.locator('.flex'));
    // The price is the second direct <div> child (no class)
    this.amount = new TextElement(page, root.locator('div:not(.flex)').last());
  }

  async getLabel(): Promise<string> {
    return this.label.getText();
  }

  async getAmount(): Promise<string> {
    return this.amount.getText();
  }

  async getAmountValue(): Promise<number> {
    const raw = await this.getAmount();
    return parseFloat(raw.replace('$', ''));
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  locator(): Locator {
    return this.root;
  }
}
