import { Locator, Page } from '@playwright/test';
import { BaseElement } from './BaseElement';

/**
 * Wraps a <shop-input> light-DOM component.
 *
 * DOM structure:
 *   <shop-input>
 *     <input type="..." id="..." placeholder="..." required? aria-invalid?>
 *     <shop-md-decorator error-message="...">
 *       <label>Field Label</label>
 *       <shop-underline></shop-underline>
 *     </shop-md-decorator>
 *   </shop-input>
 *
 * Usage:
 *   new InputElement(page, page.locator('shop-input:has(#accountEmail)'))
 */
export class InputElement extends BaseElement {
  private get input(): Locator {
    return this.root.locator('> input');
  }

  private get decorator(): Locator {
    return this.root.locator('> shop-md-decorator');
  }

  private get labelEl(): Locator {
    return this.decorator.locator('> label');
  }

  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  async getValue(): Promise<string> {
    return this.input.inputValue();
  }

  async setValue(value: string): Promise<void> {
    await this.input.clear();
    await this.input.fill(value);
  }

  async clear(): Promise<void> {
    await this.input.clear();
  }

  async type(value: string): Promise<void> {
    await this.input.pressSequentially(value);
  }

  async getPlaceholder(): Promise<string | null> {
    return this.input.getAttribute('placeholder');
  }

  async getLabel(): Promise<string | null> {
    const count = await this.labelEl.count();
    if (count > 0) {
      return (await this.labelEl.textContent())?.trim() ?? null;
    }
    return this.input.getAttribute('aria-label');
  }

  /**
   * Returns the static error message string defined on the decorator
   * (the `error-message` attribute), regardless of whether the error
   * is currently being shown.
   */
  async getErrorMessage(): Promise<string | null> {
    return this.decorator.getAttribute('error-message');
  }

  async isRequired(): Promise<boolean> {
    const req = await this.input.getAttribute('required');
    return req !== null;
  }

  /**
   * True when the checkout validation logic sets aria-invalid="true"
   * after a failed form submission.
   */
  async isInvalid(): Promise<boolean> {
    const ariaInvalid = await this.input.getAttribute('aria-invalid');
    return ariaInvalid === 'true';
  }

  async isDisabled(): Promise<boolean> {
    return this.input.isDisabled();
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  async focus(): Promise<void> {
    await this.input.focus();
  }

  async getType(): Promise<string | null> {
    return this.input.getAttribute('type');
  }

  async getId(): Promise<string | null> {
    return this.input.getAttribute('id');
  }

  async getName(): Promise<string | null> {
    return this.input.getAttribute('name');
  }
}
