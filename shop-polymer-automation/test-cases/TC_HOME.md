# TC_HOME — Home Page & Category Navigation

**Route**: `/` or `/home`
**Component**: `shop-home.js`

---

## HOME_001
**Title**: Home page loads successfully
**Priority**: P0
**Preconditions**: Clean state, browser navigated to base URL

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `https://shop.polymer-project.org/` | Page loads without errors |
| 2 | Observe page header | Header displays "SHOP" logo/title |
| 3 | Observe page body | Four category tiles are visible |
| 4 | Observe page footer | Footer is rendered |

---

## HOME_002
**Title**: All four product categories are displayed
**Priority**: P0
**Preconditions**: Home page is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Count category tiles on home page | Exactly 4 tiles are shown |
| 2 | Read tile labels | "Men's Outerwear", "Ladies Outerwear", "Men's T-Shirts", "Ladies T-Shirts" are all present |

---

## HOME_003
**Title**: Each category tile has a hero image
**Priority**: P1
**Preconditions**: Home page is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Inspect each category tile | Each tile displays a hero/background image |
| 2 | Wait for images to fully load | No broken image icons; images render correctly |

---

## HOME_004
**Title**: Clicking a category tile navigates to the product list
**Priority**: P0
**Preconditions**: Home page is loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click the "Men's Outerwear" category tile | URL changes to `/list/mens_outerwear` |
| 2 | Observe page content | Product list for Men's Outerwear is displayed |
| 3 | Navigate back to home | Home page loads again |
| 4 | Repeat for each of the remaining 3 categories | Correct list page loads for each category |

---

## HOME_005
**Title**: Category navigation tabs are visible on desktop
**Priority**: P1
**Preconditions**: Home page loaded in desktop viewport (width > 767px)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Observe the header/nav area | Category tabs are visible with all 4 category names |
| 2 | Click a category tab | Navigates to the correct product list page |

---

## HOME_006
**Title**: Category navigation uses hamburger drawer on mobile
**Priority**: P1
**Preconditions**: Home page loaded in mobile viewport (width ≤ 767px)

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Observe the header | Hamburger menu button is visible; category tabs are hidden |
| 2 | Click the hamburger button | Side drawer opens with all 4 categories listed |
| 3 | Click a category in the drawer | Drawer closes; correct product list page loads |

---

## HOME_007
**Title**: Cart icon is visible and shows zero count on clean state
**Priority**: P1
**Preconditions**: Clean state (empty cart), home page loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Observe the cart icon in the header | Cart icon is visible |
| 2 | Check the cart badge | Badge is not shown or shows "0" |

---

## HOME_008
**Title**: Logo click navigates back to home from any page
**Priority**: P1
**Preconditions**: User has navigated to a product list page

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to `/list/mens_tshirts` | Product list is displayed |
| 2 | Click the "SHOP" logo in the header | URL changes back to `/home` or `/` |
| 3 | Observe page | Home page with category tiles is displayed |
