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

  /** Initializes the input element with the owning page and root locator. */
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  /** Returns the current value of the input field. */
  async getValue(): Promise<string> {
    return this.input.inputValue();
  }

  /** Clears the input and fills it with the given value. */
  async setValue(value: string): Promise<void> {
    await this.input.clear();
    await this.input.fill(value);
  }

  /** Clears the input field. */
  async clear(): Promise<void> {
    await this.input.clear();
  }

  /** Types the given value character-by-character into the input. */
  async type(value: string): Promise<void> {
    await this.input.pressSequentially(value);
  }

  /** Returns the placeholder attribute of the input, or null if absent. */
  async getPlaceholder(): Promise<string | null> {
    return this.input.getAttribute('placeholder');
  }

  /** Returns the visible label text, falling back to the aria-label attribute. */
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

  /** Returns true if the input has the required attribute. */
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

  /** Returns true if the input is disabled. */
  async isDisabled(): Promise<boolean> {
    return this.input.isDisabled();
  }

  /** Returns true if the root wrapper element is visible. */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  /** Focuses the input field. */
  async focus(): Promise<void> {
    await this.input.focus();
  }

  /** Returns the type attribute of the input (e.g. "text", "email"). */
  async getType(): Promise<string | null> {
    return this.input.getAttribute('type');
  }

  /** Returns the id attribute of the underlying input element. */
  async getId(): Promise<string | null> {
    return this.input.getAttribute('id');
  }

  /** Returns the name attribute of the underlying input element. */
  async getName(): Promise<string | null> {
    return this.input.getAttribute('name');
  }
}
