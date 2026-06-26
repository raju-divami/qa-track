# Test Cases — Shop Polymer

**Application Under Test**: [https://shop.polymer-project.org/](https://shop.polymer-project.org/)
**Framework**: Polymer 3 PWA — E-commerce Demo

---

## Module Index

| File | Module | # Test Cases |
|------|--------|-------------|
| [TC_HOME.md](TC_HOME.md) | Home Page & Category Navigation | 8 |
| [TC_PRODUCT_LIST.md](TC_PRODUCT_LIST.md) | Product Listing Page | 9 |
| [TC_PRODUCT_DETAIL.md](TC_PRODUCT_DETAIL.md) | Product Detail Page | 10 |
| [TC_CART.md](TC_CART.md) | Shopping Cart | 12 |
| [TC_CART_MODAL.md](TC_CART_MODAL.md) | Cart Modal / Add-to-Cart Notification | 6 |
| [TC_CHECKOUT.md](TC_CHECKOUT.md) | Checkout Form & Order Placement | 14 |
| [TC_CHECKOUT_VALIDATION.md](TC_CHECKOUT_VALIDATION.md) | Checkout Form Validation | 16 |
| [TC_NAVIGATION.md](TC_NAVIGATION.md) | Routing, Navigation & URL Handling | 10 |
| [TC_ERROR_HANDLING.md](TC_ERROR_HANDLING.md) | Error Pages, Network & Offline Handling | 7 |

**Total**: 92 module test cases

---

## End-to-End Flow Test Cases

Stored in [flows/](flows/README.md) — full user journey scenarios spanning multiple pages.

| Flow | Description | Priority |
|------|-------------|----------|
| [FLOW_001](flows/FLOW_001_SINGLE_PRODUCT_CHECKOUT.md) | Browse → Add one product → Checkout → Success | P0 |
| [FLOW_002](flows/FLOW_002_MULTI_PRODUCT_CHECKOUT.md) | Add products from multiple categories → Checkout | P0 |
| [FLOW_003](flows/FLOW_003_CART_MANAGEMENT_THEN_CHECKOUT.md) | Add → update quantity → remove item → Checkout | P1 |
| [FLOW_004](flows/FLOW_004_DIFFERENT_BILLING_ADDRESS.md) | Checkout with a separate billing address | P1 |
| [FLOW_005](flows/FLOW_005_FAILED_CHECKOUT.md) | Transaction failure → error page → retry | P1 |
| [FLOW_006](flows/FLOW_006_CART_PERSISTENCE.md) | Add to cart → navigate away → reload → Checkout | P1 |
| [FLOW_007](flows/FLOW_007_SAME_PRODUCT_DIFFERENT_SIZES.md) | Same product in 3 sizes → Checkout | P2 |
| [FLOW_008](flows/FLOW_008_CHECKOUT_VALIDATION_CORRECTION.md) | Submit invalid form → fix errors → Checkout succeeds | P1 |

---

## Priority Legend

| Priority | Meaning |
|----------|---------|
| P0 | Smoke — must pass before any other testing |
| P1 | Critical — core user journeys |
| P2 | Important — edge cases and secondary flows |
| P3 | Low — cosmetic, accessibility, minor UX |

---

## Test Case ID Convention

```
<MODULE>_<NNN>
```

Examples: `HOME_001`, `CART_007`, `CHK_VALID_012`

---

## Precondition Glossary

| Term | Meaning |
|------|---------|
| Clean state | Browser localStorage cleared, no items in cart |
| Populated cart | At least one item added to cart |
| Checkout page | User is on `/checkout` with a non-empty cart |
