import { Locator, Page } from '@playwright/test';
import { ButtonElement, TextElement } from '../elements';

/**
 * The 404 warning page component (shop-404-warning).
 *
 * DOM (Polymer shadow DOM):
 *   <shop-404-warning>
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
 *   new NotFoundComponent(page, page.locator('shop-404-warning'))
 */
export class NotFoundComponent {
  readonly message: TextElement;
  readonly goHomeButton: ButtonElement;

  constructor(
    private readonly page: Page,
    private readonly root: Locator,
  ) {
    this.message = new TextElement(page, root.locator('h1'));
    this.goHomeButton = new ButtonElement(page, root.locator('a[href="/"]'));
  }

  async getMessage(): Promise<string> {
    return this.message.getText();
  }

  async goHome(): Promise<void> {
    await this.goHomeButton.click();
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  async waitForVisible(timeout = 5000): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout });
  }

  locator(): Locator {
    return this.root;
  }
}
