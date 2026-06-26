import { Locator, Page } from '@playwright/test';
import { ButtonElement, TextElement } from '../elements';

/**
 * The success or error status header shown after order submission.
 * Both share the same <header state="..."> structure.
 *
 * DOM (inside shop-checkout's shadow root):
 *
 *   Success:
 *     <header state="success">
 *       <h1>Thank you</h1>
 *       <p>Your order has been received.</p>
 *       <shop-button><a href="/">Finish</a></shop-button>
 *     </header>
 *
 *   Error:
 *     <header state="error">
 *       <h1>We couldn't process your order</h1>
 *       <p id="errorMessage">Transaction failed.</p>
 *       <shop-button><a href="/checkout">Try again</a></shop-button>
 *     </header>
 *
 * Usage:
 *   new CheckoutStatusComponent(page, page.locator('header[state="success"]'))
 *   new CheckoutStatusComponent(page, page.locator('header[state="error"]'))
 */
export class CheckoutStatusComponent {
  readonly heading: TextElement;
  readonly message: TextElement;
  readonly actionButton: ButtonElement;

  /** Initializes heading, message, and action button elements from the given root locator. */
  constructor(
    private readonly page: Page,
    private readonly root: Locator,
  ) {
    this.heading = new TextElement(page, root.locator('h1'));
    this.message = new TextElement(page, root.locator('p'));
    this.actionButton = new ButtonElement(page, root.locator('shop-button a'));
  }

  /** Returns the status heading text (e.g. "Thank you"). */
  async getHeading(): Promise<string> {
    return this.heading.getText();
  }

  /** Returns the status message text (e.g. "Your order has been received."). */
  async getMessage(): Promise<string> {
    return this.message.getText();
  }

  /** Clicks the primary action button (Finish or Try again). */
  async clickAction(): Promise<void> {
    await this.actionButton.click();
  }

  /** Returns the value of the `state` attribute on the header element. */
  async getState(): Promise<string | null> {
    return this.root.getAttribute('state');
  }

  /** Returns whether the status state is "success". */
  async isSuccess(): Promise<boolean> {
    return (await this.getState()) === 'success';
  }

  /** Returns whether the status state is "error". */
  async isError(): Promise<boolean> {
    return (await this.getState()) === 'error';
  }

  /** Returns whether the status header is visible on the page. */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  /** Returns the root locator for this component. */
  locator(): Locator {
    return this.root;
  }
}
