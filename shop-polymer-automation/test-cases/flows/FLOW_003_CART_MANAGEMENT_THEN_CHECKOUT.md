# FLOW_003 — Add Items, Update Quantities, Remove an Item, then Checkout

**Priority**: P1
**Objective**: Verify that cart management actions (update quantity, remove item) work correctly and the final adjusted cart can be checked out successfully.

---

## Test Data

| Field | Value |
|-------|-------|
| Product A | First product in Men's Outerwear, Size M, Qty 1 |
| Product B | First product in Men's T-Shirts, Size S, Qty 1 |
| Updated Qty for Product A | 3 |
| Product to remove | Product B |
| Email | `cartmanager@example.com` |
| Phone | `7005556789` |
| Ship Address | `22 Pine Road` |
| Ship City | `Denver` |
| Ship State | `CO` |
| Ship Zip | `80201` |
| Ship Country | `US` |
| Card Name | `Cart Manager` |
| Card Number | `4111111111111111` |
| Expiry Month | `03` |
| Expiry Year | `2025` |
| CVV | `321` |

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

### Step 2 — Add Product A (Men's Outerwear)
**Action**: Go to "Men's Outerwear" list → click first product → select size "M", qty "1" → click "Add to Cart"
**Expected Result**:
- Cart modal confirms Product A was added
- Cart badge shows "1"

---

### Step 3 — Add Product B (Men's T-Shirts)
**Action**: Close modal → go to "Men's T-Shirts" list → click first product → select size "S", qty "1" → click "Add to Cart"
**Expected Result**:
- Cart modal confirms Product B was added
- Cart badge shows "2"

---

### Step 4 — Navigate to cart
**Action**: Navigate to `/cart`
**Expected Result**:
- Cart shows two rows: Product A (size M, qty 1) and Product B (size S, qty 1)
- Total = price of A + price of B

---

### Step 5 — Update quantity of Product A to 3
**Action**: In Product A's row, change the quantity selector from "1" to "3"
**Expected Result**:
- Product A row shows qty "3"
- Cart total recalculates: total = (price of A × 3) + price of B

---

### Step 6 — Remove Product B
**Action**: Click the remove/delete icon on Product B's row
**Expected Result**:
- Product B row disappears from the cart
- Cart total recalculates: total = price of A × 3
- Cart badge updates from "4" to "3"

---

### Step 7 — Verify final cart state
**Expected Result**:
- Only Product A remains in the cart
- Size shown: M
- Quantity shown: 3
- Total is correct (price of A × 3)

---

### Step 8 — Proceed to checkout
**Action**: Click "Checkout"
**Expected Result**:
- URL changes to `/checkout`
- Order Summary shows only Product A with size M, qty 3, and correct total

---

### Step 9 — Fill in all required checkout fields
**Action**: Complete all form sections using the test data above
**Expected Result**:
- All fields accept the input without validation errors

---

### Step 10 — Place the order
**Action**: Click "Place Order"
**Expected Result**: Loading state appears briefly

---

### Step 11 — Verify success
**Expected Result**:
- URL becomes `/checkout/success`
- Success message is displayed
- Cart is emptied (badge cleared)
