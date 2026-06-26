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

  /** Initializes the try-again button element from the given root locator. */
  constructor(
    private readonly page: Page,
    private readonly root: Locator,
  ) {
    this.tryAgainButton = new ButtonElement(page, root.locator('button'));
  }

  /** Returns the text of the first visible heading in the warning component. */
  async getHeading(): Promise<string> {
    const heading = this.root.locator('h1').first();
    return (await heading.textContent())?.trim() ?? '';
  }

  /** Returns the descriptive paragraph text, or an empty string if none is present. */
  async getMessage(): Promise<string> {
    const para = this.root.locator('p').first();
    const count = await para.count();
    if (count === 0) return '';
    return (await para.textContent())?.trim() ?? '';
  }

  /** Clicks the "Try Again" button to retry loading. */
  async clickTryAgain(): Promise<void> {
    await this.tryAgainButton.click();
  }

  /** Returns whether the network warning component is visible on the page. */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  /** Returns whether the network warning component is hidden. */
  async isHidden(): Promise<boolean> {
    return this.root.isHidden();
  }

  /** Waits for the network warning to become visible, up to the given timeout in milliseconds. */
  async waitForVisible(timeout = 5000): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout });
  }

  /** Returns the root locator for this component. */
  locator(): Locator {
    return this.root;
  }
}
