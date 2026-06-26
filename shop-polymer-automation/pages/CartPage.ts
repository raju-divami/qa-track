import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartItemComponent } from '../components/CartItemComponent';
import { CartSummaryComponent } from '../components/CartSummaryComponent';
import { TextElement } from '../elements';

/**
 * Shopping cart page — route: /cart
 * Component: shop-cart (Polymer shadow DOM)
 *
 * Shadow DOM structure:
 *   <shop-cart>
 *     #shadow-root
 *       <div class="main-frame">
 *         <!-- empty state -->
 *         <div class="subsection" visible$="[[!_hasItems]]">
 *           <p class="empty-cart">Your <iron-icon> is empty.</p>
 *         </div>
 *         <!-- populated state -->
 *         <div class="subsection" visible$="[[_hasItems]]">
 *           <header>
 *             <h1>Your Cart</h1>
 *             <span>(N items)</span>
 *           </header>
 *           <div class="list">
 *             <shop-cart-item …></shop-cart-item>   ← own shadow DOM
 *             …
 *           </div>
 *           <div class="checkout-box">
 *             Total: <span class="subtotal">$XX.XX</span>
 *             <shop-button><a href="/checkout">Checkout</a></shop-button>
 *           </div>
 *         </div>
 *       </div>
 *   </shop-cart>
 *
 * Usage:
 *   const cart = new CartPage(page);
 *   await cart.goto();
 */
export class CartPage extends BasePage {
  readonly cartTitle: TextElement;
  readonly itemCountLabel: TextElement;
  readonly emptyMessage: TextElement;
  readonly summary: CartSummaryComponent;

  /** Initialises cart page elements anchored to the shop-cart shadow root. */
  constructor(page: Page) {
    super(page);

    const root = this.root;
    this.cartTitle = new TextElement(page, root.locator('header h1'));
    this.itemCountLabel = new TextElement(page, root.locator('header span'));
    this.emptyMessage = new TextElement(page, root.locator('p.empty-cart'));
    this.summary = new CartSummaryComponent(page, root.locator('.checkout-box'));
  }

  private get root(): Locator {
    return this.appRoot.locator('shop-cart');
  }

  /** Navigates to the cart page and waits for the root element to be visible. */
  async goto(): Promise<void> {
    await this.page.goto('/cart');
    await this.root.waitFor({ state: 'visible' });
  }

  // ── Cart items ────────────────────────────────────────────────────────────

  private get cartItemLocators(): Locator {
    return this.root.locator('shop-cart-item');
  }

  /** Cart item at a zero-based position. */
  getCartItem(index: number): CartItemComponent {
    return new CartItemComponent(this.page, this.cartItemLocators.nth(index));
  }

  /** First cart item whose visible text contains the given product title. */
  getCartItemByTitle(title: string): CartItemComponent {
    return new CartItemComponent(
      this.page,
      this.cartItemLocators.filter({ hasText: title }).first(),
    );
  }

  /** Returns the number of items currently in the cart. */
  async getCartItemCount(): Promise<number> {
    return this.cartItemLocators.count();
  }

  // ── State helpers ─────────────────────────────────────────────────────────

  /** Returns true if the empty-cart message is visible. */
  async isEmpty(): Promise<boolean> {
    return this.emptyMessage.isVisible();
  }

  /** Returns true if the cart contains at least one item. */
  async hasItems(): Promise<boolean> {
    return !(await this.isEmpty());
  }

  /** Returns the cart total text including the currency symbol. */
  async getTotal(): Promise<string> {
    return this.summary.getTotalText();
  }

  /** Returns the cart total as a floating-point number. */
  async getTotalValue(): Promise<number> {
    return this.summary.getTotalValue();
  }

  /** Clicks the Checkout button to proceed to the checkout page. */
  async proceedToCheckout(): Promise<void> {
    await this.summary.clickCheckout();
  }

  /** Returns true if the cart page root element is visible. */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }
}
