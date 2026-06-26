# FLOW_004 — Checkout with a Different Billing Address

**Priority**: P1
**Objective**: Verify that a user can enter separate shipping and billing addresses and complete checkout successfully.

---

## Test Data

| Field | Value |
|-------|-------|
| Category | Ladies T-Shirts |
| Size | XS |
| Quantity | 1 |
| Email | `billing.test@example.com` |
| Phone | `6005554321` |
| **Shipping Address** | |
| Ship Address | `100 Shipping Lane` |
| Ship City | `Portland` |
| Ship State | `OR` |
| Ship Zip | `97201` |
| Ship Country | `US` |
| **Billing Address** | |
| Bill Address | `200 Billing Blvd` |
| Bill City | `San Francisco` |
| Bill State | `CA` |
| Bill Zip | `94102` |
| Bill Country | `US` |
| **Payment** | |
| Card Name | `Billing Tester` |
| Card Number | `4111111111111111` |
| Expiry Month | `09` |
| Expiry Year | `2026` |
| CVV | `789` |

---

## Preconditions

- Clean state (empty cart)
- Network is available

---

## Steps

### Step 1 — Open the application
**Action**: Navigate to `https://shop.polymer-project.org/`
**Expected Result**: Home page loads; cart badge is empty

---

### Step 2 — Add a product
**Action**: Go to "Ladies T-Shirts" → click the first product → select size "XS", qty "1" → click "Add to Cart"
**Expected Result**:
- Cart modal confirms addition
- Cart badge shows "1"

---

### Step 3 — Navigate to checkout
**Action**: Click "Checkout" in the cart modal (or navigate via cart page)
**Expected Result**:
- URL changes to `/checkout`
- Checkout form loads; all four sections visible

---

### Step 4 — Fill in Account Information
**Action**: Enter email `billing.test@example.com` and phone `6005554321`
**Expected Result**: Fields accept input; no errors

---

### Step 5 — Fill in Shipping Address
**Action**: Enter:
- Address: `100 Shipping Lane`
- City: `Portland`
- State: `OR`
- Zip: `97201`
- Country: `US`

**Expected Result**: All shipping fields filled; no validation errors

---

### Step 6 — Enable the billing address toggle
**Action**: Check the "Use a different billing address" checkbox
**Expected Result**:
- Billing address section expands and becomes visible
- All billing address fields are empty and editable

---

### Step 7 — Fill in Billing Address
**Action**: Enter:
- Address: `200 Billing Blvd`
- City: `San Francisco`
- State: `CA`
- Zip: `94102`
- Country: `US`

**Expected Result**: All billing fields accept input; no validation errors

---

### Step 8 — Fill in Payment Information
**Action**: Enter card details from the test data table above
**Expected Result**: All payment fields accept input

---

### Step 9 — Place the order
**Action**: Click "Place Order"
**Expected Result**: Loading state appears; form submits

---

### Step 10 — Verify success
**Expected Result**:
- URL becomes `/checkout/success`
- Order success message is displayed
- Cart badge is cleared

---

### Step 11 — Confirm cart is empty
**Action**: Navigate to `/cart`
**Expected Result**: Cart is empty; no items remain
