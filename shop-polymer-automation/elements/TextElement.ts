import { Locator, Page } from '@playwright/test';
import { BaseElement } from './BaseElement';

/**
 * Wraps any read-only text container: headings, price labels,
 * cart totals, success/error messages, product titles, etc.
 *
 * Usage:
 *   new TextElement(page, page.locator('.price'))
 *   new TextElement(page, page.locator('h1'))
 *   new TextElement(page, page.locator('.cart-total-row .price'))
 */
export class TextElement extends BaseElement {
  /** Initializes the text element with the owning page and root locator. */
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  /** Returns the trimmed text content of the element. */
  async getText(): Promise<string> {
    return (await this.root.textContent())?.trim() ?? '';
  }

  /** Returns the trimmed inner text of the element, respecting CSS rendering. */
  async getInnerText(): Promise<string> {
    return (await this.root.innerText()).trim();
  }

  /** Returns true if the element has no text content. */
  async isEmpty(): Promise<boolean> {
    const text = await this.getText();
    return text.length === 0;
  }

  /** Returns true if the text content includes the given string. */
  async containsText(text: string): Promise<boolean> {
    const content = await this.getText();
    return content.includes(text);
  }

  /** Waits until the element contains the expected text and is visible. */
  async waitForText(expected: string, timeout = 5000): Promise<void> {
    await this.root.filter({ hasText: expected }).waitFor({ state: 'visible', timeout });
  }
}
