# FLOW_006 — Cart Persistence Across Navigation and Page Reload

**Priority**: P1
**Objective**: Verify that cart contents are preserved in localStorage across page navigations and browser reloads, and that the persisted cart can be checked out successfully.

---

## Test Data

| Field | Value |
|-------|-------|
| Product | First product in Ladies Outerwear, Size M, Qty 2 |
| Email | `persist@example.com` |
| Phone | `4005559876` |
| Ship Address | `55 Oak Street` |
| Ship City | `Boston` |
| Ship State | `MA` |
| Ship Zip | `02101` |
| Ship Country | `US` |
| Card Name | `Persist User` |
| Card Number | `4111111111111111` |
| Expiry Month | `11` |
| Expiry Year | `2026` |
| CVV | `654` |

---

## Preconditions

- Clean state (empty cart, localStorage cleared)
- Network is available

---

## Steps

### Step 1 — Open the application
**Action**: Navigate to `https://shop.polymer-project.org/`
**Expected Result**: Home page loads; cart badge shows 0 or is absent

---

### Step 2 — Add a product to cart
**Action**: Go to "Ladies Outerwear" → click first product → select size "M", qty "2" → click "Add to Cart"
**Expected Result**:
- Cart modal confirms addition
- Cart badge shows "2"

---

### Step 3 — Navigate away from the product page
**Action**: Click the "SHOP" logo to return to the home page
**Expected Result**:
- Home page loads
- Cart badge still shows "2"

---

### Step 4 — Browse another category (simulate continued shopping)
**Action**: Click "Men's T-Shirts" category tile
**Expected Result**:
- Product list for Men's T-Shirts loads
- Cart badge still shows "2" — cart is retained during navigation

---

### Step 5 — Reload the browser
**Action**: Press F5 (or Cmd+R) to reload the page
**Expected Result**:
- Page reloads
- Cart badge still shows "2" after reload — cart is persisted in localStorage

---

### Step 6 — Verify cart contents after reload
**Action**: Navigate to `/cart`
**Expected Result**:
- Cart page loads
- Ladies Outerwear product is shown with size "M" and quantity "2"
- Cart total is correct (price × 2)

---

### Step 7 — Proceed to checkout
**Action**: Click "Checkout" on the cart page
**Expected Result**:
- URL changes to `/checkout`
- Order Summary shows the persisted product with correct qty and total

---

### Step 8 — Complete the checkout form
**Action**: Fill in all fields using the test data above
**Expected Result**:
- All fields accept input; no validation errors

---

### Step 9 — Place the order
**Action**: Click "Place Order"
**Expected Result**: Loading state appears

---

### Step 10 — Verify success and cart cleared
**Expected Result**:
- URL becomes `/checkout/success`
- Success message displayed
- Cart badge cleared

---

### Step 11 — Confirm localStorage is cleared
**Action**: Navigate to `/cart`
**Expected Result**:
- Cart is empty
- No items remain from the previous session
