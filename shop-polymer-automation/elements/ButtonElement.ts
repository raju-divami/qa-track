import { Locator, Page } from '@playwright/test';
import { BaseElement } from './BaseElement';

/**
 * Wraps a <button> or <a> element.
 *
 * For shop-button wrappers, pass the inner <button>:
 *   new ButtonElement(page, page.locator('shop-button button'))
 *
 * For plain buttons or links:
 *   new ButtonElement(page, page.locator('button[aria-label="Add this item to cart"]'))
 *   new ButtonElement(page, page.locator('a[href="/cart"]'))
 */
export class ButtonElement extends BaseElement {
  /** Initializes the button element with the owning page and root locator. */
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  /** Clicks the button. */
  async click(): Promise<void> {
    await this.root.click();
  }

  /** Returns the trimmed text content of the button. */
  async getText(): Promise<string> {
    return (await this.root.textContent())?.trim() ?? '';
  }

  /** Returns the aria-label attribute value, or null if absent. */
  async getAriaLabel(): Promise<string | null> {
    return this.root.getAttribute('aria-label');
  }

  /** Returns true if the button is disabled via the disabled attribute or Playwright state. */
  async isDisabled(): Promise<boolean> {
    const disabled = await this.root.getAttribute('disabled');
    if (disabled !== null) return true;
    return this.root.isDisabled();
  }

  /** Hovers over the button. */
  async hover(): Promise<void> {
    await this.root.hover();
  }

  /** Waits until the button is visible and its disabled property is false. */
  async waitForEnabled(timeout = 5000): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout });
    await this.page.waitForFunction(
      (el) => !(el as HTMLButtonElement).disabled,
      await this.root.elementHandle(),
      { timeout },
    );
  }

  /** Focuses the button. */
  async focus(): Promise<void> {
    await this.root.focus();
  }
}
