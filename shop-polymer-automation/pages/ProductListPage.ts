import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ProductCardComponent } from '../components/ProductCardComponent';
import { NetworkWarningComponent } from '../components/NetworkWarningComponent';
import { TextElement } from '../elements';

/**
 * Product list page — route: /list/:category
 * Component: shop-list (Polymer shadow DOM)
 *
 * Shadow DOM structure:
 *   <shop-list>
 *     #shadow-root
 *       <shop-image class="hero-image" …></shop-image>
 *       <header>
 *         <h1>Men's T-Shirts</h1>
 *         <span>40 items</span>
 *       </header>
 *       <ul class="grid">
 *         <li>
 *           <a href="/detail/:category/:item">
 *             <shop-list-item …></shop-list-item>   ← own shadow DOM
 *           </a>
 *         </li>
 *         …
 *       </ul>
 *       <shop-network-warning …></shop-network-warning>
 *   </shop-list>
 *
 * Usage:
 *   const listPage = new ProductListPage(page);
 *   await listPage.goto('mens_tshirts');
 */
export class ProductListPage extends BasePage {
  readonly categoryTitle: TextElement;
  readonly itemCountLabel: TextElement;
  readonly networkWarning: NetworkWarningComponent;

  /** Initialises page elements for the product list at the given Playwright page. */
  constructor(page: Page) {
    super(page);

    const root = this.root;
    this.categoryTitle = new TextElement(page, root.locator('header h1'));
    this.itemCountLabel = new TextElement(page, root.locator('header span'));
    this.networkWarning = new NetworkWarningComponent(page, root.locator('shop-network-warning'));
  }

  private get root(): Locator {
    return this.appRoot.locator('shop-list');
  }

  /** Navigates to the product list for the given category and waits for the root element. */
  async goto(categoryName: string): Promise<void> {
    await this.page.goto(`/list/${categoryName}`);
    await this.root.waitFor({ state: 'visible' });
  }

  // ── Product grid ─────────────────────────────────────────────────────────

  private get gridItems(): Locator {
    return this.root.locator('.grid li');
  }

  /** All product cards on the page. */
  getAllProductCards(): ProductCardComponent[] {
    // Returns a lazily-evaluated accessor; actual card count is resolved on use
    return new Proxy([] as ProductCardComponent[], {
      get: (_target, prop) => {
        if (prop === 'length') return this.getProductCardCount();
        return undefined;
      },
    });
  }

  /** A single product card by zero-based index. */
  getProductCard(index: number): ProductCardComponent {
    return new ProductCardComponent(this.page, this.gridItems.nth(index));
  }

  /** First product card whose title contains the given text. */
  getProductCardByTitle(titleText: string): ProductCardComponent {
    return new ProductCardComponent(
      this.page,
      this.gridItems.filter({ hasText: titleText }).first(),
    );
  }

  /** Returns the total number of product cards in the grid. */
  async getProductCardCount(): Promise<number> {
    return this.gridItems.count();
  }

  /** Returns the category heading text. */
  async getCategoryTitle(): Promise<string> {
    return this.categoryTitle.getText();
  }

  /** Returns the item count label text (e.g. "40 items"). */
  async getItemCountText(): Promise<string> {
    return this.itemCountLabel.getText();
  }

  /** Returns true if the network warning banner is visible. */
  async isNetworkWarningVisible(): Promise<boolean> {
    return this.networkWarning.isVisible();
  }

  /** Returns true if the product list root element is visible. */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }
}
