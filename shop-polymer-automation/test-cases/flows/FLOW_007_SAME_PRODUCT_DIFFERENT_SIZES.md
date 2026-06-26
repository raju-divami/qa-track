# FLOW_007 — Add Same Product in Multiple Sizes and Checkout

**Priority**: P2
**Objective**: Verify that adding the same product in different sizes creates separate cart line items, each tracked independently, and the combined order can be checked out.

---

## Test Data

| Field | Value |
|-------|-------|
| Product | First product in Men's T-Shirts |
| Addition 1 | Size S, Qty 1 |
| Addition 2 | Size L, Qty 2 |
| Addition 3 | Size XL, Qty 1 |
| Email | `sizefan@example.com` |
| Phone | `3005558765` |
| Ship Address | `77 Wardrobe Way` |
| Ship City | `Chicago` |
| Ship State | `IL` |
| Ship Zip | `60601` |
| Ship Country | `US` |
| Card Name | `Size Fan` |
| Card Number | `4111111111111111` |
| Expiry Month | `08` |
| Expiry Year | `2026` |
| CVV | `111` |

---

## Preconditions

- Clean state (empty cart)
- Network is available

---

## Steps

### Step 1 — Open the application
**Action**: Navigate to `https://shop.polymer-project.org/`
**Expected Result**: Home page loads; cart badge shows 0

---

### Step 2 — Navigate to Men's T-Shirts and open the first product
**Action**: Click "Men's T-Shirts" → click the first product card
**Expected Result**:
- Product detail page loads
- Note the product name and price for verification later

---

### Step 3 — Add the product in size S
**Action**: Select size "S", qty "1"; click "Add to Cart"
**Expected Result**:
- Cart modal confirms addition
- Cart badge shows "1"

---

### Step 4 — Add the same product in size L
**Action**: Close the modal (stay on the same detail page); select size "L", qty "2"; click "Add to Cart"
**Expected Result**:
- Cart modal appears again
- Cart badge updates to "3" (1 + 2)

---

### Step 5 — Add the same product in size XL
**Action**: Close the modal; select size "XL", qty "1"; click "Add to Cart"
**Expected Result**:
- Cart modal appears again
- Cart badge updates to "4" (1 + 2 + 1)

---

### Step 6 — Navigate to cart and verify three separate rows
**Action**: Navigate to `/cart`
**Expected Result**:
- Cart shows three separate rows for the same product, distinguished by size:
  - Row 1: size S, qty 1
  - Row 2: size L, qty 2
  - Row 3: size XL, qty 1
- Cart total = (price × 1) + (price × 2) + (price × 1) = price × 4

---

### Step 7 — Verify total is correct
**Action**: Observe the cart total
**Expected Result**:
- Total equals the product unit price multiplied by 4

---

### Step 8 — Proceed to checkout
**Action**: Click "Checkout"
**Expected Result**:
- URL changes to `/checkout`
- Order Summary shows all three size variants with correct quantities

---

### Step 9 — Complete and submit the checkout form
**Action**: Fill all fields with the test data above; click "Place Order"
**Expected Result**:
- Form submits; no validation errors

---

### Step 10 — Verify order success
**Expected Result**:
- URL becomes `/checkout/success`
- Success message displayed
- Cart badge cleared

---

### Step 11 — Confirm all size entries are removed from cart
**Action**: Navigate to `/cart`
**Expected Result**:
- Cart is completely empty (all three size variants were cleared)
