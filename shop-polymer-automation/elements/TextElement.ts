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
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  async getText(): Promise<string> {
    return (await this.root.textContent())?.trim() ?? '';
  }

  async getInnerText(): Promise<string> {
    return (await this.root.innerText()).trim();
  }

  async isEmpty(): Promise<boolean> {
    const text = await this.getText();
    return text.length === 0;
  }

  async containsText(text: string): Promise<boolean> {
    const content = await this.getText();
    return content.includes(text);
  }

  async waitForText(expected: string, timeout = 5000): Promise<void> {
    await this.root.filter({ hasText: expected }).waitFor({ state: 'visible', timeout });
  }
}
