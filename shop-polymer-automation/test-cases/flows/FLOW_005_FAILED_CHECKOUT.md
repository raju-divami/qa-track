# FLOW_005 — Checkout Failure and Error Page

**Priority**: P1
**Objective**: Verify that when an order transaction fails, the user is shown an error page and the cart is not cleared, allowing the user to retry.

---

## Test Data

| Field | Value |
|-------|-------|
| Category | Men's Outerwear |
| Size | L |
| Quantity | 1 |
| Email | `failtest@example.com` |
| Phone | `5005551234` |
| Ship Address | `999 Error Street` |
| Ship City | `Las Vegas` |
| Ship State | `NV` |
| Ship Zip | `89101` |
| Ship Country | `US` |
| Card Name | `Fail Test` |
| Card Number | `4111111111111111` |
| Expiry Month | `01` |
| Expiry Year | `2024` |
| CVV | `000` |

> **Note**: The application uses a mock server. Triggering an error response depends on the server/mock configuration. In the development environment, the error flow can be forced by intercepting the server response to return `{ "error": 1, "errorMessage": "Transaction failed." }`.

---

## Preconditions

- Clean state (empty cart)
- Network is available
- Test environment or mock is configured to return an error response for this checkout

---

## Steps

### Step 1 — Open the application
**Action**: Navigate to `https://shop.polymer-project.org/`
**Expected Result**: Home page loads; empty cart

---

### Step 2 — Add a product to cart
**Action**: Go to "Men's Outerwear" → click first product → select size "L", qty "1" → click "Add to Cart"
**Expected Result**:
- Cart modal confirms the item was added
- Cart badge shows "1"

---

### Step 3 — Navigate to checkout
**Action**: Click "Checkout" in the modal or navigate to `/cart` and click "Checkout"
**Expected Result**:
- URL changes to `/checkout`
- Checkout form loads with the product in Order Summary

---

### Step 4 — Fill in all checkout fields
**Action**: Complete all form fields using the test data above
**Expected Result**:
- All fields accept input
- No validation errors appear

---

### Step 5 — Submit the order (configured for failure)
**Action**: Click "Place Order"
**Expected Result**:
- Loading/waiting state appears briefly

---

### Step 6 — Verify the error page
**Expected Result**:
- URL becomes `/checkout/error`
- An error message is displayed (e.g., "Transaction failed.")
- The user is informed that the order was not placed

---

### Step 7 — Verify cart is NOT cleared on failure
**Action**: Navigate to `/cart`
**Expected Result**:
- Cart still contains the product added in Step 2
- Items are preserved so the user can retry

---

### Step 8 — Retry: navigate back to checkout
**Action**: Click "Checkout" on the cart page
**Expected Result**:
- URL changes to `/checkout`
- Checkout form is shown again with the same cart items in Order Summary

---

### Step 9 — Fill in fields and place order (success configuration)
**Action**: Complete all fields again (same or corrected data); submit with mock configured to return success
**Expected Result**:
- URL becomes `/checkout/success`
- Success message is displayed
- Cart is cleared
