import { Locator, Page } from '@playwright/test';
import { ButtonElement, TextElement } from '../elements';

/**
 * The network / offline warning component (shop-network-warning).
 * Shown when product data fails to load (network error or offline).
 *
 * DOM (Polymer shadow DOM):
 *   <shop-network-warning>
 *     #shadow-root
 *       <div hidden$="[[offline]]">          ← server-unreachable state
 *         <h1>Couldn't reach the server</h1>
 *       </div>
 *       <div hidden$="[[!offline]]">         ← offline state
 *         <iron-icon icon="perm-scan-wifi">
 *         <h1>No internet connection</h1>
 *         <p>Check if your device is connected ...</p>
 *       </div>
 *       <shop-button>
 *         <button>Try Again</button>
 *       </shop-button>
 *   </shop-network-warning>
 *
 * Usage:
 *   new NetworkWarningComponent(page, page.locator('shop-network-warning'))
 */
export class NetworkWarningComponent {
  readonly tryAgainButton: ButtonElement;

  constructor(
    private readonly page: Page,
    private readonly root: Locator,
  ) {
    this.tryAgainButton = new ButtonElement(page, root.locator('button'));
  }

  async getHeading(): Promise<string> {
    const heading = this.root.locator('h1').first();
    return (await heading.textContent())?.trim() ?? '';
  }

  async getMessage(): Promise<string> {
    const para = this.root.locator('p').first();
    const count = await para.count();
    if (count === 0) return '';
    return (await para.textContent())?.trim() ?? '';
  }

  async clickTryAgain(): Promise<void> {
    await this.tryAgainButton.click();
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  async isHidden(): Promise<boolean> {
    return this.root.isHidden();
  }

  async waitForVisible(timeout = 5000): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout });
  }

  locator(): Locator {
    return this.root;
  }
}
