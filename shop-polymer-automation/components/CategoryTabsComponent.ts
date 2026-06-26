import { Locator, Page } from '@playwright/test';

/**
 * Desktop category navigation tabs inside the sticky tab container.
 * Hidden on mobile (max-width: 767px).
 *
 * DOM:
 *   <div id="tabContainer">
 *     <shop-tabs selected="mens_tshirts" attr-for-selected="name">
 *       <shop-tab name="mens_outerwear">
 *         <a href="/list/mens_outerwear">Men's Outerwear</a>
 *       </shop-tab>
 *       ...
 *     </shop-tabs>
 *   </div>
 *
 * Usage:
 *   new CategoryTabsComponent(page, page.locator('#tabContainer'))
 */
export class CategoryTabsComponent {
  constructor(
    private readonly page: Page,
    private readonly root: Locator,
  ) {}

  private tabLink(categoryName: string): Locator {
    return this.root.locator(`shop-tab[name="${categoryName}"] a`);
  }

  async clickTab(categoryName: string): Promise<void> {
    await this.tabLink(categoryName).click();
  }

  async getTabNames(): Promise<string[]> {
    const tabs = this.root.locator('shop-tab');
    const count = await tabs.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const name = await tabs.nth(i).getAttribute('name');
      if (name) names.push(name);
    }
    return names;
  }

  async getTabLabels(): Promise<string[]> {
    const links = this.root.locator('shop-tab a');
    const count = await links.count();
    const labels: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await links.nth(i).textContent();
      if (text) labels.push(text.trim());
    }
    return labels;
  }

  async getSelectedTabName(): Promise<string | null> {
    return this.root.locator('shop-tabs').getAttribute('selected');
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  async isTabActive(categoryName: string): Promise<boolean> {
    const selected = await this.getSelectedTabName();
    return selected === categoryName;
  }

  locator(): Locator {
    return this.root;
  }
}
