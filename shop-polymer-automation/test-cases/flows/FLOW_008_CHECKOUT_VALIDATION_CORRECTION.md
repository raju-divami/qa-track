# FLOW_008 — Submit Invalid Checkout Form, Fix Errors, and Complete Order

**Priority**: P1
**Objective**: Verify that form validation correctly blocks submission, highlights the right fields, allows the user to correct errors, and then proceeds to a successful order.

---

## Test Data

### Invalid Inputs (deliberately wrong)

| Field | Invalid Value | Validation Rule Violated |
|-------|--------------|--------------------------|
| Email | `notanemail` | Must be valid email format |
| Phone | `123` | Must be 10+ digits |
| Ship Address | `12` | Must be 5+ characters |
| Ship City | `A` | Must be 2+ characters |
| Ship State | `X` | Must be 2+ characters |
| Ship Zip | `99` | Must be 4+ characters |
| Card Name | `AB` | Must be 3+ characters |
| Card Number | `12345` | Must be 15+ digits |
| CVV | `1` | Must be 3–4 digits |

### Valid Corrected Inputs

| Field | Valid Value |
|-------|------------|
| Email | `fixeduser@example.com` |
| Phone | `2005551234` |
| Ship Address | `321 Correct Street` |
| Ship City | `Miami` |
| Ship State | `FL` |
| Ship Zip | `33101` |
| Ship Country | `US` |
| Card Name | `Fixed User` |
| Card Number | `4111111111111111` |
| Expiry Month | `07` |
| Expiry Year | `2026` |
| CVV | `999` |

---

## Preconditions

- Cart has at least one item (add any product before starting this flow)
- User is on the checkout page (`/checkout`)

---

## Steps

### Step 1 — Add a product and navigate to checkout
**Action**: Add any product to cart → navigate to `/checkout`
**Expected Result**:
- Checkout page loads with all sections visible
- Order Summary shows the added product

---

### Step 2 — Enter invalid values in all fields
**Action**: Fill every field with the invalid values from the table above (leave Expiry Month and Year at defaults)
**Expected Result**:
- Fields accept the typed values (no instant field-level errors yet)

---

### Step 3 — Attempt to submit the form
**Action**: Click "Place Order"
**Expected Result**:
- Form does NOT submit
- Multiple fields are highlighted with error styling
- The first invalid field receives focus and is scrolled into view
- Error messages are shown (e.g., "Invalid Phone Number", "Invalid Address")

---

### Step 4 — Verify first invalid field gets focus
**Expected Result**:
- The email or first invalid field is focused (keyboard cursor is inside it)
- The field is visible in the viewport (scrolled to if needed)

---

### Step 5 — Correct the Email field
**Action**: Clear the Email field; enter `fixeduser@example.com`
**Expected Result**: Field accepts the valid email; error styling clears for this field

---

### Step 6 — Correct the Phone field
**Action**: Clear the Phone field; enter `2005551234`
**Expected Result**: Field accepts 10 digits; error clears

---

### Step 7 — Correct the Shipping Address fields
**Action**: Update each shipping field with the valid values from the corrected data table:
- Address: `321 Correct Street`
- City: `Miami`
- State: `FL`
- Zip: `33101`
- Country: `US`

**Expected Result**: All shipping fields update; no errors shown for these fields

---

### Step 8 — Correct the Payment fields
**Action**: Update payment fields with valid values:
- Card Name: `Fixed User`
- Card Number: `4111111111111111`
- Expiry Month: `07`
- Expiry Year: `2026`
- CVV: `999`

**Expected Result**: All payment fields accept the corrected values

---

### Step 9 — Re-submit the corrected form
**Action**: Click "Place Order"
**Expected Result**:
- No validation errors appear
- Form submits; loading state is shown briefly

---

### Step 10 — Verify successful order
**Expected Result**:
- URL becomes `/checkout/success`
- Order success message is displayed
- Cart badge is cleared

---

### Step 11 — Confirm cart is empty
**Action**: Navigate to `/cart`
**Expected Result**:
- Cart is empty; empty cart message shown
