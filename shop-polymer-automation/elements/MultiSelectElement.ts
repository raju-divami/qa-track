import { Locator, Page } from '@playwright/test';
import { BaseElement } from './BaseElement';
import { SelectOption } from './SelectElement';

/**
 * Wraps a <select multiple> element.
 *
 * The shop-polymer app does not use multi-selects directly, but this element
 * is provided for completeness and future use.
 *
 * Usage:
 *   new MultiSelectElement(page, page.locator('select[multiple]#roles'))
 */
export class MultiSelectElement extends BaseElement {
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  async getSelectedValues(): Promise<string[]> {
    return this.root.evaluate((el) => {
      const select = el as HTMLSelectElement;
      return Array.from(select.selectedOptions).map((o) => o.value);
    });
  }

  async getSelectedLabels(): Promise<string[]> {
    return this.root.evaluate((el) => {
      const select = el as HTMLSelectElement;
      return Array.from(select.selectedOptions).map((o) => o.text.trim());
    });
  }

  async selectValues(values: string[]): Promise<void> {
    await this.root.selectOption(values.map((v) => ({ value: v })));
  }

  async selectLabels(labels: string[]): Promise<void> {
    await this.root.selectOption(labels.map((l) => ({ label: l })));
  }

  async deselectAll(): Promise<void> {
    await this.root.evaluate((el) => {
      const select = el as HTMLSelectElement;
      Array.from(select.options).forEach((o) => (o.selected = false));
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  async getOptions(): Promise<SelectOption[]> {
    return this.root.evaluate((el) => {
      const select = el as HTMLSelectElement;
      return Array.from(select.options).map((o) => ({
        value: o.value,
        label: o.text.trim(),
        selected: o.selected,
      }));
    });
  }

  async isOptionSelected(value: string): Promise<boolean> {
    const selected = await this.getSelectedValues();
    return selected.includes(value);
  }

  async getLabel(): Promise<string | null> {
    const ariaLabel = await this.root.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    const id = await this.root.getAttribute('id');
    if (id) {
      const labelEl = this.page.locator(`label[for="${id}"]`);
      if (await labelEl.count() > 0) {
        return (await labelEl.textContent())?.trim() ?? null;
      }
    }

    return null;
  }

  async isDisabled(): Promise<boolean> {
    return this.root.isDisabled();
  }
}
