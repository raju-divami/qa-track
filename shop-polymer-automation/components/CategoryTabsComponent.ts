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
  /** Initializes the component with the given root locator. */
  constructor(
    private readonly page: Page,
    private readonly root: Locator,
  ) {}

  private tabLink(categoryName: string): Locator {
    return this.root.locator(`shop-tab[name="${categoryName}"] a`);
  }

  /** Clicks the tab for the given category name slug. */
  async clickTab(categoryName: string): Promise<void> {
    await this.tabLink(categoryName).click();
  }

  /** Returns the `name` attribute values of all rendered category tabs. */
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

  /** Returns the visible link text for each category tab. */
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

  /** Returns the `selected` attribute of the shop-tabs element (the active category slug). */
  async getSelectedTabName(): Promise<string | null> {
    return this.root.locator('shop-tabs').getAttribute('selected');
  }

  /** Returns whether the tab container is visible on the page. */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  /** Returns whether the given category tab is currently active. */
  async isTabActive(categoryName: string): Promise<boolean> {
    const selected = await this.getSelectedTabName();
    return selected === categoryName;
  }

  /** Returns the root locator for this component. */
  locator(): Locator {
    return this.root;
  }
}
