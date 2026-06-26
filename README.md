# qa-track

A collection of QA practice projects covering API testing, manual test documentation, and end-to-end browser automation.

---

## Repository Structure

```
qa-track/
├── petstore/                       # REST API testing (Postman)
├── vendor-invoice-management-portal/  # Manual QA documentation
└── shop-polymer-automation/        # Playwright + TypeScript E2E framework
```

---

## Projects

### 1. Petstore — API Testing
Postman collection and environment for the [Petstore API](https://petstore.swagger.io/).

| File | Purpose |
|---|---|
| `petstore-api_collection.json` | Postman collection with all API requests |
| `petstore_environment.json` | Environment variables (base URL, tokens) |
| `report.html` | Latest test execution report |

---

### 2. Vendor Invoice Management Portal — Manual QA
Manual test documentation for a vendor invoice portal.

| File | Purpose |
|---|---|
| `PRD.md` | Product requirements document |
| `QA-Document.md` | Test plan, test cases, and coverage |
| `requirements-clarification-document.md` | Clarified requirements with edge cases |

---

### 3. Shop Polymer Automation — Playwright E2E Framework

Full browser automation suite for the [Shop Polymer PWA](https://shop.polymer-project.org/) built with Playwright and TypeScript.

#### Stack
- **Test runner:** Playwright Test v1.61
- **Language:** TypeScript (strict mode)
- **Pattern:** Page Object Model — Elements → Components → Pages
- **Browsers:** Chromium, Firefox, WebKit

#### Project Layout

```
shop-polymer-automation/
├── elements/          # Atomic wrappers (ButtonElement, InputElement, …)
├── components/        # Composite UI blocks (HeaderComponent, CartItemComponent, …)
├── pages/             # Page objects (HomePage, CheckoutPage, …)
├── tests/             # Feature specs + flows/
├── test-data/         # JSON test data (no hardcoded values in specs)
└── utils/             # Storage, route, wait, price helpers
```

#### Setup

```bash
cd shop-polymer-automation
npm install
npx playwright install
cp .env.example .env   # edit BASE_URL if needed
```

#### Running Tests

| Command | Scope |
|---|---|
| `npm test` | All tests — all browsers |
| `npm run test:sanity` | `@sanity` — post-deploy smoke check |
| `npm run test:regression` | `@regression` — full pre-release suite |
| `npm run test:e2e` | `@e2e` — end-to-end user flows |
| `npm run test:mobile` | `@mobile` — mobile viewport variants |
| `npm run test:flows` | All 8 flow specs only |
| `npm run test:chromium` | Chromium only |
| `npm run test:headed` | Headed mode (visible browser) |
| `npm run test:ui` | Playwright interactive UI |
| `npm run test:report` | Open the last HTML report |
| `npm run typecheck` | TypeScript compile check |

#### Test Classification

| Tag | Count | When to run |
|---|---|---|
| `@sanity` | ~15 | After every deployment |
| `@regression` | ~75 | Before every release |
| `@e2e` | 8 | On staging / pre-production |
| `@mobile` | 2 | Alongside regression |

#### Test Coverage

| Spec | Tests | Area |
|---|---|---|
| `home.spec.ts` | 8 | Home page, category tiles, mobile drawer |
| `product-list.spec.ts` | 9 | Category list, product cards, grid |
| `product-detail.spec.ts` | 14 | Product info, size/qty pickers, Add to Cart |
| `cart.spec.ts` | 9 | Cart CRUD, totals, persistence |
| `cart-modal.spec.ts` | 6 | Post-add modal, navigation shortcuts |
| `checkout.spec.ts` | 12 | Form sections, billing toggle, order flow |
| `checkout-validation.spec.ts` | 12 | Per-field validation rules |
| `navigation.spec.ts` | 10 | Routing, back/forward, direct URLs |
| `error-handling.spec.ts` | 10 | 404 page, success/error states |
| `flows/` | 8 | Full end-to-end purchase journeys |

---

## License

ISC
