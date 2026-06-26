# TC_CART — Shopping Cart

**Route**: `/cart`
**Component**: `shop-cart.js`, `shop-cart-data.js`, `shop-cart-item.js`

---

## CART_001
**Title**: Empty cart displays appropriate message
**Priority**: P1
**Preconditions**: Clean state (localStorage cleared), navigate to `/cart`

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate directly to `/cart` | Cart page loads |
| 2 | Observe page content | An "empty cart" or "no items" message is displayed |
| 3 | Verify checkout button | "Checkout" button is not present or is disabled |

---

## CART_002
**Title**: Added product appears in cart with correct details
**Priority**: P0
**Preconditions**: Clean state

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a product detail page | Detail page loads |
| 2 | Select size "L" and quantity "2" | Selections are set |
| 3 | Click "Add to Cart" | Cart modal appears |
| 4 | Navigate to `/cart` | Cart page loads |
| 5 | Observe the cart item row | Product name, size "L", quantity "2", and price are displayed |

---

## CART_003
**Title**: Cart total is calculated correctly
**Priority**: P0
**Preconditions**: One or more items in the cart

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Add a product (e.g., $24.99) with quantity 2 to cart | Product added |
| 2 | Navigate to `/cart` | Cart page loads |
| 3 | Observe the total | Total shows `$49.98` (price × quantity) |
| 4 | Add another different product (e.g., $15.00, qty 1) | Second item added |
| 5 | Observe updated total | Total updates to `$64.98` |

---

## CART_004
**Title**: Cart item quantity can be updated
**Priority**: P1
**Preconditions**: Cart has at least one item

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/cart` | Cart page loads |
| 2 | Change quantity of an item from 1 to 3 using the quantity selector | Selector updates to "3" |
| 3 | Observe the row total and cart total | Both recalculate based on quantity 3 |

---

## CART_005
**Title**: Cart item quantity can be set to the maximum of 12
**Priority**: P2
**Preconditions**: Cart has at least one item

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/cart` | Cart page loads |
| 2 | Open quantity dropdown for an item | Options 1–12 are available |
| 3 | Select quantity "12" | Quantity updates to 12; total recalculates |

---

## CART_006
**Title**: Removing a cart item deletes it from the cart
**Priority**: P0
**Preconditions**: Cart has at least one item

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/cart` | Cart page with items is displayed |
| 2 | Click the delete/remove icon for an item | The item row is removed from the cart |
| 3 | Observe cart total | Total recalculates (reduces by removed item's value) |

---

## CART_007
**Title**: Removing the last item shows empty cart message
**Priority**: P1
**Preconditions**: Cart has exactly one item

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/cart` | Single item is shown |
| 2 | Delete the item | Item row disappears |
| 3 | Observe page | Empty cart message is shown |

---

## CART_008
**Title**: Cart header badge shows correct total item count
**Priority**: P1
**Preconditions**: Clean state

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Add product A (qty 2) to cart | Cart badge shows "2" |
| 2 | Add product B (qty 3) to cart | Cart badge shows "5" |
| 3 | Remove product A from cart | Cart badge shows "3" |

---

## CART_009
**Title**: Cart persists across page navigation
**Priority**: P1
**Preconditions**: At least one item in cart

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Add an item to cart and note cart contents | Item is in cart |
| 2 | Navigate to home page | Home page loads |
| 3 | Navigate back to `/cart` | Same item is still in cart |

---

## CART_010
**Title**: Cart persists after browser page reload
**Priority**: P1
**Preconditions**: At least one item in cart

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Add an item to cart | Item confirmed in cart |
| 2 | Reload the page (F5 / Cmd+R) | Page reloads |
| 3 | Navigate to `/cart` | Cart still contains the previously added item |

---

## CART_011
**Title**: Multiple items with different sizes are shown as separate rows
**Priority**: P1
**Preconditions**: Clean state

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Add Product A in size "S" (qty 1) | Added to cart |
| 2 | Return to Product A detail page, select size "L" (qty 1), add to cart | Added as separate entry |
| 3 | Navigate to `/cart` | Two separate rows for Product A — one size S, one size L |

---

## CART_012
**Title**: "Checkout" button on cart page navigates to checkout
**Priority**: P0
**Preconditions**: Cart has at least one item

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/cart` | Cart with items is displayed |
| 2 | Click the "Checkout" button | URL changes to `/checkout` |
| 3 | Observe page | Checkout form is displayed |
