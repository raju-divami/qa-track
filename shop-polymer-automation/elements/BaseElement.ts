import { Locator, Page } from '@playwright/test';

export abstract class BaseElement {
  /** Initializes the element with the owning page and root locator. */
  constructor(
    protected readonly page: Page,
    protected readonly root: Locator,
  ) {}

  /** Returns true if the element is visible in the DOM. */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  /** Returns true if the element is hidden or not present in the DOM. */
  async isHidden(): Promise<boolean> {
    return this.root.isHidden();
  }

  /** Returns true if the element is disabled. */
  async isDisabled(): Promise<boolean> {
    return this.root.isDisabled();
  }

  /** Returns true if the element is enabled. */
  async isEnabled(): Promise<boolean> {
    return this.root.isEnabled();
  }

  /** Returns the value of the named attribute, or null if absent. */
  async getAttribute(name: string): Promise<string | null> {
    return this.root.getAttribute(name);
  }

  /** Waits until the element becomes visible, up to the given timeout (ms). */
  async waitForVisible(timeout = 5000): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout });
  }

  /** Waits until the element becomes hidden, up to the given timeout (ms). */
  async waitForHidden(timeout = 5000): Promise<void> {
    await this.root.waitFor({ state: 'hidden', timeout });
  }

  /** Scrolls the element into the viewport if it is not already visible. */
  async scrollIntoView(): Promise<void> {
    await this.root.scrollIntoViewIfNeeded();
  }

  /** Returns the underlying Playwright Locator for this element. */
  locator(): Locator {
    return this.root;
  }
}
