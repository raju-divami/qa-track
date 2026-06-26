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

  async click(): Promise<void> {
    await this.link.click();
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }

  async getPrice(): Promise<string> {
    return this.price.getText();
  }

  async getPriceValue(): Promise<number> {
    const raw = await this.getPrice();
    return parseFloat(raw.replace('$', ''));
  }

  async getHref(): Promise<string | null> {
    return this.link.getAttribute('href');
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  locator(): Locator {
    return this.root;
  }
}
