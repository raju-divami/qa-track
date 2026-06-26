/** Shape of the checkout account-info section. */
export interface AccountData {
  email: string;
  phone: string;
}

/** Shape of a shipping or billing address section. */
export interface AddressData {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: 'US' | 'CA';
}

/** Shape of the payment info section. */
export interface PaymentData {
  name: string;
  number: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

/** Full checkout form payload. */
export interface CheckoutFormData {
  account: AccountData;
  shipping: AddressData;
  billing?: AddressData;
  payment: PaymentData;
}

// ── Valid data ───────────────────────────────────────────────────────────────

/** Valid account credentials for checkout form tests. */
export const validAccount: AccountData = {
  email: 'testuser@example.com',
  phone: '9876543210',
};

/** Valid shipping address for checkout form tests. */
export const validShipping: AddressData = {
  address: '456 Elm Street',
  city: 'Austin',
  state: 'TX',
  zip: '73301',
  country: 'US',
};

/** Valid billing address for checkout form tests. */
export const validBilling: AddressData = {
  address: '200 Billing Blvd',
  city: 'San Francisco',
  state: 'CA',
  zip: '94102',
  country: 'US',
};

/** Valid payment details for checkout form tests. */
export const validPayment: PaymentData = {
  name: 'Test User',
  number: '4111111111111111',
  expMonth: '12',
  expYear: '2026',
  cvv: '123',
};

/** Complete valid checkout form — no separate billing address. */
export const validCheckoutData: CheckoutFormData = {
  account: validAccount,
  shipping: validShipping,
  payment: validPayment,
};

/** Complete valid checkout form with a separate billing address. */
export const validCheckoutWithBilling: CheckoutFormData = {
  account: validAccount,
  shipping: validShipping,
  billing: validBilling,
  payment: validPayment,
};

// ── Invalid / edge-case data ─────────────────────────────────────────────────

/** Values that violate each field's validation rule. */
export const invalidFields = {
  /** Not a valid email format. */
  email: 'notanemail',

  /** Fewer than 10 digits (pattern: \d{10,}). */
  phone: '12345',

  /** Fewer than 5 characters (pattern: .{5,}). */
  address: '12',

  /** Fewer than 2 characters (pattern: .{2,}). */
  city: 'A',

  /** Fewer than 2 characters (pattern: .{2,}). */
  state: 'X',

  /** Fewer than 4 characters (pattern: .{4,}). */
  zip: '99',

  /** Fewer than 3 characters (pattern: .{3,}). */
  cardName: 'AB',

  /** Fewer than 15 digits (pattern: [\d\s]{15,}). */
  cardNumber: '12345678901234',

  /** Fewer than 3 digits (pattern: \d{3,4}). */
  cvv: '12',
} as const;

// ── Boundary / edge values ───────────────────────────────────────────────────

/** Minimum-valid values that sit exactly on the pattern boundary. */
export const boundaryFields = {
  phone: '1234567890',       // exactly 10 digits
  address: '12345',          // exactly 5 chars
  city: 'NY',                // exactly 2 chars
  state: 'CA',               // exactly 2 chars
  zip: '1234',               // exactly 4 chars
  cardName: 'Tom',           // exactly 3 chars
  cardNumber: '411111111111111', // exactly 15 digits
  cvv3: '123',               // exactly 3 digits
  cvv4: '1234',              // exactly 4 digits
} as const;

// ── Product size / quantity options ─────────────────────────────────────────

/** Available product size options. */
export const sizes = ['XS', 'S', 'M', 'L', 'XL'] as const;
export type Size = (typeof sizes)[number];

/** Quantity options available on the product detail page. */
export const detailQuantities = ['1', '2', '3', '4', '5'] as const;
/** Quantity options available in the cart (1–12). */
export const cartQuantities = Array.from({ length: 12 }, (_, i) =>
  String(i + 1),
) as string[];
