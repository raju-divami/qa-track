import { Locator, Page } from '@playwright/test';

/**
 * Mobile side-drawer navigation rendered by shop-app.js.
 * Only rendered on small screens (max-width: 767px).
 *
 * DOM:
 *   <app-drawer>
 *     <iron-selector role="navigation" class="drawer-list" selected="mens_tshirts">
 *       <a name="mens_outerwear"  href="/list/mens_outerwear">Men's Outerwear</a>
 *       <a name="ladies_outerwear" href="/list/ladies_outerwear">Ladies Outerwear</a>
 *       <a name="mens_tshirts"    href="/list/mens_tshirts">Men's T-Shirts</a>
 *       <a name="ladies_tshirts"  href="/list/ladies_tshirts">Ladies T-Shirts</a>
 *     </iron-selector>
 *   </app-drawer>
 *
 * Usage:
 *   new CategoryDrawerComponent(page, page.locator('app-drawer'))
 */
export class CategoryDrawerComponent {
  /** Initializes the component with the given root locator. */
  constructor(
    private readonly page: Page,
    private readonly root: Locator,
  ) {}

  private get drawerList(): Locator {
    return this.root.locator('.drawer-list');
  }

  /** Returns whether the drawer is currently open (has the `opened` attribute). */
  async isOpen(): Promise<boolean> {
    const opened = await this.root.getAttribute('opened');
    return opened !== null;
  }

  /** Clicks the navigation link for the given category name slug. */
  async clickCategory(categoryName: string): Promise<void> {
    await this.drawerList.locator(`a[name="${categoryName}"]`).click();
  }

  /** Returns all category links in the drawer as `{ name, label }` pairs. */
  async getCategoryLinks(): Promise<Array<{ name: string; label: string }>> {
    const links = this.drawerList.locator('a');
    const count = await links.count();
    const result: Array<{ name: string; label: string }> = [];
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const name = await link.getAttribute('name');
      const label = await link.textContent();
      if (name && label) result.push({ name, label: label.trim() });
    }
    return result;
  }

  /** Returns the currently selected category name from the iron-selector's `selected` attribute. */
  async getSelectedCategoryName(): Promise<string | null> {
    return this.drawerList.getAttribute('selected');
  }

  /** Returns whether the drawer element is visible on the page. */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  /** Waits for the drawer to become visible, up to the given timeout in milliseconds. */
  async waitForOpen(timeout = 3000): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout });
  }

  /** Returns the root locator for this component. */
  locator(): Locator {
    return this.root;
  }
}
