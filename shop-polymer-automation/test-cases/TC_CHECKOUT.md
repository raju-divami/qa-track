# TC_CHECKOUT — Checkout Form & Order Placement

**Route**: `/checkout`
**Component**: `shop-checkout.js`

---

## CHK_001
**Title**: Checkout page loads with all form sections visible
**Priority**: P0
**Preconditions**: Cart has at least one item, user navigates to `/checkout`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/checkout` | Checkout page loads |
| 2 | Observe page structure | Four sections visible: Account Information, Shipping Address, Payment Information, Order Summary |

---

## CHK_002
**Title**: Order summary displays correct cart items and total
**Priority**: P0
**Preconditions**: Cart has known items (e.g., 1 item at $24.99)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/checkout` | Checkout page loads |
| 2 | Locate the Order Summary section | All cart items are listed with name, quantity, size, and price |
| 3 | Verify total | Total matches the cart total calculated on the cart page |

---

## CHK_003
**Title**: Billing address section is hidden by default
**Priority**: P1
**Preconditions**: User is on the checkout page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Observe the checkout form | Billing address fields are not visible |
| 2 | Locate the billing address toggle checkbox | Checkbox exists and is unchecked |

---

## CHK_004
**Title**: Checking billing address toggle reveals billing fields
**Priority**: P1
**Preconditions**: User is on the checkout page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Check the "Use a different billing address" checkbox | Billing address section expands/appears |
| 2 | Observe billing fields | Address, City, State, Zip, and Country fields are now visible and editable |

---

## CHK_005
**Title**: Unchecking billing address toggle hides billing fields
**Priority**: P1
**Preconditions**: Billing address checkbox is checked and fields are visible

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Uncheck the billing address toggle | Billing address fields collapse and disappear |

---

## CHK_006
**Title**: Country dropdown for shipping contains US and Canada options
**Priority**: P2
**Preconditions**: Checkout page is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the "Country" dropdown in the Shipping Address section | Dropdown opens |
| 2 | Observe options | "United States" (US) and "Canada" (CA) are available |

---

## CHK_007
**Title**: Expiry month dropdown contains all 12 months
**Priority**: P2
**Preconditions**: Checkout page is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the "Expiry Month" dropdown in Payment section | Dropdown opens |
| 2 | Count options | 12 months (Jan through Dec / 01 through 12) are listed |

---

## CHK_008
**Title**: Expiry year dropdown contains years 2016 through 2026
**Priority**: P2
**Preconditions**: Checkout page is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the "Expiry Year" dropdown in Payment section | Dropdown opens |
| 2 | Observe options | Years from 2016 to 2026 are listed |

---

## CHK_009
**Title**: Successful order placement navigates to success page
**Priority**: P0
**Preconditions**: Cart has items; checkout page is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Fill in all required fields with valid data (see below) | All fields filled |
| 2 | Click "Place Order" button | A loading/waiting state may appear briefly |
| 3 | Observe URL and page | URL becomes `/checkout/success`; a success message is displayed |
| 4 | Observe cart badge | Cart badge is cleared (empty cart) |

**Valid test data:**
- Email: `test@example.com`
- Phone: `1234567890`
- Address: `123 Main Street`
- City: `Springfield`
- State: `IL`
- Zip: `62701`
- Country: `US`
- Card Name: `John Doe`
- Card Number: `4111111111111111`
- Expiry Month: `12`
- Expiry Year: `2026`
- CVV: `123`

---

## CHK_010
**Title**: Cart is cleared after successful order placement
**Priority**: P0
**Preconditions**: Successful order placed (CHK_009)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | After reaching success page, navigate to `/cart` | Cart page loads |
| 2 | Observe cart contents | Cart is empty; empty cart message is shown |

---

## CHK_011
**Title**: Order error page is shown on failed transaction
**Priority**: P1
**Preconditions**: Application responds with error response (mocked or triggered)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Submit checkout form in an error-triggering scenario | Form submits |
| 2 | Observe URL and page | URL becomes `/checkout/error`; an error message is displayed |

---

## CHK_012
**Title**: "Place Order" button is disabled / shows loading state during submission
**Priority**: P2
**Preconditions**: Checkout form filled with valid data

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Place Order" | Button shows loading/waiting state or becomes disabled |
| 2 | Wait for response | Button state resets or page transitions to success/error |

---

## CHK_013
**Title**: Checkout page is not accessible with an empty cart
**Priority**: P1
**Preconditions**: Clean state (empty cart)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate directly to `/checkout` with empty cart | Page loads |
| 2 | Observe page state | Either redirects away or shows an appropriate empty-cart notice |

---

## CHK_014
**Title**: Form retains entered values when switching sections (no reset on tab change)
**Priority**: P2
**Preconditions**: Checkout page is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Fill in account email and phone | Values entered |
| 2 | Fill in shipping address fields | Values entered |
| 3 | Scroll back up to Account section | Email and phone values are still present and unchanged |
