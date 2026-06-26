import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ButtonElement, TextElement } from '../elements';

/**
 * Home page — route: / or /home
 * Component: shop-home (Polymer shadow DOM)
 *
 * Shadow DOM structure:
 *   <shop-home>
 *     #shadow-root
 *       <div class="item">                           ← one per category
 *         <a class="image-link" href="/list/:name">
 *           <shop-image …></shop-image>
 *         </a>
 *         <h2>Men's Outerwear</h2>
 *         <shop-button>
 *           <a aria-label=":title Shop Now" href="/list/:name">Shop Now</a>
 *         </shop-button>
 *       </div>
 *       …
 *   </shop-home>
 *
 * Usage:
 *   const home = new HomePage(page);
 *   await home.goto();
 */
export class HomePage extends BasePage {
  /** Creates a HomePage bound to the given Playwright page. */
  constructor(page: Page) {
    super(page);
  }

  /** Root of the home page shadow DOM. */
  private get root(): Locator {
    return this.appRoot.locator('shop-home');
  }

  /** Navigates to the home page and waits for the root element to be visible. */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.root.waitFor({ state: 'visible' });
  }

  // ── Category tiles ───────────────────────────────────────────────────────

  /** Locator for all four category tile wrappers. */
  getCategoryTiles(): Locator {
    return this.root.locator('.item');
  }

  /** Tile wrapper for a specific category name (e.g. "mens_outerwear"). */
  getCategoryTile(categoryName: string): Locator {
    return this.root.locator(`.item:has(a[href="/list/${categoryName}"])`);
  }

  /** TextElement wrapping the <h2> label inside a tile. */
  getCategoryTitle(categoryName: string): TextElement {
    return new TextElement(this.page, this.getCategoryTile(categoryName).locator('h2'));
  }

  /** "Shop Now" link button inside a tile. */
  getShopNowButton(categoryName: string): ButtonElement {
    return new ButtonElement(
      this.page,
      this.root.locator(`a[aria-label$="Shop Now"][href="/list/${categoryName}"]`),
    );
  }

  /** Click the hero image link for a category. */
  async clickCategoryImage(categoryName: string): Promise<void> {
    await this.root.locator(`a.image-link[href="/list/${categoryName}"]`).click();
  }

  /** Click the "Shop Now" button for a category. */
  async clickShopNow(categoryName: string): Promise<void> {
    await this.getShopNowButton(categoryName).click();
  }

  /** Returns the number of category tiles on the page. */
  async getCategoryCount(): Promise<number> {
    return this.getCategoryTiles().count();
  }

  /** Returns the text of every category heading on the page. */
  async getAllCategoryTitles(): Promise<string[]> {
    const titles = this.root.locator('.item h2');
    const count = await titles.count();
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await titles.nth(i).textContent();
      if (text) result.push(text.trim());
    }
    return result;
  }

  /** Returns true if the home page root element is visible. */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }
}
