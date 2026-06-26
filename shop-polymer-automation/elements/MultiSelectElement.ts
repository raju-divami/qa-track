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
  /** Initializes the multi-select element with the owning page and root locator. */
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  /** Returns the values of all currently selected options. */
  async getSelectedValues(): Promise<string[]> {
    return this.root.evaluate((el) => {
      const select = el as HTMLSelectElement;
      return Array.from(select.selectedOptions).map((o) => o.value);
    });
  }

  /** Returns the display labels of all currently selected options. */
  async getSelectedLabels(): Promise<string[]> {
    return this.root.evaluate((el) => {
      const select = el as HTMLSelectElement;
      return Array.from(select.selectedOptions).map((o) => o.text.trim());
    });
  }

  /** Selects options matching the given values, replacing any existing selection. */
  async selectValues(values: string[]): Promise<void> {
    await this.root.selectOption(values.map((v) => ({ value: v })));
  }

  /** Selects options matching the given display labels, replacing any existing selection. */
  async selectLabels(labels: string[]): Promise<void> {
    await this.root.selectOption(labels.map((l) => ({ label: l })));
  }

  /** Deselects all options and dispatches a change event. */
  async deselectAll(): Promise<void> {
    await this.root.evaluate((el) => {
      const select = el as HTMLSelectElement;
      Array.from(select.options).forEach((o) => (o.selected = false));
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  /** Returns all available options with their value, label, and selected state. */
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

  /** Returns true if the option with the given value is currently selected. */
  async isOptionSelected(value: string): Promise<boolean> {
    const selected = await this.getSelectedValues();
    return selected.includes(value);
  }

  /** Returns the accessible label for this select, checking aria-label then an associated <label>. */
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

  /** Returns true if the select element is disabled. */
  async isDisabled(): Promise<boolean> {
    return this.root.isDisabled();
  }
}
