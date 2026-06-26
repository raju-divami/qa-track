import { Locator, Page } from '@playwright/test';
import { ButtonElement, TextElement } from '../elements';

/**
 * The "Added to cart" slide-in notification modal (shop-cart-modal).
 * Appears after clicking "Add to Cart" on the product detail page.
 *
 * DOM (shop-cart-modal uses Polymer shadow DOM with IronOverlayBehavior):
 *   <shop-cart-modal role="dialog">
 *     #shadow-root
 *       <div class="label">Added to cart</div>
 *       <shop-button>
 *         <a href="/cart" id="viewCartAnchor">View Cart</a>
 *       </shop-button>
 *       <shop-button>
 *         <a href="/checkout">Checkout</a>
 *       </shop-button>
 *       <paper-icon-button id="closeBtn" aria-label="Close dialog">
 *   </shop-cart-modal>
 *
 * Usage:
 *   new CartModalComponent(page, page.locator('shop-cart-modal'))
 */
export class CartModalComponent {
  readonly label: TextElement;
  readonly viewCartButton: ButtonElement;
  readonly checkoutButton: ButtonElement;
  readonly closeButton: ButtonElement;

  constructor(
    private readonly page: Page,
    private readonly root: Locator,
  ) {
    this.label = new TextElement(page, root.locator('.label'));
    this.viewCartButton = new ButtonElement(page, root.locator('a[href="/cart"]'));
    this.checkoutButton = new ButtonElement(page, root.locator('a[href="/checkout"]'));
    this.closeButton = new ButtonElement(page, root.locator('paper-icon-button#closeBtn'));
  }

  async isOpen(): Promise<boolean> {
    const cls = await this.root.getAttribute('class');
    return cls?.includes('opened') ?? false;
  }

  async getLabelText(): Promise<string> {
    return this.label.getText();
  }

  async goToCart(): Promise<void> {
    await this.viewCartButton.click();
  }

  async goToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }

  async waitForOpen(timeout = 5000): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout });
    await this.page.waitForFunction(
      (el) => (el as Element).classList.contains('opened'),
      await this.root.elementHandle(),
      { timeout },
    );
  }

  async waitForClosed(timeout = 3000): Promise<void> {
    await this.page.waitForFunction(
      (el) => !(el as Element).classList.contains('opened'),
      await this.root.elementHandle(),
      { timeout },
    );
  }

  locator(): Locator {
    return this.root;
  }
}
