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
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  async click(): Promise<void> {
    await this.root.click();
  }

  async getText(): Promise<string> {
    return (await this.root.textContent())?.trim() ?? '';
  }

  async getAriaLabel(): Promise<string | null> {
    return this.root.getAttribute('aria-label');
  }

  async isDisabled(): Promise<boolean> {
    const disabled = await this.root.getAttribute('disabled');
    if (disabled !== null) return true;
    return this.root.isDisabled();
  }

  async hover(): Promise<void> {
    await this.root.hover();
  }

  async waitForEnabled(timeout = 5000): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout });
    await this.page.waitForFunction(
      (el) => !(el as HTMLButtonElement).disabled,
      await this.root.elementHandle(),
      { timeout },
    );
  }

  async focus(): Promise<void> {
    await this.root.focus();
  }
}
