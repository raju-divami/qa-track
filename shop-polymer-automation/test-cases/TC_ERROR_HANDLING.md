# TC_ERROR_HANDLING — Error Pages, Network & Offline Handling

**Components**: `shop-404-warning.js`, `shop-network-warning.js`

---

## ERR_001
**Title**: 404 page is shown for an unknown route
**Priority**: P1
**Preconditions**: Application is running

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `https://shop.polymer-project.org/this-does-not-exist` | Application loads |
| 2 | Observe page | A 404 warning/error page is displayed |
| 3 | Observe the message | User-friendly "page not found" message is visible |

---

## ERR_002
**Title**: 404 page still shows a working header and navigation
**Priority**: P2
**Preconditions**: User is on the 404 page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to an invalid URL | 404 page loads |
| 2 | Observe the header | "SHOP" logo/header is still rendered and functional |
| 3 | Click the logo | User is redirected to the home page |

---

## ERR_003
**Title**: Network warning is shown when connection drops (offline mode)
**Priority**: P2
**Preconditions**: Application is loaded; user can simulate going offline (DevTools → Network → Offline)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Set browser to offline mode | Network is disabled |
| 2 | Try to navigate to a category list page | Network warning component appears indicating no connection |
| 3 | Restore network | Warning disappears; page retries or user can reload |

---

## ERR_004
**Title**: Product data retry on network error (up to 3 attempts)
**Priority**: P3
**Preconditions**: Application is loaded; network is unreliable (can be simulated)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to a category list page with an intermittent/slow network | Page attempts to load data |
| 2 | Observe behaviour on temporary failure | Application retries loading (up to 3 attempts) |
| 3 | Once network recovers | Data loads successfully |

---

## ERR_005
**Title**: Checkout success page (`/checkout/success`) displays success message
**Priority**: P0
**Preconditions**: Order placed successfully (CHK_009 completed)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | After order is placed, observe the page | URL is `/checkout/success` |
| 2 | Observe page content | A success/confirmation message (e.g., "Your order has been received.") is displayed |

---

## ERR_006
**Title**: Checkout error page (`/checkout/error`) displays error message
**Priority**: P1
**Preconditions**: Order submission returns an error response

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | After a failed order submission, observe the page | URL is `/checkout/error` |
| 2 | Observe page content | An error message (e.g., "Transaction failed.") is displayed |

---

## ERR_007
**Title**: Navigating directly to `/checkout/success` or `/checkout/error` without placing an order
**Priority**: P2
**Preconditions**: Clean state (no recent order placed)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate directly to `/checkout/success` | Page loads |
| 2 | Observe behaviour | Either shows the success message state or redirects appropriately (does not crash) |
| 3 | Navigate directly to `/checkout/error` | Page loads without crashing |
