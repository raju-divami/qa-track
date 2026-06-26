import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CheckoutStatusComponent } from '../components/CheckoutStatusComponent';

/**
 * Order success page — route: /checkout/success
 * Rendered as <header state="success"> inside shop-checkout's shadow DOM.
 *
 * DOM (inside shop-checkout shadow root):
 *   <header state="success">
 *     <h1>Thank you</h1>
 *     <p>Your order has been received.</p>
 *     <shop-button responsive>
 *       <a href="/">Finish</a>
 *     </shop-button>
 *   </header>
 *
 * Usage:
 *   const successPage = new CheckoutSuccessPage(page);
 *   await successPage.waitForVisible();
 */
export class CheckoutSuccessPage extends BasePage {
  readonly status: CheckoutStatusComponent;

  constructor(page: Page) {
    super(page);

    this.status = new CheckoutStatusComponent(
      page,
      this.root.locator('header[state="success"]'),
    );
  }

  private get root(): Locator {
    return this.appRoot.locator('shop-checkout');
  }

  /** Not a direct URL; reached after a successful order submission. */
  async goto(): Promise<void> {
    await this.page.goto('/checkout/success');
    await this.waitForVisible();
  }

  async waitForVisible(timeout = 10_000): Promise<void> {
    await this.status.locator().waitFor({ state: 'visible', timeout });
  }

  async getHeading(): Promise<string> {
    return this.status.getHeading();
  }

  async getMessage(): Promise<string> {
    return this.status.getMessage();
  }

  async clickFinish(): Promise<void> {
    await this.status.clickAction();
  }

  async isVisible(): Promise<boolean> {
    return this.status.isVisible();
  }
}
