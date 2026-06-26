# TC_NAVIGATION — Routing, Navigation & URL Handling

**Component**: `shop-app.js` (router), app-route

---

## NAV_001
**Title**: Direct URL navigation to home route loads home page
**Priority**: P0
**Preconditions**: None

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open browser and navigate to `https://shop.polymer-project.org/` | Home page with 4 category tiles loads |
| 2 | Navigate to `https://shop.polymer-project.org/home` | Same home page loads |

---

## NAV_002
**Title**: Direct URL navigation to category list loads correct list
**Priority**: P1
**Preconditions**: None

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate directly to `/list/mens_tshirts` | Men's T-Shirts product list is displayed |
| 2 | Navigate directly to `/list/ladies_outerwear` | Ladies Outerwear product list is displayed |

---

## NAV_003
**Title**: Direct URL navigation to a product detail page loads correctly
**Priority**: P1
**Preconditions**: A known valid product URL (obtainable from browsing)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate directly to a valid `/detail/<category>/<item>` URL | Product detail page loads with correct product data |

---

## NAV_004
**Title**: Navigating to an invalid/unknown route shows 404 page
**Priority**: P1
**Preconditions**: None

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `https://shop.polymer-project.org/invalid-page` | 404 warning page is displayed |
| 2 | Observe page content | A user-friendly "not found" message is shown |
| 3 | Observe navigation | Header and navigation are still functional |

---

## NAV_005
**Title**: Browser back button works correctly across page transitions
**Priority**: P1
**Preconditions**: None

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate from Home → category list → product detail | Each page loads in sequence |
| 2 | Click browser back button | Returns to product list page |
| 3 | Click browser back button again | Returns to home page |

---

## NAV_006
**Title**: Browser forward button works after using back button
**Priority**: P2
**Preconditions**: User has navigated back (NAV_005)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | After navigating back to home, click browser forward | Returns to the product list page |
| 2 | Click forward again | Returns to product detail page |

---

## NAV_007
**Title**: Cart icon in header navigates to cart page
**Priority**: P1
**Preconditions**: User is on any page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the cart icon in the header from the home page | URL changes to `/cart` |
| 2 | Click the cart icon from a product list page | URL changes to `/cart` |
| 3 | Click the cart icon from a product detail page | URL changes to `/cart` |

---

## NAV_008
**Title**: URL updates correctly when navigating between categories
**Priority**: P1
**Preconditions**: User is on a category list page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/list/mens_tshirts` | URL shows `/list/mens_tshirts` |
| 2 | Click "Ladies Outerwear" tab or menu item | URL changes to `/list/ladies_outerwear` |
| 3 | Verify page | Ladies Outerwear products are shown |

---

## NAV_009
**Title**: Page title updates to reflect current page
**Priority**: P2
**Preconditions**: None

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to home page | Browser tab title reflects the home/app name |
| 2 | Navigate to a category list page | Browser tab title updates to include the category name |
| 3 | Navigate to a product detail page | Browser tab title updates to include the product name |

---

## NAV_010
**Title**: Navigating to `/checkout` from cart with items shows checkout form
**Priority**: P0
**Preconditions**: Cart has at least one item

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/cart` | Cart with items is shown |
| 2 | Click "Checkout" button | URL changes to `/checkout` |
| 3 | Observe page | Checkout form is fully rendered |
