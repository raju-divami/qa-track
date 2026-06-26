import { Locator, Page } from '@playwright/test';

export abstract class BaseElement {
  constructor(
    protected readonly page: Page,
    protected readonly root: Locator,
  ) {}

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  async isHidden(): Promise<boolean> {
    return this.root.isHidden();
  }

  async isDisabled(): Promise<boolean> {
    return this.root.isDisabled();
  }

  async isEnabled(): Promise<boolean> {
    return this.root.isEnabled();
  }

  async getAttribute(name: string): Promise<string | null> {
    return this.root.getAttribute(name);
  }

  async waitForVisible(timeout = 5000): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout });
  }

  async waitForHidden(timeout = 5000): Promise<void> {
    await this.root.waitFor({ state: 'hidden', timeout });
  }

  async scrollIntoView(): Promise<void> {
    await this.root.scrollIntoViewIfNeeded();
  }

  locator(): Locator {
    return this.root;
  }
}
