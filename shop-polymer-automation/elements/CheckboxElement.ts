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

  /** Initializes the checkbox element with the owning page and root locator. */
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  /** Returns true if the checkbox is currently checked. */
  async isChecked(): Promise<boolean> {
    return this.checkbox.isChecked();
  }

  /** Checks the checkbox if it is not already checked. */
  async check(): Promise<void> {
    if (!(await this.isChecked())) {
      await this.checkbox.check();
    }
  }

  /** Unchecks the checkbox if it is currently checked. */
  async uncheck(): Promise<void> {
    if (await this.isChecked()) {
      await this.checkbox.uncheck();
    }
  }

  /** Toggles the checkbox state with a click. */
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

  /** Returns true if the checkbox input is disabled. */
  async isDisabled(): Promise<boolean> {
    return this.checkbox.isDisabled();
  }

  /** Returns true if the root wrapper element is visible. */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  /** Returns the id attribute of the underlying checkbox input. */
  async getId(): Promise<string | null> {
    return this.checkbox.getAttribute('id');
  }
}
