import { Locator, Page } from '@playwright/test';
import { TextElement } from '../elements';

/**
 * A single product card on the category list page.
 *
 * DOM (shop-list-item uses Polymer shadow DOM; chained locators pierce it):
 *   <li>
 *     <a href="/detail/mens_tshirts/mens-classic-polo">
 *       <shop-list-item>
 *         #shadow-root
 *           <shop-image src="..."></shop-image>
 *           <div class="title">Men's Classic Polo</div>
 *           <span class="price">$24.99</span>
 *       </shop-list-item>
 *     </a>
 *   </li>
 *
 * Usage:
 *   // Get a specific card by position:
 *   new ProductCardComponent(page, page.locator('.grid li').nth(0))
 *
 *   // Get a card by title text:
 *   new ProductCardComponent(page, page.locator('.grid li').filter({ hasText: 'Classic Polo' }))
 */
export class ProductCardComponent {
  readonly title: TextElement;
  readonly price: TextElement;

  /** Initializes the card's title and price elements from the given root locator. */
  constructor(
    private readonly page: Page,
    private readonly root: Locator,
  ) {
    // shop-list-item shadow DOM is pierced automatically by chained locators
    const item = root.locator('shop-list-item');
    this.title = new TextElement(page, item.locator('.title'));
    this.price = new TextElement(page, item.locator('.price'));
  }

  private get link(): Locator {
    return this.root.locator('a');
  }

  /** Clicks the product card link to navigate to the product detail page. */
  async click(): Promise<void> {
    await this.link.click();
  }

  /** Returns the product title text. */
  async getTitle(): Promise<string> {
    return this.title.getText();
  }

  /** Returns the formatted price string (e.g. "$24.99"). */
  async getPrice(): Promise<string> {
    return this.price.getText();
  }

  /** Returns the price as a parsed float with the dollar sign stripped. */
  async getPriceValue(): Promise<number> {
    const raw = await this.getPrice();
    return parseFloat(raw.replace('$', ''));
  }

  /** Returns the `href` attribute of the card's anchor element. */
  async getHref(): Promise<string | null> {
    return this.link.getAttribute('href');
  }

  /** Returns whether the card is visible on the page. */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  /** Returns the root locator for this component. */
  locator(): Locator {
    return this.root;
  }
}
