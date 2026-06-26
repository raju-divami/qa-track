# FLOW_002 — Add Products from Multiple Categories and Checkout

**Priority**: P0
**Objective**: Verify that a user can add products from different categories, review a combined cart, and complete a successful checkout.

---

## Test Data

| Field | Value |
|-------|-------|
| Product 1 | First product in Men's T-Shirts, Size S, Qty 2 |
| Product 2 | First product in Ladies Outerwear, Size L, Qty 1 |
| Email | `shopper@example.com` |
| Phone | `8001234567` |
| Ship Address | `789 Oak Avenue` |
| Ship City | `Seattle` |
| Ship State | `WA` |
| Ship Zip | `98101` |
| Ship Country | `US` |
| Card Name | `Jane Smith` |
| Card Number | `4111111111111111` |
| Expiry Month | `06` |
| Expiry Year | `2026` |
| CVV | `456` |

---

## Preconditions

- Clean state (empty cart, localStorage cleared)
- Network is available

---

## Steps

### Step 1 — Open the application
**Action**: Navigate to `https://shop.polymer-project.org/`
**Expected Result**:
- Home page loads with 4 category tiles visible
- Cart badge shows 0 or is absent

---

### Step 2 — Navigate to Men's T-Shirts
**Action**: Click the "Men's T-Shirts" category tile (or tab)
**Expected Result**:
- URL changes to `/list/mens_tshirts`
- Men's T-Shirts product grid is shown

---

### Step 3 — Add first product (Men's T-Shirts)
**Action**: Click the first product; on detail page select Size "S", Qty "2"; click "Add to Cart"
**Expected Result**:
- Cart modal appears confirming the item was added
- Cart badge updates to show "2"

---

### Step 4 — Close modal and navigate to Ladies Outerwear
**Action**: Click the close button on the cart modal; click "Ladies Outerwear" in the category nav
**Expected Result**:
- Modal closes; user remains on the app
- URL changes to `/list/ladies_outerwear`
- Ladies Outerwear product grid is displayed

---

### Step 5 — Add second product (Ladies Outerwear)
**Action**: Click the first product; on detail page select Size "L", Qty "1"; click "Add to Cart"
**Expected Result**:
- Cart modal appears confirming the second item was added
- Cart badge updates to show "3" (2 from product 1 + 1 from product 2)

---

### Step 6 — Go to cart
**Action**: Click "View Cart" in the cart modal
**Expected Result**:
- URL changes to `/cart`
- Cart shows two separate line items:
  - Men's T-Shirts product — size S, qty 2
  - Ladies Outerwear product — size L, qty 1
- Cart total equals (price of T-Shirt × 2) + (price of Outerwear × 1)

---

### Step 7 — Review order total
**Action**: Note the displayed cart total
**Expected Result**:
- Total is in `$XX.XX` format and mathematically correct

---

### Step 8 — Proceed to checkout
**Action**: Click the "Checkout" button
**Expected Result**:
- URL changes to `/checkout`
- Checkout page loads
- Order Summary section lists both products with correct quantities and prices
- Summary total matches the cart total noted in Step 7

---

### Step 9 — Fill in all required fields
**Action**: Complete all checkout form sections with the test data above
**Expected Result**:
- All fields accept input
- No validation errors are shown

---

### Step 10 — Place the order
**Action**: Click "Place Order"
**Expected Result**:
- Form submits; brief loading state appears

---

### Step 11 — Verify success page
**Expected Result**:
- URL becomes `/checkout/success`
- Success confirmation message is displayed
- Cart badge is cleared

---

### Step 12 — Confirm cart is emptied
**Action**: Navigate to `/cart`
**Expected Result**:
- Cart is empty; empty cart message is shown
- Neither of the two products appears
