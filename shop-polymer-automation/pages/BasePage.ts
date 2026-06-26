import { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { CartModalComponent } from '../components/CartModalComponent';
import { CategoryTabsComponent } from '../components/CategoryTabsComponent';
import { CategoryDrawerComponent } from '../components/CategoryDrawerComponent';

/**
 * Abstract base for every page in the app.
 *
 * shop-app renders into a Polymer shadow root, so all page-level custom
 * elements (shop-home, shop-list, …) live inside that shadow root.
 * Chaining  page.locator('shop-app').locator('child')  pierces it.
 *
 * Global elements that exist on EVERY page (app-header, shop-cart-modal,
 * app-drawer, #tabContainer) are wired up here once.
 */
export abstract class BasePage {
  readonly header: HeaderComponent;
  readonly categoryTabs: CategoryTabsComponent;
  readonly categoryDrawer: CategoryDrawerComponent;
  readonly cartModal: CartModalComponent;

  constructor(protected readonly page: Page) {
    const app = page.locator('shop-app');

    this.header = new HeaderComponent(page, app.locator('app-header#header'));
    this.categoryTabs = new CategoryTabsComponent(page, app.locator('#tabContainer'));
    this.categoryDrawer = new CategoryDrawerComponent(page, app.locator('app-drawer'));
    this.cartModal = new CartModalComponent(page, app.locator('shop-cart-modal'));
  }

  /** Root element of the shop-app shadow host. */
  protected get appRoot(): Locator {
    return this.page.locator('shop-app');
  }

  abstract goto(...args: string[]): Promise<void>;

  async getUrl(): Promise<string> {
    return this.page.url();
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
