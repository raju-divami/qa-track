import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CheckoutStatusComponent } from '../components/CheckoutStatusComponent';

/**
 * Order error page — route: /checkout/error
 * Rendered as <header state="error"> inside shop-checkout's shadow DOM.
 *
 * DOM (inside shop-checkout shadow root):
 *   <header state="error">
 *     <h1>We couldn't process your order</h1>
 *     <p id="errorMessage">Transaction failed.</p>
 *     <shop-button responsive>
 *       <a href="/checkout">Try again</a>
 *     </shop-button>
 *   </header>
 *
 * Usage:
 *   const errorPage = new CheckoutErrorPage(page);
 *   await errorPage.waitForVisible();
 *   await errorPage.clickTryAgain();
 */
export class CheckoutErrorPage extends BasePage {
  readonly status: CheckoutStatusComponent;

  /** Initialises the error status component anchored to the shop-checkout shadow root. */
  constructor(page: Page) {
    super(page);

    this.status = new CheckoutStatusComponent(
      page,
      this.root.locator('header[state="error"]'),
    );
  }

  private get root(): Locator {
    return this.appRoot.locator('shop-checkout');
  }

  /** Not a direct URL; reached after a failed order submission. */
  async goto(): Promise<void> {
    await this.page.goto('/checkout/error');
    await this.waitForVisible();
  }

  /** Waits until the error header is visible within the given timeout. */
  async waitForVisible(timeout = 10_000): Promise<void> {
    await this.status.locator().waitFor({ state: 'visible', timeout });
  }

  /** Returns the error page heading text. */
  async getHeading(): Promise<string> {
    return this.status.getHeading();
  }

  /** Returns the error message text. */
  async getErrorMessage(): Promise<string> {
    return this.status.getMessage();
  }

  /** Clicks the Try Again button to return to the checkout form. */
  async clickTryAgain(): Promise<void> {
    await this.status.clickAction();
  }

  /** Returns true if the error header is visible. */
  async isVisible(): Promise<boolean> {
    return this.status.isVisible();
  }
}
