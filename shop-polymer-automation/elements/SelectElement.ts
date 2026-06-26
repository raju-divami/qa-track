import { Locator, Page } from '@playwright/test';
import { BaseElement } from './BaseElement';

export interface SelectOption {
  value: string;
  label: string;
  selected: boolean;
}

/**
 * Wraps a <shop-select> light-DOM component.
 *
 * DOM structure:
 *   <shop-select>
 *     <label prefix>Size</label>          ← optional prefix label (detail page)
 *     <select id="..." aria-label="...">
 *       <option value="US" selected>United States</option>
 *       ...
 *     </select>
 *     <shop-md-decorator>
 *       <shop-underline></shop-underline>
 *     </shop-md-decorator>
 *   </shop-select>
 *
 * For selects with an external label (e.g. country), the label sits as a
 * sibling outside the wrapper; retrieve it via aria-labelledby on the page.
 *
 * Usage:
 *   new SelectElement(page, page.locator('shop-select:has(#shipCountry)'))
 */
export class SelectElement extends BaseElement {
  private get select(): Locator {
    return this.root.locator('> select');
  }

  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  async getValue(): Promise<string> {
    return this.select.inputValue();
  }

  async selectByValue(value: string): Promise<void> {
    await this.select.selectOption({ value });
  }

  async selectByLabel(label: string): Promise<void> {
    await this.select.selectOption({ label });
  }

  async getSelectedLabel(): Promise<string> {
    const value = await this.getValue();
    const options = await this.getOptions();
    return options.find((o) => o.value === value)?.label ?? '';
  }

  async getOptions(): Promise<SelectOption[]> {
    return this.select.evaluate((el) => {
      const select = el as HTMLSelectElement;
      return Array.from(select.options).map((o) => ({
        value: o.value,
        label: o.text.trim(),
        selected: o.selected,
      }));
    });
  }

  /**
   * Resolves the visible label for this select.
   * Checks (in order):
   *   1. Inline prefix label inside <shop-select>
   *   2. aria-label attribute on the <select>
   *   3. aria-labelledby → looks up the referenced element on the page
   */
  async getLabel(): Promise<string | null> {
    const prefixLabel = this.root.locator('[prefix]');
    if (await prefixLabel.count() > 0) {
      return (await prefixLabel.textContent())?.trim() ?? null;
    }

    const ariaLabel = await this.select.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    const labelledBy = await this.select.getAttribute('aria-labelledby');
    if (labelledBy) {
      const firstId = labelledBy.split(' ')[0];
      const labelEl = this.page.locator(`#${firstId}`);
      if (await labelEl.count() > 0) {
        return (await labelEl.textContent())?.trim() ?? null;
      }
    }

    return null;
  }

  async isDisabled(): Promise<boolean> {
    return this.select.isDisabled();
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  async getId(): Promise<string | null> {
    return this.select.getAttribute('id');
  }
}
