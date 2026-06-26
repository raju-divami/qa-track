import { Locator, Page } from '@playwright/test';
import { ButtonElement, TextElement } from '../elements';

/**
 * The cart total and checkout CTA box at the bottom of the cart page.
 *
 * DOM (light DOM inside shop-cart's shadow root):
 *   <div class="checkout-box">
 *     Total: <span class="subtotal">$64.98</span>
 *     <shop-button responsive>
 *       <a href="/checkout">Checkout</a>
 *     </shop-button>
 *   </div>
 *
 * Usage:
 *   new CartSummaryComponent(page, page.locator('shop-cart .checkout-box'))
 */
export class CartSummaryComponent {
  readonly total: TextElement;
  readonly checkoutButton: ButtonElement;

  constructor(
    private readonly page: Page,
    private readonly root: Locator,
  ) {
    this.total = new TextElement(page, root.locator('.subtotal'));
    this.checkoutButton = new ButtonElement(page, root.locator('a[href="/checkout"]'));
  }

  async getTotalText(): Promise<string> {
    return this.total.getText();
  }

  async getTotalValue(): Promise<number> {
    const raw = await this.getTotalText();
    return parseFloat(raw.replace('$', ''));
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  locator(): Locator {
    return this.root;
  }
}
