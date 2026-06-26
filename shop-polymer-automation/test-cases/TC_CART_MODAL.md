# TC_CART_MODAL — Cart Modal / Add-to-Cart Notification

**Component**: `shop-cart-modal.js`
**Trigger**: Clicking "Add to Cart" on a product detail page

---

## MODAL_001
**Title**: Cart modal appears after clicking "Add to Cart"
**Priority**: P0
**Preconditions**: Product detail page is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Add to Cart" button | A modal/overlay appears |
| 2 | Observe modal content | "Added to cart" (or similar confirmation) message is displayed |

---

## MODAL_002
**Title**: Cart modal contains "View Cart" and "Checkout" action buttons
**Priority**: P1
**Preconditions**: Cart modal is open

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Observe the modal buttons | "View Cart" (or "Cart") button is present |
| 2 | Observe the modal buttons | "Checkout" button is present |

---

## MODAL_003
**Title**: "View Cart" button in modal navigates to cart page
**Priority**: P1
**Preconditions**: Cart modal is open

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "View Cart" button in the modal | Modal closes |
| 2 | Observe URL and page | URL is `/cart` and cart contents are displayed |

---

## MODAL_004
**Title**: "Checkout" button in modal navigates to checkout page
**Priority**: P1
**Preconditions**: Cart modal is open

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Checkout" button in the modal | Modal closes |
| 2 | Observe URL and page | URL is `/checkout` and the checkout form is displayed |

---

## MODAL_005
**Title**: Cart modal dismisses when user navigates away
**Priority**: P2
**Preconditions**: Cart modal is open

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | With modal open, click the "SHOP" logo to go to home | Navigation occurs |
| 2 | Observe modal state | Modal is no longer visible on the home page |

---

## MODAL_006
**Title**: Cart modal close button dismisses the modal without navigation
**Priority**: P2
**Preconditions**: Cart modal is open

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the close (×) button on the modal | Modal closes |
| 2 | Observe URL | URL has not changed; user remains on the product detail page |
| 3 | Observe cart | Item is still in the cart (was successfully added) |
