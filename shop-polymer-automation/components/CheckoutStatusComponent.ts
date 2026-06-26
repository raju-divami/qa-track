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

  constructor(
    private readonly page: Page,
    private readonly root: Locator,
  ) {
    this.heading = new TextElement(page, root.locator('h1'));
    this.message = new TextElement(page, root.locator('p'));
    this.actionButton = new ButtonElement(page, root.locator('shop-button a'));
  }

  async getHeading(): Promise<string> {
    return this.heading.getText();
  }

  async getMessage(): Promise<string> {
    return this.message.getText();
  }

  async clickAction(): Promise<void> {
    await this.actionButton.click();
  }

  async getState(): Promise<string | null> {
    return this.root.getAttribute('state');
  }

  async isSuccess(): Promise<boolean> {
    return (await this.getState()) === 'success';
  }

  async isError(): Promise<boolean> {
    return (await this.getState()) === 'error';
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  locator(): Locator {
    return this.root;
  }
}
