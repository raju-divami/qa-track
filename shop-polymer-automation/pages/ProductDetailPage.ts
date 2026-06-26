import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { NetworkWarningComponent } from '../components/NetworkWarningComponent';
import { ButtonElement, SelectElement, TextElement, RichTextElement } from '../elements';

/**
 * Product detail page — route: /detail/:category/:item
 * Component: shop-detail (Polymer shadow DOM)
 *
 * Shadow DOM structure:
 *   <shop-detail>
 *     #shadow-root
 *       <div id="content">
 *         <shop-image alt="…" src="…"></shop-image>
 *         <div class="detail">
 *           <h1>Product Title</h1>
 *           <div class="price">$24.99</div>
 *           <div class="pickers">
 *             <shop-select>                             ← size picker
 *               <label id="sizeLabel" prefix>Size</label>
 *               <select id="sizeSelect">…</select>
 *             </shop-select>
 *             <shop-select>                             ← quantity picker
 *               <label id="quantityLabel" prefix>Quantity</label>
 *               <select id="quantitySelect">…</select>
 *             </shop-select>
 *           </div>
 *           <div class="description">
 *             <h2>Description</h2>
 *             <p id="desc"></p>
 *           </div>
 *           <shop-button responsive>
 *             <button aria-label="Add this item to cart">Add to Cart</button>
 *           </shop-button>
 *         </div>
 *       </div>
 *       <shop-network-warning …></shop-network-warning>
 *   </shop-detail>
 *
 * Usage:
 *   const detail = new ProductDetailPage(page);
 *   await detail.goto('mens_tshirts', 'mens-classic-polo');
 */
export class ProductDetailPage extends BasePage {
  readonly title: TextElement;
  readonly price: TextElement;
  readonly sizeSelect: SelectElement;
  readonly quantitySelect: SelectElement;
  readonly addToCartButton: ButtonElement;
  readonly description: RichTextElement;
  readonly networkWarning: NetworkWarningComponent;

  constructor(page: Page) {
    super(page);

    const root = this.root;

    this.title = new TextElement(page, root.locator('h1'));
    this.price = new TextElement(page, root.locator('.price'));
    this.sizeSelect = new SelectElement(
      page,
      root.locator('shop-select').filter({ has: root.locator('#sizeSelect') }),
    );
    this.quantitySelect = new SelectElement(
      page,
      root.locator('shop-select').filter({ has: root.locator('#quantitySelect') }),
    );
    this.addToCartButton = new ButtonElement(
      page,
      root.locator('button[aria-label="Add this item to cart"]'),
    );
    this.description = new RichTextElement(page, root.locator('p#desc'));
    this.networkWarning = new NetworkWarningComponent(page, root.locator('shop-network-warning'));
  }

  private get root(): Locator {
    return this.appRoot.locator('shop-detail');
  }

  async goto(category: string, item: string): Promise<void> {
    await this.page.goto(`/detail/${category}/${item}`);
    await this.root.waitFor({ state: 'visible' });
  }

  // ── Product info ──────────────────────────────────────────────────────────

  async getTitle(): Promise<string> {
    return this.title.getText();
  }

  async getPrice(): Promise<string> {
    return this.price.getText();
  }

  async getPriceValue(): Promise<number> {
    return parseFloat((await this.getPrice()).replace('$', ''));
  }

  async getDescription(): Promise<string> {
    return this.description.getText();
  }

  // ── Interactions ──────────────────────────────────────────────────────────

  async selectSize(size: string): Promise<void> {
    await this.sizeSelect.selectByValue(size);
  }

  async selectQuantity(qty: string): Promise<void> {
    await this.quantitySelect.selectByValue(qty);
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    await this.cartModal.waitForOpen();
  }

  async getSelectedSize(): Promise<string> {
    return this.sizeSelect.getValue();
  }

  async getSelectedQuantity(): Promise<string> {
    return this.quantitySelect.getValue();
  }

  async isNetworkWarningVisible(): Promise<boolean> {
    return this.networkWarning.isVisible();
  }

  async isContentVisible(): Promise<boolean> {
    return this.root.locator('#content').isVisible();
  }
}
