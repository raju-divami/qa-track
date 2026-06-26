# TC_PRODUCT_LIST — Product Listing Page

**Route**: `/list/:category`
**Component**: `shop-list.js`
**Categories**: `mens_outerwear`, `ladies_outerwear`, `mens_tshirts`, `ladies_tshirts`

---

## LIST_001
**Title**: Product list page loads for a valid category
**Priority**: P0
**Preconditions**: Home page loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Men's T-Shirts" category | URL becomes `/list/mens_tshirts` |
| 2 | Observe the page | Category title "Men's T-Shirts" is shown |
| 3 | Observe product grid | Products are displayed in a grid layout |

---

## LIST_002
**Title**: Product cards display name, image, and price
**Priority**: P0
**Preconditions**: Product list page for any category is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Observe the first product card | Product thumbnail image is displayed |
| 2 | Observe the product card | Product title/name is visible |
| 3 | Observe the product card | Price is shown in `$XX.XX` format |

---

## LIST_003
**Title**: All four category list pages load successfully
**Priority**: P1
**Preconditions**: Application loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/list/mens_outerwear` | Men's Outerwear products displayed |
| 2 | Navigate to `/list/ladies_outerwear` | Ladies Outerwear products displayed |
| 3 | Navigate to `/list/mens_tshirts` | Men's T-Shirts products displayed |
| 4 | Navigate to `/list/ladies_tshirts` | Ladies T-Shirts products displayed |

---

## LIST_004
**Title**: Clicking a product card navigates to product detail
**Priority**: P0
**Preconditions**: Product list page is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the first product card | URL changes to `/detail/<category>/<product-name>` |
| 2 | Observe the page | Product detail page for the clicked product loads |

---

## LIST_005
**Title**: Product list is rendered in a grid layout on desktop
**Priority**: P2
**Preconditions**: Product list page loaded in desktop viewport (> 767px)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Observe the product grid | Products appear in a multi-column grid (3 columns) |
| 2 | Verify layout | No horizontal overflow; images are proportionally sized |

---

## LIST_006
**Title**: Product list renders in two-column layout on mobile
**Priority**: P2
**Preconditions**: Product list page loaded in mobile viewport (≤ 767px)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Observe the product grid | Products display in a 2-column layout |
| 2 | Verify layout | Cards are fully visible; no overlap |

---

## LIST_007
**Title**: Product images load without broken icons
**Priority**: P1
**Preconditions**: Product list page loaded with network available

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Wait for the page to fully load | All product thumbnail images render without broken icons |
| 2 | Verify placeholder behaviour | While loading, a placeholder is shown (not a broken image) |

---

## LIST_008
**Title**: Category tab for current category is highlighted
**Priority**: P2
**Preconditions**: Product list page loaded on desktop viewport

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/list/mens_tshirts` | "Men's T-Shirts" tab is visually highlighted/active |
| 2 | Navigate to `/list/ladies_outerwear` | "Ladies Outerwear" tab becomes highlighted |

---

## LIST_009
**Title**: Back button from product list returns to home
**Priority**: P2
**Preconditions**: User navigated from home to a product list page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click browser back button | User returns to the home page |
| 2 | Observe URL | URL is `/` or `/home` |
