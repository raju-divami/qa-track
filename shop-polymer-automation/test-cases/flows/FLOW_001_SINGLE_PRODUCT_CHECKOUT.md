# FLOW_001 — Browse, Add One Product, and Checkout

**Priority**: P0 (Smoke / Happy Path)
**Objective**: Verify the complete end-to-end purchase journey for a single product from home page to order success.

---

## Test Data

| Field | Value |
|-------|-------|
| Category | Men's T-Shirts |
| Product | Any first product on the list |
| Size | M (default) |
| Quantity | 1 |
| Email | `testuser@example.com` |
| Phone | `9876543210` |
| Ship Address | `456 Elm Street` |
| Ship City | `Austin` |
| Ship State | `TX` |
| Ship Zip | `73301` |
| Ship Country | `US` |
| Card Name | `Test User` |
| Card Number | `4111111111111111` |
| Expiry Month | `12` |
| Expiry Year | `2026` |
| CVV | `123` |

---

## Preconditions

- Browser is open with a clean state (localStorage cleared, empty cart)
- Network is available

---

## Steps

### Step 1 — Open the application
**Action**: Navigate to `https://shop.polymer-project.org/`
**Expected Result**:
- Home page loads successfully
- Four category tiles are visible: Men's Outerwear, Ladies Outerwear, Men's T-Shirts, Ladies T-Shirts
- Cart badge in the header shows no count or 0

---

### Step 2 — Navigate to a category
**Action**: Click the "Men's T-Shirts" category tile
**Expected Result**:
- URL changes to `/list/mens_tshirts`
- Product grid loads with multiple Men's T-Shirt products
- Each card shows product image, name, and price

---

### Step 3 — Open a product detail page
**Action**: Click the first product card in the list
**Expected Result**:
- URL changes to `/detail/mens_tshirts/<product-name>`
- Product detail page loads with large product image, title, description, and price
- Size selector defaults to "M"
- Quantity selector defaults to "1"

---

### Step 4 — Verify size and quantity defaults
**Action**: Observe the size and quantity selectors without changing them
**Expected Result**:
- Size selector shows "M"
- Quantity selector shows "1"

---

### Step 5 — Add the product to cart
**Action**: Click the "Add to Cart" button
**Expected Result**:
- A cart modal/notification appears with a confirmation message (e.g., "Added to cart")
- Cart icon badge in header updates to show "1"

---

### Step 6 — Proceed to cart via modal
**Action**: Click "View Cart" inside the cart modal
**Expected Result**:
- Modal closes
- URL changes to `/cart`
- Cart page shows:
  - The added product with its name, size "M", quantity "1", and price
  - Correct total (matching the product price)
- "Checkout" button is visible

---

### Step 7 — Proceed to checkout
**Action**: Click the "Checkout" button on the cart page
**Expected Result**:
- URL changes to `/checkout`
- Checkout form loads with four sections: Account Information, Shipping Address, Payment Information, Order Summary
- Order Summary section shows the cart item and total

---

### Step 8 — Fill in Account Information
**Action**: Enter `testuser@example.com` in Email; enter `9876543210` in Phone Number
**Expected Result**:
- Both fields accept the input without validation errors

---

### Step 9 — Fill in Shipping Address
**Action**: Enter the shipping address fields:
- Address: `456 Elm Street`
- City: `Austin`
- State: `TX`
- Zip: `73301`
- Country: select `US`

**Expected Result**:
- All fields accept input
- No validation errors shown

---

### Step 10 — Verify billing address toggle is off
**Action**: Observe the billing address section
**Expected Result**:
- "Use a different billing address" checkbox is unchecked
- Billing address fields are not visible

---

### Step 11 — Fill in Payment Information
**Action**: Enter the payment fields:
- Cardholder Name: `Test User`
- Card Number: `4111111111111111`
- Expiry Month: `12`
- Expiry Year: `2026`
- CVV: `123`

**Expected Result**:
- All fields accept input without validation errors

---

### Step 12 — Place the order
**Action**: Click the "Place Order" button
**Expected Result**:
- Button enters a loading/waiting state (briefly)
- No validation errors appear

---

### Step 13 — Verify order success
**Expected Result**:
- URL changes to `/checkout/success`
- A success message is displayed (e.g., "Your order has been received.")
- Cart badge in the header is cleared / shows 0

---

### Step 14 — Verify cart is empty after order
**Action**: Navigate to `/cart`
**Expected Result**:
- Cart page shows an empty cart message
- No items from the completed order remain in the cart
