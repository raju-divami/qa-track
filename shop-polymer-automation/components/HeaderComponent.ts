import { Locator, Page } from '@playwright/test';
import { ButtonElement, TextElement } from '../elements';

/**
 * The global app header rendered by shop-app.js.
 *
 * DOM (light-DOM children of <app-header>):
 *   <app-header id="header" role="navigation">
 *     <app-toolbar>
 *       <div class="left-bar-item">
 *         <paper-icon-button class="menu-btn" aria-label="Categories">
 *         <a class="back-btn" href="/list/...">
 *           <paper-icon-button icon="arrow-back" aria-label="Go back">
 *         </a>
 *       </div>
 *       <div class="logo">
 *         <a href="/" aria-label="SHOP Home">SHOP</a>
 *       </div>
 *       <div class="cart-btn-container">
 *         <a href="/cart">
 *           <paper-icon-button aria-label="Shopping cart: N items">
 *         </a>
 *         <div class="cart-badge">N</div>
 *       </div>
 *     </app-toolbar>
 *   </app-header>
 *
 * Usage:
 *   new HeaderComponent(page, page.locator('app-header#header'))
 */
export class HeaderComponent {
  readonly logoLink: ButtonElement;
  readonly menuButton: ButtonElement;
  readonly backButton: ButtonElement;
  readonly cartButton: ButtonElement;
  readonly cartBadge: TextElement;

  constructor(
    private readonly page: Page,
    private readonly root: Locator,
  ) {
    this.logoLink = new ButtonElement(page, root.locator('a[aria-label="SHOP Home"]'));
    this.menuButton = new ButtonElement(page, root.locator('paper-icon-button.menu-btn'));
    this.backButton = new ButtonElement(page, root.locator('a.back-btn'));
    this.cartButton = new ButtonElement(page, root.locator('a[href="/cart"]').first());
    this.cartBadge = new TextElement(page, root.locator('.cart-badge'));
  }

  async clickLogo(): Promise<void> {
    await this.logoLink.click();
  }

  async clickCart(): Promise<void> {
    await this.cartButton.click();
  }

  /** Only visible on small screens; opens the category drawer. */
  async clickMenu(): Promise<void> {
    await this.menuButton.click();
  }

  /** Only visible on the product-detail page; returns to the category list. */
  async clickBack(): Promise<void> {
    await this.backButton.click();
  }

  async getCartCount(): Promise<number> {
    const visible = await this.cartBadge.isVisible();
    if (!visible) return 0;
    return parseInt((await this.cartBadge.getText()) || '0', 10);
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return this.cartBadge.isVisible();
  }

  async isBackButtonVisible(): Promise<boolean> {
    return this.backButton.isVisible();
  }

  async isMenuButtonVisible(): Promise<boolean> {
    return this.menuButton.isVisible();
  }

  locator(): Locator {
    return this.root;
  }
}
