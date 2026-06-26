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

  constructor(
    private readonly page: Page,
    private readonly root: Locator,
  ) {
    this.quantity = new SelectElement(page, root.locator('.quantity shop-select'));
    this.price = new TextElement(page, root.locator('.price'));
    this.deleteButton = new ButtonElement(page, root.locator('paper-icon-button.delete-button'));
  }

  async getName(): Promise<string> {
    return (await this.root.locator('.name a').textContent())?.trim() ?? '';
  }

  async getSize(): Promise<string> {
    return (await this.root.locator('.size span').textContent())?.trim() ?? '';
  }

  async getPrice(): Promise<string> {
    return this.price.getText();
  }

  async getPriceValue(): Promise<number> {
    const raw = await this.getPrice();
    return parseFloat(raw.replace('$', ''));
  }

  async getQuantity(): Promise<string> {
    return this.quantity.getValue();
  }

  async setQuantity(value: string): Promise<void> {
    await this.quantity.selectByValue(value);
  }

  async remove(): Promise<void> {
    await this.deleteButton.click();
  }

  async clickProductLink(): Promise<void> {
    await this.root.locator('.name a').click();
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  locator(): Locator {
    return this.root;
  }
}
