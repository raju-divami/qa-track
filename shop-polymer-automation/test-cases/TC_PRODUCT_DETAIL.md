# TC_PRODUCT_DETAIL — Product Detail Page

**Route**: `/detail/:category/:item`
**Component**: `shop-detail.js`

---

## DETAIL_001
**Title**: Product detail page loads with correct product information
**Priority**: P0
**Preconditions**: User clicked a product from the list page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click any product from a category list | Detail page loads |
| 2 | Verify URL | URL follows pattern `/detail/<category>/<product-name>` |
| 3 | Observe page | Product title, price, description, and large image are all visible |

---

## DETAIL_002
**Title**: Product large image is displayed
**Priority**: P1
**Preconditions**: Product detail page is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Observe the main product image | A large, high-quality image is displayed |
| 2 | Verify image state | Image is fully loaded with no broken icon |

---

## DETAIL_003
**Title**: Price is displayed in correct format
**Priority**: P1
**Preconditions**: Product detail page is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Locate the price on the detail page | Price is visible |
| 2 | Verify format | Price matches `$XX.XX` format (e.g., `$24.99`) |

---

## DETAIL_004
**Title**: Size selector defaults to "M" and contains all five options
**Priority**: P1
**Preconditions**: Product detail page is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Locate the size selector | Size selector is visible |
| 2 | Verify default selection | "M" is selected by default |
| 3 | Open the size dropdown | Options XS, S, M, L, XL are all available |

---

## DETAIL_005
**Title**: User can change the product size
**Priority**: P1
**Preconditions**: Product detail page is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the size dropdown | Size options appear |
| 2 | Select "XL" | "XL" becomes the selected size |
| 3 | Verify selection | Size selector shows "XL" |

---

## DETAIL_006
**Title**: Quantity selector defaults to 1 and contains options 1–5
**Priority**: P1
**Preconditions**: Product detail page is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Locate the quantity selector | Quantity selector is visible |
| 2 | Verify default | Quantity shows "1" by default |
| 3 | Open quantity dropdown | Options 1, 2, 3, 4, 5 are all available |

---

## DETAIL_007
**Title**: User can change the product quantity
**Priority**: P1
**Preconditions**: Product detail page is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open the quantity dropdown | Options appear |
| 2 | Select "3" | Quantity selector shows "3" |

---

## DETAIL_008
**Title**: "Add to Cart" button adds product to cart
**Priority**: P0
**Preconditions**: Clean state; product detail page is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Select size "S" | Size is updated |
| 2 | Select quantity "2" | Quantity is updated |
| 3 | Click "Add to Cart" button | Cart modal appears with "Added to cart" message |
| 4 | Observe cart icon badge | Badge increments to reflect the added quantity (2) |

---

## DETAIL_009
**Title**: Adding the same item and size again increments cart quantity
**Priority**: P1
**Preconditions**: Product already added to cart (size M, qty 1)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | On the same product detail page, ensure size "M" and qty "1" selected | Selections are set |
| 2 | Click "Add to Cart" | Cart modal appears |
| 3 | Navigate to cart (`/cart`) | Item appears once with combined quantity of 2, not as two separate rows |

---

## DETAIL_010
**Title**: Back button on detail page returns to the product list
**Priority**: P1
**Preconditions**: User navigated from product list to detail page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the back/left arrow button in the header | URL changes back to the product list page |
| 2 | Observe page content | The correct category product list is displayed |
