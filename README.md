# QA Learning Track

A structured, hands-on learning track covering the core disciplines of software quality assurance — from reading a PRD and writing test cases, through API testing, to building a production-grade browser automation framework.

Each folder is a self-contained assignment that builds on the previous one.

---

## Learning Path

```
Manual QA foundations  →  API testing  →  Browser automation
```

| Module | Assignment | Skills |
|---|---|---|
| 1 | Vendor Invoice Management Portal | Requirements analysis, test planning, manual test cases |
| 2 | Petstore API Testing | REST API testing, Postman, collection design |
| 3 | Shop Polymer Automation | Playwright, TypeScript, POM, E2E automation |

---

## Module 1 — Manual QA

**Assignment:** Read a PRD for a vendor invoice management portal, clarify requirements, write a test plan, and produce structured test cases with edge-case coverage.

**Skills practised:**
- Analysing product requirements documents
- Writing requirements-clarification questions
- Structuring a test plan (scope, approach, entry/exit criteria)
- Authoring manual test cases (preconditions, steps, expected results)

| File | Contents |
|---|---|
| `PRD.md` | Product requirements document |
| `requirements-clarification-document.md` | Clarified requirements and edge cases |
| `QA-Document.md` | Test plan and full test case suite |

---

## Module 2 — API Testing

**Assignment:** Test the public [Petstore REST API](https://petstore.swagger.io/) using Postman. Design a collection that covers happy paths, negative cases, and environment configuration.

**Skills practised:**
- Reading OpenAPI / Swagger specifications
- Structuring Postman collections and environments
- Writing pre-request scripts and test assertions
- Generating and reading execution reports

| File | Contents |
|---|---|
| `petstore-api_collection.json` | Postman collection (all requests + assertions) |
| `petstore_environment.json` | Environment variables (base URL, tokens) |
| `report.html` | Latest test execution report |

---

## Module 3 — Browser Automation

**Assignment:** Build a full Playwright + TypeScript E2E automation framework for the [Shop Polymer PWA](https://shop.polymer-project.org/) from scratch — page objects, reusable components, classified test suites, and end-to-end flow coverage.

**Skills practised:**
- TypeScript and strict-mode configuration
- Page Object Model (Elements → Components → Pages)
- Shadow DOM interaction with Playwright locators
- Test data management (JSON, no hardcoded values in specs)
- Test classification and tagging (`@sanity`, `@regression`, `@e2e`, `@mobile`)
- End-to-end flow design and cart/checkout coverage
- Form validation testing
- localStorage-based state management in tests

### Framework Structure

```
shop-polymer-automation/
├── elements/          # Atomic wrappers (ButtonElement, InputElement, …)
├── components/        # Composite UI blocks (HeaderComponent, CartItemComponent, …)
├── pages/             # Page objects (HomePage, CheckoutPage, …)
├── tests/             # Feature specs
│   └── flows/         # End-to-end user journey specs
├── test-data/         # JSON test data — no hardcoded values in specs
└── utils/             # Storage, route, wait, and price helpers
```

### Setup

```bash
cd shop-polymer-automation
npm install
npx playwright install
cp .env.example .env   # edit BASE_URL if needed
```

### Running Tests

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

### Test Classification

| Tag | Count | When to run |
|---|---|---|
| `@sanity` | ~15 | After every deployment |
| `@regression` | ~75 | Before every release |
| `@e2e` | 8 | On staging / pre-production |
| `@mobile` | 2 | Alongside regression |

### Test Coverage

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
