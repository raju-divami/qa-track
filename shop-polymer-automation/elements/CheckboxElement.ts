import { Locator, Page } from '@playwright/test';
import { BaseElement } from './BaseElement';

/**
 * Wraps a <shop-checkbox> light-DOM component.
 *
 * DOM structure:
 *   <shop-checkbox>
 *     <input type="checkbox" id="setBilling" ...>
 *     <shop-md-decorator></shop-md-decorator>
 *   </shop-checkbox>
 *   <label for="setBilling">Use different billing address</label>
 *
 * The visible label is a sibling element outside the wrapper,
 * associated via `for` → checkbox `id`.
 *
 * Usage:
 *   new CheckboxElement(page, page.locator('shop-checkbox:has(#setBilling)'))
 */
export class CheckboxElement extends BaseElement {
  private get checkbox(): Locator {
    return this.root.locator('> input[type="checkbox"]');
  }

  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  async isChecked(): Promise<boolean> {
    return this.checkbox.isChecked();
  }

  async check(): Promise<void> {
    if (!(await this.isChecked())) {
      await this.checkbox.check();
    }
  }

  async uncheck(): Promise<void> {
    if (await this.isChecked()) {
      await this.checkbox.uncheck();
    }
  }

  async toggle(): Promise<void> {
    await this.checkbox.click();
  }

  /**
   * Resolves the associated label via the sibling <label for="id"> element.
   */
  async getLabel(): Promise<string | null> {
    const id = await this.checkbox.getAttribute('id');
    if (!id) return null;
    const labelEl = this.page.locator(`label[for="${id}"]`);
    if (await labelEl.count() > 0) {
      return (await labelEl.textContent())?.trim() ?? null;
    }
    return this.checkbox.getAttribute('aria-label');
  }

  async isDisabled(): Promise<boolean> {
    return this.checkbox.isDisabled();
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  async getId(): Promise<string | null> {
    return this.checkbox.getAttribute('id');
  }
}
