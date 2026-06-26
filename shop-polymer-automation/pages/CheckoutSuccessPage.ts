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

  /** Initialises the success status component anchored to the shop-checkout shadow root. */
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

  /** Waits until the success header is visible within the given timeout. */
  async waitForVisible(timeout = 10_000): Promise<void> {
    await this.status.locator().waitFor({ state: 'visible', timeout });
  }

  /** Returns the success page heading text. */
  async getHeading(): Promise<string> {
    return this.status.getHeading();
  }

  /** Returns the success confirmation message text. */
  async getMessage(): Promise<string> {
    return this.status.getMessage();
  }

  /** Clicks the Finish button to return to the home page. */
  async clickFinish(): Promise<void> {
    await this.status.clickAction();
  }

  /** Returns true if the success header is visible. */
  async isVisible(): Promise<boolean> {
    return this.status.isVisible();
  }
}
