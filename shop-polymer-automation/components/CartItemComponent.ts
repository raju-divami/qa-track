import { Locator, Page } from '@playwright/test';
import { ButtonElement, SelectElement, TextElement } from '../elements';

/**
 * A single line item inside the shopping cart page.
 *
 * DOM (shop-cart-item uses Polymer shadow DOM):
 *   <shop-cart-item>
 *     #shadow-root
 *       <a href="/detail/..."><shop-image ...></shop-image></a>
 *       <div class="flex">
 *         <div class="name">
 *           <a href="/detail/...">Product Title</a>
 *         </div>
 *         <div class="detail">
 *           <div class="quantity">
 *             <shop-select>
 *               <label prefix>Qty:</label>
 *               <select id="quantitySelect" aria-label="Change quantity">...</select>
 *             </shop-select>
 *           </div>
 *           <div class="size">Size: <span>M</span></div>
 *           <div class="price">$24.99</div>
 *           <paper-icon-button class="delete-button" aria-label="Delete item ...">
 *         </div>
 *       </div>
 *   </shop-cart-item>
 *
 * Usage:
 *   new CartItemComponent(page, page.locator('shop-cart-item').nth(0))
 *   new CartItemComponent(page, page.locator('shop-cart-item').filter({ hasText: 'Classic Polo' }))
 */
export class CartItemComponent {
  readonly quantity: SelectElement;
  readonly price: TextElement;
  readonly deleteButton: ButtonElement;

  /** Initializes the item's interactive elements from the given root locator. */
  constructor(
    private readonly page: Page,
    private readonly root: Locator,
  ) {
    this.quantity = new SelectElement(page, root.locator('.quantity shop-select'));
    this.price = new TextElement(page, root.locator('.price'));
    this.deleteButton = new ButtonElement(page, root.locator('paper-icon-button.delete-button'));
  }

  /** Returns the product name text for this cart item. */
  async getName(): Promise<string> {
    return (await this.root.locator('.name a').textContent())?.trim() ?? '';
  }

  /** Returns the selected size label for this cart item. */
  async getSize(): Promise<string> {
    return (await this.root.locator('.size span').textContent())?.trim() ?? '';
  }

  /** Returns the formatted line-item price string (e.g. "$24.99"). */
  async getPrice(): Promise<string> {
    return this.price.getText();
  }

  /** Returns the line-item price as a parsed float with the dollar sign stripped. */
  async getPriceValue(): Promise<number> {
    const raw = await this.getPrice();
    return parseFloat(raw.replace('$', ''));
  }

  /** Returns the currently selected quantity value for this cart item. */
  async getQuantity(): Promise<string> {
    return this.quantity.getValue();
  }

  /** Changes the quantity select to the given value. */
  async setQuantity(value: string): Promise<void> {
    await this.quantity.selectByValue(value);
  }

  /** Clicks the delete button to remove this item from the cart. */
  async remove(): Promise<void> {
    await this.deleteButton.click();
  }

  /** Clicks the product name link to navigate to the product detail page. */
  async clickProductLink(): Promise<void> {
    await this.root.locator('.name a').click();
  }

  /** Returns whether this cart item is visible on the page. */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  /** Returns the root locator for this component. */
  locator(): Locator {
    return this.root;
  }
}
