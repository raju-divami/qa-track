import { Locator, Page } from '@playwright/test';
import { BaseElement } from './BaseElement';

/**
 * Wraps a container whose content is rendered HTML — typically a product
 * description paragraph. The shop-detail page unescapes HTML into:
 *   <p id="desc"></p>
 * via JavaScript, so innerHTML may contain formatted markup.
 *
 * Usage:
 *   new RichTextElement(page, page.locator('p#desc'))
 */
export class RichTextElement extends BaseElement {
  constructor(page: Page, root: Locator) {
    super(page, root);
  }

  /** Plain text content with all HTML tags stripped. */
  async getText(): Promise<string> {
    return (await this.root.textContent())?.trim() ?? '';
  }

  /** Raw inner HTML including any markup. */
  async getInnerHTML(): Promise<string> {
    return this.root.innerHTML();
  }

  async isEmpty(): Promise<boolean> {
    const text = await this.getText();
    return text.length === 0;
  }

  async containsText(text: string): Promise<boolean> {
    const content = await this.getText();
    return content.includes(text);
  }

  /**
   * Checks whether the rendered HTML contains a specific tag,
   * e.g. containsTag('strong') or containsTag('br').
   */
  async containsTag(tag: string): Promise<boolean> {
    const html = await this.getInnerHTML();
    return html.toLowerCase().includes(`<${tag.toLowerCase()}`);
  }
}
