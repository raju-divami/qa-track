# End-to-End Flow Test Cases

These flows test complete user journeys across multiple pages and components.
Each flow represents a realistic scenario a real user would perform.

---

## Flow Index

| File | Flow | Priority |
|------|------|----------|
| [FLOW_001_SINGLE_PRODUCT_CHECKOUT.md](FLOW_001_SINGLE_PRODUCT_CHECKOUT.md) | Browse → Add one product → Checkout → Success | P0 |
| [FLOW_002_MULTI_PRODUCT_CHECKOUT.md](FLOW_002_MULTI_PRODUCT_CHECKOUT.md) | Add products from multiple categories → Checkout | P0 |
| [FLOW_003_CART_MANAGEMENT_THEN_CHECKOUT.md](FLOW_003_CART_MANAGEMENT_THEN_CHECKOUT.md) | Add items → Update quantities → Remove item → Checkout | P1 |
| [FLOW_004_DIFFERENT_BILLING_ADDRESS.md](FLOW_004_DIFFERENT_BILLING_ADDRESS.md) | Checkout using a separate billing address | P1 |
| [FLOW_005_FAILED_CHECKOUT.md](FLOW_005_FAILED_CHECKOUT.md) | Checkout with invalid card → Error page → Retry | P1 |
| [FLOW_006_CART_PERSISTENCE.md](FLOW_006_CART_PERSISTENCE.md) | Add to cart → Navigate away → Return → Checkout | P1 |
| [FLOW_007_SAME_PRODUCT_DIFFERENT_SIZES.md](FLOW_007_SAME_PRODUCT_DIFFERENT_SIZES.md) | Add same product in multiple sizes → Checkout | P2 |
| [FLOW_008_CHECKOUT_VALIDATION_CORRECTION.md](FLOW_008_CHECKOUT_VALIDATION_CORRECTION.md) | Submit invalid form → Fix errors → Checkout succeeds | P1 |

---

## Flow ID Convention

```
FLOW_<NNN>_<SHORT_NAME>
```

## Notation in Steps

- **Action** — what the user does
- **Expected Result** — what the app must show/do
- `[Data]` inline — test data used in that step
