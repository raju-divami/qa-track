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

  async goto(invalidPath = '/this-page-does-not-exist'): Promise<void> {
    await this.page.goto(invalidPath);
    await this.waitForVisible();
  }

  async waitForVisible(timeout = 5000): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout });
  }

  async getMessage(): Promise<string> {
    return this.warning.getMessage();
  }

  async goHome(): Promise<void> {
    await this.warning.goHome();
  }

  async isVisible(): Promise<boolean> {
    return this.warning.isVisible();
  }
}
