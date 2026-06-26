import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { OrderSummaryRowComponent } from '../components/OrderSummaryRowComponent';
import {
  ButtonElement,
  CheckboxElement,
  InputElement,
  SelectElement,
  TextElement,
} from '../elements';

/**
 * Checkout form page — route: /checkout  (state = "init")
 * Component: shop-checkout (Polymer shadow DOM)
 *
 * All form inputs live in shop-checkout's shadow DOM.
 * shop-input / shop-select / shop-checkbox are light-DOM wrappers (no shadow),
 * so CSS traversal works normally once shop-checkout's shadow is pierced.
 *
 * Full form structure:
 *   Account Information  → email, phone
 *   Shipping Address     → address, city, state, zip, country (select)
 *   Billing Address      → toggle checkbox + same 5 fields (conditional)
 *   Payment              → ccName, ccNumber, ccExpMonth (select), ccExpYear (select), ccCVV
 *   Order Summary        → dom-repeat rows + total row + Place Order button
 *
 * Usage:
 *   const checkout = new CheckoutPage(page);
 *   await checkout.goto();
 *   await checkout.fillAccountInfo('user@example.com', '1234567890');
 */
export class CheckoutPage extends BasePage {
  // ── Account Information ───────────────────────────────────────────────────
  readonly email: InputElement;
  readonly phone: InputElement;

  // ── Shipping Address ──────────────────────────────────────────────────────
  readonly shipAddress: InputElement;
  readonly shipCity: InputElement;
  readonly shipState: InputElement;
  readonly shipZip: InputElement;
  readonly shipCountry: SelectElement;

  // ── Billing Address (shown when toggle is checked) ────────────────────────
  readonly billingToggle: CheckboxElement;
  readonly billAddress: InputElement;
  readonly billCity: InputElement;
  readonly billState: InputElement;
  readonly billZip: InputElement;
  readonly billCountry: SelectElement;

  // ── Payment ───────────────────────────────────────────────────────────────
  readonly ccName: InputElement;
  readonly ccNumber: InputElement;
  readonly ccExpMonth: SelectElement;
  readonly ccExpYear: SelectElement;
  readonly ccCVV: InputElement;

  // ── Order summary ─────────────────────────────────────────────────────────
  readonly grandTotalRow: OrderSummaryRowComponent;
  readonly placeOrderButton: ButtonElement;
  readonly emptyCartMessage: TextElement;

  /** Initialises all checkout form elements anchored to the shop-checkout shadow root. */
  constructor(page: Page) {
    super(page);

    // Account
    this.email = this.makeInput('accountEmail');
    this.phone = this.makeInput('accountPhone');

    // Shipping
    this.shipAddress = this.makeInput('shipAddress');
    this.shipCity = this.makeInput('shipCity');
    this.shipState = this.makeInput('shipState');
    this.shipZip = this.makeInput('shipZip');
    this.shipCountry = this.makeSelect('shipCountry');

    // Billing
    this.billingToggle = this.makeCheckbox('setBilling');
    this.billAddress = this.makeInput('billAddress');
    this.billCity = this.makeInput('billCity');
    this.billState = this.makeInput('billState');
    this.billZip = this.makeInput('billZip');
    this.billCountry = this.makeSelect('billCountry');

    // Payment
    this.ccName = this.makeInput('ccName');
    this.ccNumber = this.makeInput('ccNumber');
    this.ccExpMonth = this.makeSelect('ccExpMonth');
    this.ccExpYear = this.makeSelect('ccExpYear');
    this.ccCVV = this.makeInput('ccCVV');

    // Summary
    const root = this.root;
    this.grandTotalRow = new OrderSummaryRowComponent(page, root.locator('.total-row'));
    this.placeOrderButton = new ButtonElement(page, root.locator('input[type="button"][value="Place Order"]'));
    this.emptyCartMessage = new TextElement(page, root.locator('p.empty-cart'));
  }

  private get root(): Locator {
    return this.appRoot.locator('shop-checkout');
  }

  // ── Locator helpers ───────────────────────────────────────────────────────

  /** Build an InputElement by locating the shop-input containing an <input id="...">. */
  private makeInput(id: string): InputElement {
    return new InputElement(
      this.page,
      this.root.locator('shop-input').filter({ has: this.root.locator(`#${id}`) }),
    );
  }

  /** Build a SelectElement by locating the shop-select containing a <select id="...">. */
  private makeSelect(id: string): SelectElement {
    return new SelectElement(
      this.page,
      this.root.locator('shop-select').filter({ has: this.root.locator(`#${id}`) }),
    );
  }

  /** Build a CheckboxElement by locating the shop-checkbox containing an <input id="...">. */
  private makeCheckbox(id: string): CheckboxElement {
    return new CheckboxElement(
      this.page,
      this.root.locator('shop-checkbox').filter({ has: this.root.locator(`#${id}`) }),
    );
  }

  /** Navigates to the checkout page and waits for the root element to be visible. */
  async goto(): Promise<void> {
    await this.page.goto('/checkout');
    await this.root.waitFor({ state: 'visible' });
  }

  // ── Order summary rows ────────────────────────────────────────────────────

  /** All order summary item rows (excludes the grand total row). */
  getOrderSummaryRows(): Locator {
    return this.root.locator('.order-summary-row');
  }

  /** Returns an order summary row component at the given zero-based index. */
  getOrderSummaryRow(index: number): OrderSummaryRowComponent {
    return new OrderSummaryRowComponent(this.page, this.getOrderSummaryRows().nth(index));
  }

  /** Returns the number of line items in the order summary. */
  async getOrderSummaryRowCount(): Promise<number> {
    return this.getOrderSummaryRows().count();
  }

  /** Returns the grand total text including the currency symbol. */
  async getGrandTotal(): Promise<string> {
    return this.grandTotalRow.getAmount();
  }

  /** Returns the grand total as a floating-point number. */
  async getGrandTotalValue(): Promise<number> {
    return this.grandTotalRow.getAmountValue();
  }

  // ── Section-level fill helpers ────────────────────────────────────────────

  /** Fills the account information section with email and phone. */
  async fillAccountInfo(emailVal: string, phoneVal: string): Promise<void> {
    await this.email.setValue(emailVal);
    await this.phone.setValue(phoneVal);
  }

  /** Fills all shipping address fields. */
  async fillShippingAddress(opts: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }): Promise<void> {
    await this.shipAddress.setValue(opts.address);
    await this.shipCity.setValue(opts.city);
    await this.shipState.setValue(opts.state);
    await this.shipZip.setValue(opts.zip);
    await this.shipCountry.selectByValue(opts.country);
  }

  /** Enables the billing address toggle and fills all billing address fields. */
  async fillBillingAddress(opts: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }): Promise<void> {
    await this.billingToggle.check();
    await this.billAddress.setValue(opts.address);
    await this.billCity.setValue(opts.city);
    await this.billState.setValue(opts.state);
    await this.billZip.setValue(opts.zip);
    await this.billCountry.selectByValue(opts.country);
  }

  /** Fills all payment fields including card number, expiry, and CVV. */
  async fillPaymentInfo(opts: {
    name: string;
    number: string;
    expMonth: string;
    expYear: string;
    cvv: string;
  }): Promise<void> {
    await this.ccName.setValue(opts.name);
    await this.ccNumber.setValue(opts.number);
    await this.ccExpMonth.selectByValue(opts.expMonth);
    await this.ccExpYear.selectByValue(opts.expYear);
    await this.ccCVV.setValue(opts.cvv);
  }

  /** Clicks the Place Order button to submit the checkout form. */
  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }

  /** Returns true if the billing address section is visible. */
  async isBillingAddressVisible(): Promise<boolean> {
    return this.root.locator('#billAddress').isVisible();
  }

  /** Returns true if the empty cart message is visible. */
  async isEmptyCartMessageVisible(): Promise<boolean> {
    return this.emptyCartMessage.isVisible();
  }

  /** Returns true if the checkout page root element is visible. */
  async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }
}
