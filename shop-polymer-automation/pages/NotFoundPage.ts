import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { NotFoundComponent } from '../components/NotFoundComponent';

/**
 * 404 page — rendered when the router falls through to fallback-selection="404"
 * Component: shop-404-warning (Polymer shadow DOM)
 *
 * DOM (inside shop-app iron-pages, pierced via shop-app shadow):
 *   <shop-404-warning name="404">
 *     #shadow-root
 *       <div>
 *         <iron-icon icon="error"></iron-icon>
 *         <h1>Sorry, we couldn't find that page</h1>
 *       </div>
 *       <shop-button>
 *         <a href="/">Go to the home page</a>
 *       </shop-button>
 *   </shop-404-warning>
 *
 * Usage:
 *   const notFound = new NotFoundPage(page);
 *   await notFound.goto('/nonexistent');
 */
export class NotFoundPage extends BasePage {
  readonly warning: NotFoundComponent;

  /** Initialises the 404 warning component anchored to the shop-404-warning element. */
  constructor(page: Page) {
    super(page);

    this.warning = new NotFoundComponent(
      page,
      this.root,
    );
  }

  private get root(): Locator {
    return this.appRoot.locator('shop-404-warning');
  }

  /** Navigates to an invalid path that triggers the 404 page and waits for it to appear. */
  async goto(invalidPath = '/this-page-does-not-exist'): Promise<void> {
    await this.page.goto(invalidPath);
    await this.waitForVisible();
  }

  /** Waits until the 404 warning element is visible within the given timeout. */
  async waitForVisible(timeout = 5000): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout });
  }

  /** Returns the 404 message text. */
  async getMessage(): Promise<string> {
    return this.warning.getMessage();
  }

  /** Clicks the link to navigate back to the home page. */
  async goHome(): Promise<void> {
    await this.warning.goHome();
  }

  /** Returns true if the 404 warning element is visible. */
  async isVisible(): Promise<boolean> {
    return this.warning.isVisible();
  }
}
