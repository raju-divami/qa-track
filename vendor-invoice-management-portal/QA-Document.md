# End-to-End QA Document
## Vendor Invoice Management Portal (VIMP)

**Document Version:** 1.0
**Prepared By:** QA Architecture & Test Management Team
**Date:** 2026-06-10
**Classification:** Internal — Project Execution
**Status:** Active — Baseline for Development

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Requirement Analysis](#2-requirement-analysis)
3. [Assumptions](#3-assumptions)
4. [Test Strategy](#4-test-strategy)
5. [Test Scope](#5-test-scope)
6. [In-Scope Features](#6-in-scope-features)
7. [Out-of-Scope Features](#7-out-of-scope-features)
8. [Test Approach](#8-test-approach)
9. [Test Levels](#9-test-levels)
10. [Test Scenarios](#10-test-scenarios)
11. [Functional Test Cases](#11-functional-test-cases)
12. [Negative Test Cases](#12-negative-test-cases)
13. [Edge Cases](#13-edge-cases)
14. [Security Test Cases](#14-security-test-cases)
15. [Role-Based Access Test Cases](#15-role-based-access-test-cases)
16. [API Test Scenarios](#16-api-test-scenarios)
17. [Workflow Test Scenarios](#17-workflow-test-scenarios)
18. [Data Validation Scenarios](#18-data-validation-scenarios)
19. [Reporting Test Scenarios](#19-reporting-test-scenarios)
20. [Test Data Requirements](#20-test-data-requirements)
21. [Requirement Traceability Matrix (RTM)](#21-requirement-traceability-matrix-rtm)
22. [Defect Management Approach](#22-defect-management-approach)
23. [Automation Candidates](#23-automation-candidates)
24. [Regression Test Suite](#24-regression-test-suite)
25. [Entry and Exit Criteria](#25-entry-and-exit-criteria)
26. [Test Deliverables](#26-test-deliverables)
27. [Risks and Mitigation Plan](#27-risks-and-mitigation-plan)
28. [Release Readiness Checklist](#28-release-readiness-checklist)

---

## 1. Project Overview

### 1.1 Product Summary

The Vendor Invoice Management Portal (VIMP) is a web-based platform that digitises and centralises the end-to-end invoice lifecycle between external vendors and the internal Accounts Payable (AP) team. The system replaces manual, email-based invoice handling with a structured, auditable workflow from submission through to payment forwarding.

### 1.2 Key Stakeholders

| Stakeholder | Role | QA Relevance |
|-------------|------|--------------|
| Product Owner | Requirements authority | UAT sign-off |
| AP Team Lead | Primary internal user | AP workflow UAT |
| Vendor Representatives | External users | Vendor flow UAT |
| Finance Controller | Reporting consumer | Reporting UAT |
| IT / DevOps | Infrastructure owner | Environment provisioning |
| Security Lead | Security gate-keeper | Security test sign-off |
| Legal / Compliance | Regulatory guidance | Compliance validation |

### 1.3 System Boundaries

```
┌─────────────────────────────────────────────────────┐
│              Vendor Invoice Management Portal         │
│                                                       │
│  ┌──────────────┐         ┌──────────────────────┐   │
│  │  Vendor UI   │         │    AP Team UI         │   │
│  └──────┬───────┘         └──────────┬───────────┘   │
│         │                            │                │
│  ┌──────▼────────────────────────────▼───────────┐   │
│  │              Core Application API              │   │
│  └──────┬─────────────────┬──────────────────────┘   │
└─────────┼─────────────────┼──────────────────────────┘
          │                 │
   ┌──────▼──────┐   ┌──────▼──────────────────────┐
   │  Email      │   │  Payment / ERP System        │
   │  Service    │   │  (e.g. SAP, Oracle, NetSuite) │
   └─────────────┘   └─────────────────────────────┘
          │
   ┌──────▼──────┐   ┌──────────────────────────────┐
   │  File       │   │  PO Data Source              │
   │  Storage    │   │  (ERP / Internal DB)          │
   └─────────────┘   └──────────────────────────────┘
```

### 1.4 Invoice Lifecycle State Machine

```
[Draft] ──► [Submitted] ──► [Under Review] ──► [Approved] ──► [Forwarded] ──► [Paid]
                                     │
                                     └──► [Rejected] ──► [Resubmitted] ──► [Under Review]
```

---

## 2. Requirement Analysis

Seven requirements were provided in the PRD. Each is analysed below for testing implications, complexity, and associated risk.

| REQ-ID | Requirement Statement | Test Complexity | Risk Level | Key Testing Concern |
|--------|----------------------|-----------------|------------|---------------------|
| REQ-01 | Vendors can register and log in to the portal | Medium | High | Auth security, duplicate accounts, session management |
| REQ-02 | Vendors can submit invoices against purchase orders | High | Critical | PO validation, duplicate detection, file upload security, concurrency |
| REQ-03 | The AP team can view, approve, or reject invoices | High | High | Concurrent approvals, RBAC enforcement, audit trail |
| REQ-04 | Approved invoices are forwarded for payment processing | High | Critical | Integration reliability, idempotency, failure handling |
| REQ-05 | Both parties receive email notifications on status changes | Medium | Medium | Notification matrix, recipient accuracy, delivery failure handling |
| REQ-06 | The system generates monthly invoice activity reports | Medium | High | Data accuracy, timezone handling, access control, scale |
| REQ-07 | Only authorized users may access the system | High | Critical | RBAC, IDOR, session token security, server-side enforcement |

### 2.1 Requirements with Critical Testing Gaps

The following requirements contain ambiguities that introduce testing risk:

- **REQ-02**: Source and validation of PO data is undefined — PO validation cannot be tested without a defined data source.
- **REQ-04**: "Forwarded" mechanism is unspecified — integration tests cannot be designed without knowing the target system and API contract.
- **REQ-03**: Approval workflow tiers (single vs. multi-level) are not defined — workflow test scenarios may need to be redesigned after clarification.
- **REQ-07**: Role permission matrix is not defined — RBAC test matrix is based on assumed roles pending client confirmation.

---

## 3. Assumptions

The following assumptions underpin all test planning in this document. Each must be validated with the client before execution.

| # | Assumption | Impact if Wrong |
|---|-----------|-----------------|
| A-01 | The portal is a web application; no native mobile app is in scope | Mobile testing will not be performed |
| A-02 | A single organisation uses the portal; multi-tenancy is out of scope | Full redesign of data isolation testing |
| A-03 | English is the only supported language | Localisation testing not required |
| A-04 | A single functional currency is used; multi-currency is out of scope | Currency conversion and FX testing not required |
| A-05 | Five user roles exist: Vendor User, AP Reviewer, AP Approver, Finance Controller, System Administrator | RBAC tests are based on these roles; will need revision if wrong |
| A-06 | Vendor registration is self-service with optional admin approval; both flows will be tested | Only one flow may apply |
| A-07 | Invoice approval is single-level unless client confirms tiered approval | Multi-tier workflow tests not included at this time |
| A-08 | An SMTP-based email service is available in the test environment | Email notification tests require a test inbox and mail trap |
| A-09 | A payment system sandbox/mock endpoint is available for integration testing | Payment forwarding tests will use a mock if sandbox is unavailable |
| A-10 | PO data is seeded into the test environment by the DevOps team | PO-dependent test cases can only run after seeding is confirmed |
| A-11 | File attachments are optional at invoice submission | Both attachment and no-attachment paths are tested |
| A-12 | The system uses JWT-based authentication with a server-side revocation list | Session and token tests are designed around JWT behaviour |
| A-13 | The monthly report is internal-only; vendors cannot access it | Vendor access to report endpoint is tested as a negative case |
| A-14 | The application will be deployed on a cloud platform with at least two availability zones | Infrastructure resilience tests assume HA configuration |

---

## 4. Test Strategy

### 4.1 Testing Pyramid

```
                     ┌──────────┐
                     │   UAT    │  Business validation — manual
                   ┌─┴──────────┴─┐
                   │  E2E / UI    │  Workflow flows — automated (Playwright)
                 ┌─┴──────────────┴─┐
                 │  Integration/API  │  Service contracts — automated (Postman/RestAssured)
               ┌─┴──────────────────┴─┐
               │   Unit / Component    │  Logic & validation — automated (Jest/JUnit)
               └───────────────────────┘
```

### 4.2 Testing Principles

1. **Shift-left:** Security and integration tests begin in Sprint 1, not as a pre-release gate.
2. **API-first:** API tests are written before UI tests; they run on every pull request.
3. **Risk-based prioritisation:** Test effort is proportional to financial impact and security risk.
4. **Independent verification:** Security and compliance tests are performed independently of feature testing.
5. **No silent failures:** Every integration point has a tested failure-mode scenario.

### 4.3 Tooling

| Layer | Recommended Tool | Owned By |
|-------|-----------------|----------|
| Unit Testing | Jest (JS/TS) / JUnit (Java) | Developers |
| API Testing | Postman + Newman / RestAssured | QA Engineers |
| UI / E2E | Playwright | QA Automation Engineers |
| Performance | k6 / Gatling | QA / DevOps |
| Security (DAST) | OWASP ZAP / Burp Suite Community | Security / QA |
| Test Management | Jira + Zephyr / TestRail | QA Lead |
| Defect Tracking | Jira | All |
| CI/CD Orchestration | GitHub Actions / Jenkins | DevOps |
| Email Testing | Mailhog / Mailtrap | QA Engineers |
| API Documentation | OpenAPI / Swagger | Developers |

### 4.4 Environments

| Environment | Purpose | Managed By | Data State |
|------------|---------|------------|-----------|
| DEV | Unit and component testing | Developers | Ephemeral |
| QA/SIT | Functional, integration, API, security testing | QA Team | Seeded test data |
| PERF | Performance and load testing | DevOps | Large-volume synthetic data |
| UAT | Business user acceptance testing | Business / QA | Anonymised production-like data |
| PROD | Production | DevOps | Live data |

### 4.5 CI/CD Integration Plan

```
On every Pull Request:
  └── Unit tests (developer-owned)
  └── API tests (Postman/Newman) — 100% of API test collection
  └── OWASP ZAP baseline scan

On every Sprint Deployment to QA:
  └── Smoke suite (Playwright — ~5 minutes)
  └── Core regression suite (Playwright — ~30 minutes)

On every Release Candidate:
  └── Full regression suite (Playwright — ~2 hours)
  └── Performance suite (k6 — ~1 hour)
  └── Full DAST security scan (OWASP ZAP — ~1 hour)
  └── Manual exploratory testing session (2 hours)

Before every Production Deployment:
  └── Smoke suite against UAT/staging environment
  └── Release readiness checklist sign-off
```

---

## 5. Test Scope

### 5.1 Scope Summary

| Functional Area | In Scope | Test Types |
|----------------|----------|------------|
| Vendor Registration | Yes | Functional, Negative, Security, API |
| Vendor Login / Session | Yes | Functional, Negative, Security, API |
| Invoice Submission | Yes | Functional, Negative, Edge, Security, API, Performance |
| AP Invoice Review | Yes | Functional, Negative, Edge, RBAC, API, Workflow |
| Invoice Approval / Rejection | Yes | Functional, Negative, Edge, Security, API, Workflow |
| Payment Forwarding | Yes | Functional, Integration, Edge, API |
| Email Notifications | Yes | Functional, Integration, Edge |
| Monthly Reporting | Yes | Functional, Negative, Edge, Security, Performance |
| Role-Based Access Control | Yes | Functional, Security, RBAC, API |
| Audit Trail | Yes | Security, Compliance |
| File Upload / Attachments | Yes | Functional, Security, Edge |

---

## 6. In-Scope Features

### 6.1 REQ-01 — Vendor Registration and Authentication
- New vendor self-registration form
- Email verification flow (if applicable)
- Admin approval of vendor account (if applicable)
- Vendor login with username/password
- Password reset and forgot-password flows
- Session management (creation, expiry, invalidation on logout)
- Account lockout after failed login attempts

### 6.2 REQ-02 — Invoice Submission
- Invoice submission form (all fields: invoice number, date, PO number, amounts, line items, tax, currency)
- PO validation (existence, vendor ownership, remaining balance)
- File attachment upload (type validation, size limits, virus scanning)
- Duplicate invoice detection and blocking
- Invoice status tracking (vendor view)
- Invoice edit/withdrawal before AP review (if supported)
- Submission confirmation and reference number

### 6.3 REQ-03 — AP Team Invoice Review
- AP invoice list view with search and filter
- Invoice detail view (all fields and attachment)
- Approve action with state transition
- Reject action with mandatory reason
- Concurrent access handling (optimistic locking)
- Invoice assignment (if applicable)
- Audit log entries on all actions

### 6.4 REQ-04 — Payment Processing Forwarding
- Automatic forwarding of approved invoices to the payment system
- Forwarding failure detection and status update
- Retry mechanism on transient failure
- Idempotency of forwarding requests
- Invoice status transition to "Forwarded" on success

### 6.5 REQ-05 — Email Notifications
- Notification on: invoice submitted, approved, rejected, forwarded
- Correct recipient for each event (vendor / AP team)
- Email content accuracy and clarity
- Notification queue resilience (email service downtime)
- Links in email require authentication

### 6.6 REQ-06 — Monthly Invoice Activity Report
- Report generation for a specified month
- Correct aggregation of invoice counts, amounts, and statuses
- Report accessibility restricted to authorised internal roles
- Report behaviour for zero-activity months
- Report output format (PDF / Excel / on-screen)

### 6.7 REQ-07 — Authorisation and Access Control
- Server-side RBAC enforcement on all routes and API endpoints
- Session token validation on every request
- Role isolation (vendor cannot access AP features and vice versa)
- IDOR prevention (vendors cannot access other vendors' data)
- Unauthenticated access blocked across all protected resources

---

## 7. Out-of-Scope Features

The following are explicitly excluded from this test cycle unless scope is revised by the Product Owner:

| Feature | Reason Excluded |
|---------|----------------|
| Mobile native application | Not mentioned in requirements; assumed out of scope |
| Multi-currency support | Assumed single currency; pending client confirmation |
| Multi-language / localisation | English-only assumed |
| Multi-tenant / white-label support | Single-organisation assumed |
| Credit note / invoice reversal workflow | Not mentioned; flagged as missing requirement |
| Vendor dispute / appeal process | Not mentioned; flagged as missing requirement |
| PO creation within the portal | POs assumed to originate externally |
| User self-service account deletion (GDPR right to erasure) | Pending legal/compliance clarification |
| In-app chat or support ticketing | Not mentioned in requirements |
| Third-party vendor onboarding integrations (e.g., Ariba, Coupa) | Not mentioned |
| Native PDF / invoice OCR scanning | Not mentioned |
| Ad-hoc report date range queries | Monthly cadence only assumed from PRD |

---

## 8. Test Approach

### 8.1 Risk-Based Prioritisation

Test effort is allocated based on financial risk, security exposure, and business impact:

| Priority | Area | Rationale |
|----------|------|-----------|
| P1 — Critical | RBAC, IDOR, Server-side auth, Duplicate invoice, Payment idempotency | Direct financial loss or data breach risk |
| P1 — Critical | PO validation, Concurrent submission | Financial control violation |
| P2 — High | Email notification accuracy, Rejection reasons, Audit trail | Business process integrity |
| P2 — High | Invoice status transitions, Workflow completeness | Core user journey |
| P3 — Medium | Reporting accuracy, Edge case boundaries | Operational accuracy |
| P4 — Low | UI polish, Informational emails, Filter/search | Usability, low-risk |

### 8.2 Manual vs. Automated Split

| Test Type | Approach | Trigger |
|-----------|----------|---------|
| Unit Tests | Automated (developer) | Every commit |
| API Tests | Automated (Postman/Newman) | Every PR |
| Core Regression | Automated (Playwright) | Every sprint deployment |
| Security (DAST) | Semi-automated (OWASP ZAP) | Every release candidate |
| Performance | Automated (k6) | Pre-release |
| Exploratory | Manual | Per sprint |
| UAT | Manual (business users) | Pre-go-live |
| Usability | Manual (QA + UX) | Per sprint |

### 8.3 Defect Triage SLA

| Severity | Response | Resolution Target |
|----------|----------|-------------------|
| Critical (P1) | 2 hours | Same sprint |
| High (P2) | 1 business day | Same sprint |
| Medium (P3) | 3 business days | Next sprint |
| Low (P4) | 1 week | Backlog |

---

## 9. Test Levels

### 9.1 Unit Testing

**Ownership:** Development Team
**Tools:** Jest / JUnit / Pytest (framework-dependent)
**Scope:** Individual functions, service methods, validation logic, business rules

**Key Areas to Unit Test:**
- Invoice amount validation (> 0, ≤ PO balance)
- Duplicate invoice detection logic
- PO balance calculation after partial invoicing
- Date validation (not future-dated, not pre-PO date)
- File type and size validation
- Monthly report date boundary calculations
- JWT token generation and expiry logic
- Role-permission resolution functions
- Email template rendering logic

**Coverage Target:** Minimum 80% code coverage on business logic modules; 100% on financial calculation functions.

**Entry Criteria:** Feature branch created; component code review passed.
**Exit Criteria:** All unit tests passing; coverage threshold met; PR approved.

---

### 9.2 Integration Testing

**Ownership:** QA Team with Developer Support
**Tools:** Postman, RestAssured, custom test harnesses
**Scope:** Data flow between portal and all external systems

| IT-ID | Integration Point | Scenario | Expected Result |
|-------|------------------|----------|----------------|
| IT-01 | Portal → Database | Invoice submission creates a record atomically | Invoice record persisted; PO balance updated in same transaction |
| IT-02 | Portal → Payment System | Approved invoice payload sent correctly | Payment system acknowledges receipt; portal status updated to "Forwarded" |
| IT-03 | Portal → Email Service | Status change triggers notification event | Email delivered to correct recipient within 60 seconds |
| IT-04 | Portal → File Storage | Invoice attachment uploaded and linked | File stored; link persisted on invoice record; accessible to AP team |
| IT-05 | Portal → PO Data Source | Invoice submission triggers PO lookup | Correct PO returned; balance validated; ownership verified |
| IT-06 | Payment System → Portal | Payment system returns success response | Invoice status updated; vendor notified |
| IT-07 | Payment System → Portal | Payment system is unavailable | Invoice queued; retry scheduled; AP team notified of delay |
| IT-08 | Email Service → Portal | Email service is down | Notification queued; invoice workflow not blocked; retry on recovery |
| IT-09 | File Storage → Portal | Storage service is unavailable | Invoice submission fails gracefully; no partial record saved; user informed |
| IT-10 | PO Data Source → Portal | PO source returns timeout | User-friendly error displayed; submission not accepted; no data corrupted |
| IT-11 | Portal → Payment System | Retry after timeout where first attempt succeeded | Idempotency key prevents double payment; one payment recorded |
| IT-12 | Portal → Audit Log | Approve action logged with full metadata | Log entry: user ID, role, timestamp, invoice ID, previous state, new state, IP |

**Entry Criteria:** All dependent services available in QA environment (real or mocked); API contracts documented.
**Exit Criteria:** All integration paths tested; no silent failures; retry behaviour verified; integration report signed off by Tech Lead.

---

### 9.3 System Testing

**Ownership:** QA Team
**Tools:** Playwright, Postman, OWASP ZAP
**Scope:** Full system behaviour across all features and user roles

System testing covers the full set of functional, negative, edge case, security, RBAC, and workflow test cases detailed in Sections 11–19. It is executed in the QA/SIT environment against a fully integrated deployment.

**Key System-Level Concerns:**
- End-to-end invoice state machine correctness
- Cross-role data isolation
- Concurrent access handling
- Notification delivery accuracy
- Report data accuracy under load
- OWASP Top 10 vulnerability validation

**Entry Criteria:** Integration testing complete with no Critical/High open defects; all features code-complete and deployed to QA.
**Exit Criteria:** 100% test case execution; zero Critical/High open defects; security scan passed; system test report signed off by QA Lead.

---

### 9.4 User Acceptance Testing (UAT)

**Ownership:** Business Stakeholders, facilitated by QA
**Tools:** UAT scripts, sign-off forms, Jira for defect capture
**Participants:**

| Role | Participant Count | Responsibility |
|------|-----------------|----------------|
| Vendor Representatives | 2–3 | Execute vendor-facing scenarios |
| AP Team Members | 2–3 | Execute AP review and approval scenarios |
| Finance Lead | 1 | Validate payment forwarding and reporting |
| Product Owner | 1 | Facilitate, observe, and sign off |

**UAT Scenarios:**

| UAT-ID | Scenario | Performed By |
|--------|----------|-------------|
| UAT-01 | Vendor registers on the portal and receives a verification/welcome email | Vendor |
| UAT-02 | Vendor logs in, navigates the dashboard, and submits a real invoice against a provided test PO | Vendor |
| UAT-03 | Vendor views submitted invoice and confirms the status display is clear and accurate | Vendor |
| UAT-04 | Vendor receives an email notification and confirms the content is clear and actionable | Vendor |
| UAT-05 | AP team member logs in and locates the submitted invoice in the review queue | AP Team |
| UAT-06 | AP team member reviews all invoice details and approves it | AP Team |
| UAT-07 | AP team member rejects a second invoice with a reason; vendor receives the rejection email | AP Team + Vendor |
| UAT-08 | Vendor confirms the rejection email contains a clear, actionable reason | Vendor |
| UAT-09 | Finance lead verifies the approved invoice is correctly reflected in the payment queue | Finance Lead |
| UAT-10 | Finance lead views the monthly activity report and confirms it contains expected data | Finance Lead |
| UAT-11 | Both parties confirm they cannot access each other's features | Vendor + AP Team |
| UAT-12 | Vendor attempts to submit against a non-existent PO and receives a clear error message | Vendor |

**Entry Criteria:** All Critical and High system-test defects resolved; UAT environment loaded with representative data; participants briefed and credentialled.
**Exit Criteria:** All UAT scenarios executed by business participants; zero Critical/High UAT defects open; written sign-off from Product Owner and Finance Lead.

---

## 10. Test Scenarios

High-level scenarios mapped to each requirement, forming the master coverage plan:

### REQ-01 — Registration and Login

| TS-ID | Scenario |
|-------|----------|
| TS-REG-01 | Successful vendor self-registration with all mandatory fields |
| TS-REG-02 | Registration blocked for duplicate email address |
| TS-REG-03 | Registration with invalid or missing mandatory fields shows field-level errors |
| TS-REG-04 | Admin approves or rejects a vendor registration (if applicable) |
| TS-LOG-01 | Vendor logs in with valid credentials and reaches dashboard |
| TS-LOG-02 | Login fails gracefully for invalid credentials without enumeration |
| TS-LOG-03 | Account locked after repeated failed login attempts |
| TS-LOG-04 | Password reset flow delivers a time-limited link to registered email |
| TS-LOG-05 | Session expires after idle timeout; user redirected to login |
| TS-LOG-06 | Logout invalidates session; back-button navigation does not restore it |

### REQ-02 — Invoice Submission

| TS-ID | Scenario |
|-------|----------|
| TS-INV-01 | Vendor submits a valid invoice against a matching open PO |
| TS-INV-02 | Invoice submission blocked for non-existent PO |
| TS-INV-03 | Invoice submission blocked when amount exceeds PO remaining balance |
| TS-INV-04 | Invoice for exact PO remaining balance is accepted and PO marked exhausted |
| TS-INV-05 | Duplicate invoice (same vendor, PO, invoice number) is blocked |
| TS-INV-06 | File attachment accepted in valid format within size limit |
| TS-INV-07 | File attachment rejected for unsupported format or oversized file |
| TS-INV-08 | Concurrent submissions against same PO — only one exceeding balance is blocked |
| TS-INV-09 | Vendor views list of their own submitted invoices |
| TS-INV-10 | Vendor cannot view invoices belonging to another vendor |

### REQ-03 — AP Team Review

| TS-ID | Scenario |
|-------|----------|
| TS-APR-01 | AP team views invoice list with all submitted invoices |
| TS-APR-02 | AP team approves a valid invoice; status transitions to Approved |
| TS-APR-03 | AP team rejects an invoice with a mandatory written reason |
| TS-APR-04 | Concurrent approval by two AP members — only first action succeeds |
| TS-APR-05 | AP team cannot approve an already-approved invoice |
| TS-APR-06 | AP team cannot reject an invoice without providing a reason |
| TS-APR-07 | All approval and rejection actions are captured in the audit log |

### REQ-04 — Payment Forwarding

| TS-ID | Scenario |
|-------|----------|
| TS-PAY-01 | Approved invoice is automatically forwarded to the payment system |
| TS-PAY-02 | Payment system unavailability queues the invoice and triggers retry |
| TS-PAY-03 | Invoice forwarding is idempotent — retry after timeout does not double-pay |
| TS-PAY-04 | Forwarding failure is surfaced to the AP team as a status alert |

### REQ-05 — Email Notifications

| TS-ID | Scenario |
|-------|----------|
| TS-NTF-01 | AP team notified when a new invoice is submitted |
| TS-NTF-02 | Vendor notified when their invoice is approved |
| TS-NTF-03 | Vendor notified when their invoice is rejected, with the reason |
| TS-NTF-04 | Email notification link requires authentication to access invoice data |
| TS-NTF-05 | Email service outage does not block the invoice workflow |

### REQ-06 — Monthly Reporting

| TS-ID | Scenario |
|-------|----------|
| TS-RPT-01 | Monthly report generated with correct metrics for a given period |
| TS-RPT-02 | Report for a month with zero invoices is generated cleanly |
| TS-RPT-03 | Vendor cannot access the monthly report |
| TS-RPT-04 | Request for a future-month report is rejected |

### REQ-07 — Authorisation

| TS-ID | Scenario |
|-------|----------|
| TS-AUTH-01 | Unauthenticated user is redirected to login from any protected URL |
| TS-AUTH-02 | Vendor cannot access AP team pages or actions |
| TS-AUTH-03 | AP team cannot submit invoices as a vendor |
| TS-AUTH-04 | Server-side role enforcement cannot be bypassed by direct API call |
| TS-AUTH-05 | IDOR — vendor cannot access another vendor's invoice by ID |

---

## 11. Functional Test Cases

### 11.1 Vendor Registration

| TC-ID | Title | Preconditions | Steps | Expected Result | Priority |
|-------|-------|---------------|-------|----------------|----------|
| TC-REG-001 | Successful vendor registration | User is on the registration page; email is not previously registered | 1. Enter valid company name 2. Enter valid email 3. Enter password meeting policy 4. Fill all mandatory fields 5. Submit form | Account created; success confirmation shown; verification email sent (if applicable) | P1 |
| TC-REG-002 | Registration persists vendor details | Registration complete | Log in with the registered credentials and navigate to profile | All entered fields displayed accurately; no data loss or encoding errors | P1 |
| TC-REG-003 | Vendor can log in immediately after registration | Registration complete; email verified | Enter registered email and password on login page | Login successful; vendor dashboard displayed | P1 |

### 11.2 Vendor Login and Session

| TC-ID | Title | Preconditions | Steps | Expected Result | Priority |
|-------|-------|---------------|-------|----------------|----------|
| TC-LOG-001 | Login with valid credentials | Valid vendor account exists | Enter correct email and password; click Login | Dashboard rendered; session token issued; user shown as logged in | P1 |
| TC-LOG-002 | Session expires after idle timeout | Vendor is logged in | Leave session idle beyond the configured timeout period | User is redirected to login page; session token is invalidated | P1 |
| TC-LOG-003 | Logout invalidates session | Vendor is logged in | Click Logout; then press browser Back button | Browser returns to login page; no portal content displayed; API call with old token returns 401 | P1 |
| TC-LOG-004 | Password reset sends a timed link | Valid vendor account exists | Click "Forgot Password"; enter registered email; submit | Password reset email sent; link is time-limited; link is single-use | P2 |

### 11.3 Invoice Submission

| TC-ID | Title | Preconditions | Steps | Expected Result | Priority |
|-------|-------|---------------|-------|----------------|----------|
| TC-INV-001 | Submit valid invoice against open PO | Vendor logged in; open PO exists with sufficient balance | Enter all mandatory invoice fields; enter valid PO number; submit | Invoice created with status "Submitted"; confirmation message shown; AP team notified | P1 |
| TC-INV-002 | Submit invoice with valid file attachment | Vendor logged in; open PO exists | Fill invoice form; attach a PDF ≤ max size; submit | Invoice submitted; attachment stored; link visible on invoice detail | P1 |
| TC-INV-003 | View submitted invoice status | Vendor logged in; invoice previously submitted | Navigate to "My Invoices" list | Invoice appears in list with correct status, date, and amount | P1 |
| TC-INV-004 | Invoice appears in AP queue | AP user logged in; invoice submitted by vendor | Navigate to invoice review queue | Submitted invoice appears in queue with correct vendor, amount, and PO details | P1 |

### 11.4 AP Team Invoice Review

| TC-ID | Title | Preconditions | Steps | Expected Result | Priority |
|-------|-------|---------------|-------|----------------|----------|
| TC-APR-001 | AP team views full invoice details | AP user logged in; invoice submitted | Click on an invoice from the queue | All invoice fields, attachment link, and PO details displayed correctly | P1 |
| TC-APR-002 | Approve a valid invoice | AP user logged in; invoice in "Submitted" status | Open invoice; click Approve; confirm action | Invoice status changes to "Approved"; vendor receives approval notification; audit log updated | P1 |
| TC-APR-003 | Reject invoice with reason | AP user logged in; invoice in "Submitted" status | Open invoice; click Reject; enter rejection reason; confirm | Invoice status changes to "Rejected"; vendor receives rejection email including reason; audit log updated | P1 |
| TC-APR-004 | Audit log records approval action | AP user logged in | Approve an invoice | Audit log entry created with: AP user ID, role, timestamp (UTC), invoice ID, action = Approve, previous state = Submitted | P1 |

### 11.5 Payment Forwarding

| TC-ID | Title | Preconditions | Steps | Expected Result | Priority |
|-------|-------|---------------|-------|----------------|----------|
| TC-PAY-001 | Approved invoice forwarded to payment system | Invoice in "Approved" status; payment system available | Invoice is approved by AP team | System forwards invoice to payment system; invoice status transitions to "Forwarded"; forwarding event logged | P1 |
| TC-PAY-002 | Invoice status reflects forwarding | Invoice forwarded | Vendor and AP team view invoice | Status shows "Forwarded" or "Pending Payment"; timestamp of forwarding recorded | P2 |

### 11.6 Email Notifications

| TC-ID | Title | Preconditions | Steps | Expected Result | Priority |
|-------|-------|---------------|-------|----------------|----------|
| TC-NTF-001 | AP team notified of new submission | Vendor logged in; AP team member has registered email | Vendor submits a valid invoice | AP team member's inbox receives notification within 5 minutes; email contains invoice reference and a portal link | P1 |
| TC-NTF-002 | Vendor notified of approval | Invoice in "Submitted" status | AP team approves the invoice | Vendor's registered email receives approval notification; email contains invoice reference and portal link | P1 |
| TC-NTF-003 | Vendor notified of rejection with reason | Invoice in "Submitted" status | AP team rejects invoice with a reason | Vendor's email contains rejection notification and the rejection reason text | P1 |

### 11.7 Monthly Report

| TC-ID | Title | Preconditions | Steps | Expected Result | Priority |
|-------|-------|---------------|-------|----------------|----------|
| TC-RPT-001 | Generate monthly report for a completed month | AP/Finance user logged in; invoices exist for target month | Navigate to Reports; select completed month; generate | Report produced in correct format; includes total submitted, approved, rejected counts and amounts for the period | P1 |
| TC-RPT-002 | Report includes all invoice statuses | Multiple invoices in different statuses exist for the period | Generate report for that period | Report correctly segregates and counts invoices by each status; totals are mathematically correct | P1 |

---

## 12. Negative Test Cases

| TC-ID | Feature | Scenario | Steps | Expected Result | Priority |
|-------|---------|----------|-------|----------------|----------|
| TC-NEG-001 | Registration | Duplicate email address | Submit registration form with email already in system | Error: "An account with this email already exists." No duplicate account created | P1 |
| TC-NEG-002 | Registration | Missing mandatory fields | Submit registration form with one or more mandatory fields empty | Inline validation error on each missing field; form not submitted | P1 |
| TC-NEG-003 | Registration | Invalid email format | Enter "vendor@" or "vendor.com" in email field | Field-level error: "Please enter a valid email address" | P1 |
| TC-NEG-004 | Login | Wrong password | Enter correct email but wrong password | Generic error: "Invalid email or password." Account not locked on first attempt | P1 |
| TC-NEG-005 | Login | Non-existent email | Enter an email not registered in the system | Same generic error as wrong password; does not confirm email existence | P1 |
| TC-NEG-006 | Login | Account lockout | Enter wrong password 5+ times for the same account | Account temporarily locked; user informed; HTTP 429 returned | P1 |
| TC-NEG-007 | Login | Deactivated account | Log in with a deactivated vendor account | Error: "Your account has been deactivated. Please contact support." Login blocked | P1 |
| TC-NEG-008 | Invoice Submission | Non-existent PO number | Submit invoice with a PO number not in the system | Error: "PO number not found. Please verify and try again." Invoice not created | P1 |
| TC-NEG-009 | Invoice Submission | PO belongs to another vendor | Submit invoice against a PO issued to a different vendor | Error displayed; PO owner not revealed; invoice not created | P1 |
| TC-NEG-010 | Invoice Submission | Invoice amount exceeds PO balance | Enter amount greater than remaining PO balance | Error: "Invoice amount exceeds the remaining PO balance of [X]." Submission blocked | P1 |
| TC-NEG-011 | Invoice Submission | Zero or negative invoice amount | Enter 0 or -100 in the invoice amount field | Validation error: "Invoice amount must be greater than zero" | P1 |
| TC-NEG-012 | Invoice Submission | Duplicate invoice number | Submit identical invoice number against same PO | Error: "An invoice with this number has already been submitted for this PO." Blocked | P1 |
| TC-NEG-013 | Invoice Submission | Unsupported file attachment | Upload a .exe, .zip, or .docx file | Error: "Unsupported file type. Please upload PDF, JPG, or PNG." Upload blocked | P1 |
| TC-NEG-014 | Invoice Submission | File exceeds size limit | Upload a file larger than the maximum size | Error: "File exceeds the maximum allowed size of [X] MB." Upload rejected | P2 |
| TC-NEG-015 | Invoice Submission | Future-dated invoice | Enter an invoice date in the future | Validation error: "Invoice date cannot be in the future." | P2 |
| TC-NEG-016 | Invoice Submission | Invoice date before PO date | Enter invoice date earlier than the PO creation date | Warning or error: "Invoice date cannot be earlier than the PO creation date." | P2 |
| TC-NEG-017 | AP Review | Reject without reason | AP member clicks Reject without entering a reason | Action blocked; required field highlighted: "Please provide a rejection reason." | P1 |
| TC-NEG-018 | AP Review | Approve already-approved invoice | AP member attempts to approve an invoice already in "Approved" status | Action blocked; current status displayed; no duplicate approval event logged | P2 |
| TC-NEG-019 | Reporting | Request future-month report | AP user requests report for next month | Error: "Reports cannot be generated for a future period." | P2 |
| TC-NEG-020 | Access Control | Unauthenticated API access | Call any protected API endpoint without an auth token | HTTP 401 Unauthorized; no data returned | P1 |

---

## 13. Edge Cases

### 13.1 Registration and Login Edge Cases

| EC-ID | Type | Scenario | Expected Behaviour | Priority |
|-------|------|----------|-------------------|----------|
| EC-REG-001 | Boundary | Password at exact minimum length | Accepted if all rules met; rejected if one character short | P2 |
| EC-REG-002 | Data | Company name with special characters (O'Brien & Sons, Müller GmbH) | Accepted; displayed without encoding errors; exportable | P2 |
| EC-REG-003 | Security | SQL injection in registration field | Input sanitised; no SQL executed; no DB error exposed | P1 |
| EC-REG-004 | Security | XSS payload in company name field | Not executed anywhere in the portal; escaped on display | P1 |
| EC-LOG-001 | Timing | Login attempt immediately after registration before email verification | Blocked; prompt to verify email; resend link available | P2 |
| EC-LOG-002 | Exception | Authentication service temporarily unavailable | User-friendly error message; no stack trace shown | P1 |
| EC-LOG-003 | Security | Brute-force login via automated script | Rate limiting per IP and per account; HTTP 429 returned | P1 |
| EC-LOG-004 | Session | Two simultaneous sessions from same vendor account | Behaviour per policy (concurrent allowed or oldest session invalidated) | P2 |

### 13.2 Invoice Submission Edge Cases

| EC-ID | Type | Scenario | Expected Behaviour | Priority |
|-------|------|----------|-------------------|----------|
| EC-INV-001 | Boundary | Invoice amount exactly equals remaining PO balance | Accepted; PO balance becomes zero; further invoices blocked | P1 |
| EC-INV-002 | Concurrency | Two invoices submitted simultaneously against same PO; only one fits | DB-level locking ensures only one accepted; other gets balance error; no partial save | P1 |
| EC-INV-003 | Data | Invoice with 500+ line items | Accepted without timeout or truncation; UI renders without degradation | P2 |
| EC-INV-004 | Security | Malware file (EICAR test) uploaded as attachment | Scanned before storage; rejected; security event logged | P1 |
| EC-INV-005 | Security | File with disguised extension (malware.exe renamed invoice.pdf) | Content-type validated by magic bytes, not extension; rejected | P1 |
| EC-INV-006 | Exception | Storage service down during submission with attachment | Graceful error; invoice not partially saved; user prompted to retry | P1 |
| EC-INV-007 | Exception | Network drops mid-submission | Idempotency or rollback; no orphaned or duplicate invoice record | P1 |
| EC-INV-008 | Data | Invoice submitted on the last day of the month near midnight | Stored with correct date; attributed to correct month in report | P2 |

### 13.3 Approval Workflow Edge Cases

| EC-ID | Type | Scenario | Expected Behaviour | Priority |
|-------|------|----------|-------------------|----------|
| EC-APR-001 | Concurrency | Two AP members attempt to approve the same invoice simultaneously | First action succeeds; second receives "already actioned" error; no duplicate event | P1 |
| EC-APR-002 | Concurrency | One approves while another simultaneously rejects same invoice | First action wins; second sees stale state error; invoice in correct final state | P1 |
| EC-APR-003 | Security | Vendor directly calls approve API endpoint | HTTP 403; action not executed; attempt logged | P1 |
| EC-APR-004 | Exception | Payment system unreachable when AP approves invoice | Invoice queued; AP sees success; forwarding failure logged; retry scheduled | P1 |
| EC-APR-005 | Edge | AP member deactivated mid-review | On next action, session invalidated; invoice returns to previous state; clean audit trail | P1 |
| EC-APR-006 | Duplicate | AP approves a flagged duplicate invoice | System warns: "This invoice number was previously submitted. Review carefully." | P1 |

### 13.4 Payment Forwarding Edge Cases

| EC-ID | Type | Scenario | Expected Behaviour | Priority |
|-------|------|----------|-------------------|----------|
| EC-PAY-001 | Idempotency | Forwarding request times out; system retries; first attempt succeeded | Idempotency key prevents duplicate payment; one payment only | P1 |
| EC-PAY-002 | Exception | Payment system returns an error response | Status set to "Forwarding Failed"; AP team alerted; failure logged | P1 |
| EC-PAY-003 | Timing | Invoice approved on bank holiday | Forwarded successfully; payment system applies its own calendar | P2 |
| EC-PAY-004 | Reversal | AP manager revokes approval after invoice already forwarded | System attempts cancellation; if payment already issued, raises alert to finance | P1 |

### 13.5 Email Notification Edge Cases

| EC-ID | Type | Scenario | Expected Behaviour | Priority |
|-------|------|----------|-------------------|----------|
| EC-NTF-001 | Exception | Vendor email invalid/mailbox does not exist | Delivery failure logged; AP/admin alerted; workflow not blocked | P1 |
| EC-NTF-002 | Exception | Email service unavailable at time of status change | Notification queued; retried on recovery; invoice workflow not blocked | P1 |
| EC-NTF-003 | Data | Multiple rapid status changes on one invoice | Notifications sent per event in correct order; none dropped or merged | P2 |
| EC-NTF-004 | Security | Invoice link in email clicked by unauthenticated user | Redirect to login; invoice data not exposed without valid session | P1 |

### 13.6 Reporting Edge Cases

| EC-ID | Type | Scenario | Expected Behaviour | Priority |
|-------|------|----------|-------------------|----------|
| EC-RPT-001 | Data | Report for a month with zero invoices | Report generated with zero counts; message "No invoice activity for this period" | P2 |
| EC-RPT-002 | Timezone | Report generated at midnight crossing UTC boundary | Report uses consistent, documented timezone (UTC); no invoices in wrong month | P1 |
| EC-RPT-003 | Exception | Report generation job crashes mid-execution | Partial report not published; failure alerted; previous report preserved; retry available | P1 |
| EC-RPT-004 | Scale | 10,000+ invoices for one month | Report completes within target time; no timeout; no memory exhaustion | P2 |
| EC-RPT-005 | Data | Invoice changes status on last day of month just before report runs | Report reflects status at moment of generation; consistent cutoff documented | P2 |
| EC-RPT-006 | Security | Vendor accesses report URL directly | HTTP 403; no report data returned; attempt logged | P1 |

---

## 14. Security Test Cases

| TC-ID | Category | Scenario | Steps | Expected Result | Priority |
|-------|----------|----------|-------|----------------|----------|
| TC-SEC-001 | Injection | SQL injection in all input fields | Enter `' OR 1=1 --` in registration, login, and invoice fields | Input sanitised; no SQL executed; no DB error returned; stored as literal or rejected | P1 |
| TC-SEC-002 | XSS | Stored XSS in company name field | Enter `<script>alert('XSS')</script>` in company name; save; view in AP team UI | Script not executed; content escaped on all display surfaces | P1 |
| TC-SEC-003 | Auth | Unauthenticated access to protected route | Navigate directly to /invoices, /approve, /reports without session | Redirect to /login; no data returned; HTTP 401 on API equivalent | P1 |
| TC-SEC-004 | IDOR | Vendor accesses another vendor's invoice | As Vendor A, call GET /invoices/{vendor-B-invoice-UUID} | HTTP 403 or 404; no data from Vendor B returned | P1 |
| TC-SEC-005 | Privilege Escalation | Vendor calls AP-only approval endpoint | As vendor, call PATCH /invoices/{id}/approve with vendor JWT | HTTP 403; action not recorded; attempt logged | P1 |
| TC-SEC-006 | Session Fixation | Session valid after logout | Capture token; log out; replay captured token against protected API | HTTP 401; token is invalidated/blacklisted | P1 |
| TC-SEC-007 | Session Replay | Replay approval request after session ends | Capture an approval API call; end session; resend captured request | HTTP 401; approval not recorded | P1 |
| TC-SEC-008 | Parameter Tampering | Role escalation via request body | Add `"role": "admin"` to request body or JWT claims | Server ignores client-supplied role; resolves role from server-side session only | P1 |
| TC-SEC-009 | Brute Force | Automated login attempts | Send 20+ rapid login attempts against one account | Account locked; HTTP 429 returned; rate limiting enforced per IP | P1 |
| TC-SEC-010 | File Upload | Upload known malware | Upload EICAR test file as invoice attachment | File rejected before storage; upload blocked; security event logged | P1 |
| TC-SEC-011 | File Upload | Disguised extension | Upload malware.exe renamed to invoice.pdf | File type validated by content (magic bytes), not extension; rejected | P1 |
| TC-SEC-012 | Data Exposure | Error response contains stack trace | Trigger a 500 error via malformed request | Only generic error message returned; no stack trace, DB schema, or file paths | P1 |
| TC-SEC-013 | Transport Security | HTTP access to any endpoint | Send HTTP (not HTTPS) request to any endpoint | Redirected to HTTPS or rejected; TLS enforced | P1 |
| TC-SEC-014 | CSRF | Cross-site request forgery on approve/reject | Craft a forged request from a different origin to PATCH /invoices/{id}/approve | CSRF token validated; request rejected; HTTP 403 | P1 |
| TC-SEC-015 | Audit Trail | All financial actions logged | Perform submit, approve, reject, forward actions | Each action has an audit log entry with user ID, role, timestamp (UTC), invoice ID, before/after state | P1 |
| TC-SEC-016 | Email Link | Invoice link in email accessible without auth | Copy the portal link from a notification email; open in incognito browser | Redirected to login; invoice data not exposed; link does not bypass auth | P1 |
| TC-SEC-017 | Sensitive Data in Email | Check email body content | Review content of all notification email types | No invoice amounts, PO values, vendor financials, or bank details appear in email body | P2 |
| TC-SEC-018 | Account Enumeration | Login error reveals email existence | Enter an email not in the system on login form | Same error message as wrong password; does not confirm email existence | P1 |

---

## 15. Role-Based Access Test Cases

### 15.1 Permission Matrix

| Feature / Action | Vendor User | AP Reviewer | AP Approver | Finance Controller | System Admin | Unauthenticated |
|----------------|:-----------:|:-----------:|:-----------:|:-----------------:|:------------:|:---------------:|
| Register (public form) | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Log in | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Submit invoice | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View own invoices | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View all invoices (AP queue) | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Approve invoice | ❌ | ❌ | ✅ | ✅ (high-value) | ❌ | ❌ |
| Reject invoice | ❌ | ✅* | ✅ | ❌ | ❌ | ❌ |
| Query vendor | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View monthly report | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Manage user accounts | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| View audit log | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |

*AP Reviewer can recommend rejection; final rejection authority requires AP Approver confirmation.

### 15.2 RBAC Test Cases

| TC-ID | Actor | Action Attempted | Expected Result |
|-------|-------|-----------------|----------------|
| TC-RBAC-001 | Vendor User | Access AP invoice review dashboard (UI) | HTTP 403; page not rendered; role error shown |
| TC-RBAC-002 | Vendor User | Call PATCH /invoices/{id}/approve (API) | HTTP 403; action not executed; attempt logged |
| TC-RBAC-003 | Vendor User | Call GET /reports/monthly (API) | HTTP 403; no report data returned |
| TC-RBAC-004 | Vendor User | Call GET /invoices (all invoices list) | HTTP 403 or only own invoices returned |
| TC-RBAC-005 | Vendor User | Access another vendor's invoice by UUID | HTTP 403 or 404; no data from other vendor |
| TC-RBAC-006 | AP Reviewer | Call POST /invoices (submit invoice) | HTTP 403; invoice not created |
| TC-RBAC-007 | AP Reviewer | Access vendor registration page | HTTP 403 or redirect |
| TC-RBAC-008 | AP Approver | Approve a valid submitted invoice | 200 OK; status updated; audit log entry created |
| TC-RBAC-009 | Finance Controller | View monthly report | 200 OK; full report data returned |
| TC-RBAC-010 | Unauthenticated | Access /invoices via direct URL | Redirect to /login; no data returned |
| TC-RBAC-011 | Unauthenticated | Call any API endpoint | HTTP 401; no data returned |
| TC-RBAC-012 | Any Role | Include `role=admin` in request body | Server ignores; role resolved server-side; no escalation |
| TC-RBAC-013 | Vendor User | Use AP team's JWT token to call vendor endpoint | Request processed with JWT's actual role; wrong-role actions blocked |
| TC-RBAC-014 | AP Reviewer | Access User Management panel | HTTP 403; admin-only panel not rendered |
| TC-RBAC-015 | System Admin | Deactivate vendor account | Account deactivated; all active sessions for vendor immediately invalidated |

---

## 16. API Test Scenarios

All API tests are executed against the documented OpenAPI/Swagger specification. HTTP status codes and response schemas are validated programmatically.

### 16.1 Authentication Endpoints

| TC-ID | Method | Endpoint | Scenario | Expected HTTP Status | Response Validation |
|-------|--------|----------|----------|---------------------|---------------------|
| TC-API-001 | POST | /auth/register | Valid registration payload — all mandatory fields | 201 Created | Response body contains user ID; no password returned |
| TC-API-002 | POST | /auth/register | Duplicate email address | 409 Conflict | Error body: message = "Email already registered" |
| TC-API-003 | POST | /auth/register | Missing mandatory field | 400 Bad Request | Error body lists all missing field names |
| TC-API-004 | POST | /auth/register | Invalid email format | 400 Bad Request | Validation error on email field |
| TC-API-005 | POST | /auth/login | Valid credentials | 200 OK | Response contains JWT access token and expiry |
| TC-API-006 | POST | /auth/login | Invalid password | 401 Unauthorized | Generic error; no indication which field is wrong |
| TC-API-007 | POST | /auth/login | Non-existent email | 401 Unauthorized | Same error as invalid password |
| TC-API-008 | POST | /auth/login | Correct credentials after 5 failed attempts | 423 Locked | Error: account temporarily locked |
| TC-API-009 | POST | /auth/logout | Valid session token | 200 OK | Token added to revocation list; subsequent use returns 401 |
| TC-API-010 | GET | /auth/me | Valid token | 200 OK | Returns current user ID, role, email — no password or sensitive fields |
| TC-API-011 | GET | /auth/me | Expired token | 401 Unauthorized | Error: "Token expired" |

### 16.2 Invoice Endpoints

| TC-ID | Method | Endpoint | Scenario | Expected HTTP Status | Response Validation |
|-------|--------|----------|----------|---------------------|---------------------|
| TC-API-012 | POST | /invoices | Valid invoice payload — vendor role | 201 Created | Invoice ID returned; status = "Submitted" |
| TC-API-013 | POST | /invoices | Invoice amount exceeds PO balance | 422 Unprocessable Entity | Error: balance exceeded with remaining balance in message |
| TC-API-014 | POST | /invoices | Non-existent PO number | 404 Not Found | Error: "PO not found" |
| TC-API-015 | POST | /invoices | No auth token in header | 401 Unauthorized | No invoice created |
| TC-API-016 | POST | /invoices | AP team JWT used (wrong role) | 403 Forbidden | No invoice created |
| TC-API-017 | POST | /invoices | Duplicate invoice number for same vendor + PO | 409 Conflict | Error: duplicate detected |
| TC-API-018 | GET | /invoices/{id} | Vendor retrieves own invoice | 200 OK | Full invoice object returned |
| TC-API-019 | GET | /invoices/{id} | Vendor accesses another vendor's invoice | 403 Forbidden | No invoice data returned |
| TC-API-020 | GET | /invoices | AP team retrieves invoice list | 200 OK | Paginated list; correct total count |
| TC-API-021 | PATCH | /invoices/{id}/approve | Valid approval by AP Approver | 200 OK | Status = "Approved"; audit log entry created |
| TC-API-022 | PATCH | /invoices/{id}/approve | Vendor token used | 403 Forbidden | Action not recorded |
| TC-API-023 | PATCH | /invoices/{id}/approve | Invoice already in "Approved" status | 409 Conflict | Error: "Invoice already approved" |
| TC-API-024 | PATCH | /invoices/{id}/reject | Valid rejection with reason | 200 OK | Status = "Rejected"; reason stored |
| TC-API-025 | PATCH | /invoices/{id}/reject | Missing rejection reason in body | 400 Bad Request | Validation error on reason field |
| TC-API-026 | POST | /invoices | SQL injection in invoice number field | 400 Bad Request | Input sanitised; no DB error in response |

### 16.3 Reporting Endpoints

| TC-ID | Method | Endpoint | Scenario | Expected HTTP Status | Response Validation |
|-------|--------|----------|----------|---------------------|---------------------|
| TC-API-027 | GET | /reports/monthly?month=2026-05 | Valid month; Finance Controller role | 200 OK | Report data object with counts, amounts, statuses |
| TC-API-028 | GET | /reports/monthly?month=2026-05 | Vendor token used | 403 Forbidden | No report data returned |
| TC-API-029 | GET | /reports/monthly?month=2027-01 | Future month | 400 Bad Request | Error: "Cannot generate report for a future period" |
| TC-API-030 | GET | /reports/monthly?month=2026-01 | Month with zero invoices | 200 OK | Report object with all counts = 0; no error |

---

## 17. Workflow Test Scenarios

End-to-end scenarios that traverse the full system across multiple actors, verifying state consistency and notification delivery at every step.

| WF-ID | Workflow | Actor Sequence | Steps | Pass Criteria |
|-------|----------|---------------|-------|--------------|
| WF-01 | **Happy Path — Full Approval Cycle** | Vendor → AP Approver → Payment System | 1. Vendor registers 2. Vendor logs in 3. Vendor submits invoice against valid PO 4. AP team receives notification 5. AP approves invoice 6. Invoice forwarded to payment 7. Vendor receives approval notification | Invoice reaches "Forwarded" status; both parties receive correct notifications; audit log has 3 entries (submit, approve, forward) |
| WF-02 | **Rejection and Resubmission** | Vendor → AP Approver → Vendor → AP Approver | 1. Vendor submits invoice 2. AP rejects with reason 3. Vendor receives rejection email with reason 4. Vendor corrects and resubmits 5. AP approves resubmission | Original invoice stays "Rejected"; new invoice created on resubmission; no data bleeds between records; vendor notified of final approval |
| WF-03 | **Partial PO Billing — Three Invoices** | Vendor (×3) → AP (×3) | 1. Vendor submits 3 invoices in sequence against 1 PO totalling the exact PO value 2. All 3 approved 3. Vendor attempts a 4th invoice | First 3 accepted; PO balance depletes correctly; 4th blocked with zero-balance error |
| WF-04 | **Concurrent Approval Attempt** | AP Member A + AP Member B | 1. Both AP members open same invoice simultaneously 2. Both click Approve at the same time | First action succeeds; second receives conflict error; invoice has exactly one Approved event in audit log |
| WF-05 | **Payment Forwarding Failure and Recovery** | AP Approver → Payment System (down) → Recovery | 1. AP approves invoice 2. Payment system is unavailable 3. System queues invoice for retry 4. Payment system recovers 5. Retry fires automatically | Invoice eventually reaches "Forwarded"; no manual intervention required; AP team notified of initial failure and eventual success |
| WF-06 | **Vendor Account Deactivation Mid-Workflow** | Vendor → Admin → AP Approver | 1. Vendor submits invoice 2. Admin deactivates vendor account 3. AP approves invoice 4. Deactivated vendor attempts login | Approval completes; payment forwarded; deactivated vendor cannot log in; invoice lifecycle unaffected by deactivation |
| WF-07 | **Session Expiry Mid-Form** | Vendor | 1. Vendor starts filling invoice form 2. Session expires 3. Vendor logs in again | Post-login, vendor is returned to invoice form; form data preserved where possible; no partial invoice saved during gap |
| WF-08 | **Full Month Cycle** | Vendor (×N) + AP Team | 1. Multiple vendors submit, receive approvals and rejections over a full calendar month 2. On the 1st of following month, report is generated | Report accurately reflects all invoice activity; counts match sum of each status; total amounts reconcile |
| WF-09 | **Zero Activity Month** | System (automated) | 1. No invoices submitted during a calendar month 2. Report generation triggered | Report generated without error; all counts and amounts show zero; no exceptions thrown |
| WF-10 | **SLA Breach Escalation** | Invoice (aging) → AP Supervisor | 1. Invoice submitted 2. AP team does not action within SLA window 3. SLA timer expires | Escalation notification sent to AP Supervisor; invoice flagged as "SLA Breached" in queue |

---

## 18. Data Validation Scenarios

Field-level validation must be enforced server-side (not only client-side) on all input surfaces.

### 18.1 Vendor Registration Fields

| Field | Valid Rule | Invalid Inputs to Test | Expected Behaviour |
|-------|-----------|----------------------|-------------------|
| Email | RFC 5322 format; unique | `vendor@`, `vendor.com`, `@domain.com`, `a@b`, empty | Field-level error; form not submitted |
| Password | Min 8 chars; at least 1 uppercase, 1 number, 1 special char | 7-char password; no uppercase; dictionary word only | Clear requirement-specific error for each rule |
| Company Name | 1–255 chars; Unicode allowed | Empty; 256+ chars; only spaces | Validation error on submit |
| Tax ID / Registration No. | Alphanumeric; format per jurisdiction | Wrong format; empty (if mandatory) | Format validation error |
| Phone Number | Digits, +, -, spaces; 7–15 chars | Letters; no digits; too short or too long | Validation error |

### 18.2 Invoice Submission Fields

| Field | Valid Rule | Invalid Inputs to Test | Expected Behaviour |
|-------|-----------|----------------------|-------------------|
| Invoice Number | 1–50 chars; unique per vendor per PO | Empty; 51+ chars; duplicate | Validation error |
| Invoice Date | YYYY-MM-DD; ≤ today; ≥ PO creation date | Future date; pre-PO date; invalid format | Validation error with clear message |
| PO Number | Must exist; must belong to submitting vendor | Non-existent; other vendor's PO | "PO not found" or "Not authorised" error |
| Invoice Amount | Decimal > 0; ≤ PO remaining balance | 0; negative; exceeds balance; non-numeric | Validation error per rule |
| Tax Amount | Decimal ≥ 0; ≤ invoice amount | Negative; exceeds invoice amount | Validation error |
| File Attachment | PDF/JPG/PNG; ≤ [X] MB | .exe, .zip, .js; oversized; empty file | Upload rejected with format/size error |
| Line Item Quantity | Integer > 0 | 0; negative; non-integer | Validation error |
| Line Item Unit Price | Decimal > 0 | 0; negative; non-numeric | Validation error |

### 18.3 Server-Side vs. Client-Side Validation

All validation must be enforced at the API layer. Bypassing the UI and calling the API directly with invalid data must produce the same validation errors as the UI. This is verified by the API test suite (Section 16).

---

## 19. Reporting Test Scenarios

### 19.1 Report Content Validation

| TC-ID | Scenario | Verification Method | Expected Result |
|-------|----------|---------------------|----------------|
| TC-RPT-001 | Total submitted count matches records in DB | Cross-reference report output with direct DB query | Counts identical |
| TC-RPT-002 | Total approved count matches approved invoices in DB | Cross-reference | Counts identical |
| TC-RPT-003 | Total rejected count matches rejected invoices in DB | Cross-reference | Counts identical |
| TC-RPT-004 | Total invoice amounts by status are arithmetically correct | Sum line-by-line in report; compare to DB aggregate | Values match |
| TC-RPT-005 | Report date range is inclusive of start and end date of month | Submit invoices on the 1st and last day of a month; verify both appear | Both appear in report |
| TC-RPT-006 | Invoice status at report generation time is used (not current status) | Change an invoice status after report generation; re-check report | Report reflects status at time of generation |
| TC-RPT-007 | Report timezone uses UTC (or documented timezone consistently) | Submit invoice at 23:59 local time where UTC = next day; check report | Invoice attributed to correct UTC day/month |

### 19.2 Report Access Control

| TC-ID | Scenario | Expected Result |
|-------|----------|----------------|
| TC-RPT-008 | AP Approver accesses report page | 200 OK; full report displayed |
| TC-RPT-009 | Finance Controller accesses report page | 200 OK; full report displayed |
| TC-RPT-010 | Vendor user accesses report URL | HTTP 403; report data not returned |
| TC-RPT-011 | Unauthenticated user accesses report URL | Redirect to login |

### 19.3 Report Generation Robustness

| TC-ID | Scenario | Expected Result |
|-------|----------|----------------|
| TC-RPT-012 | Report for a month with zero invoice activity | Report generated without error; displays "No activity for this period" |
| TC-RPT-013 | Report for a month with 10,000+ invoices | Generated within acceptable time; no timeout; complete and accurate |
| TC-RPT-014 | Report generation job fails partway through | Partial report not published; job failure alerted; previous report unaffected |
| TC-RPT-015 | Manual regeneration of a report after scheduled job failure | Produces identical results to the original; no duplicate report created |
| TC-RPT-016 | Request report for a future month | HTTP 400; error message "Cannot generate report for a future period" |

---

## 20. Test Data Requirements

### 20.1 Required Test Entities

| Entity | Quantity | Details |
|--------|----------|---------|
| Vendor User accounts | 5 | 1 active, 1 deactivated, 1 pending approval, 1 with bad email, 1 with MFA enrolled (if applicable) |
| AP Reviewer accounts | 2 | Active; different email addresses for notification testing |
| AP Approver accounts | 2 | Active; used for concurrent approval tests |
| Finance Controller account | 1 | Active; for report access testing |
| System Admin account | 1 | Active; for account management testing |
| Purchase Orders (POs) | 10 | See breakdown below |
| Invoices in various statuses | 20 | See breakdown below |
| Uploaded invoice attachments | 5 | PDFs of different sizes: 1 KB, 1 MB, 5 MB, exactly max size, 1 byte over max |
| Malware test file | 1 | EICAR test virus signature (safe, standardised) |

### 20.2 Purchase Order Test Data

| PO-ID | Status | Vendor | Total Value | Remaining Balance | Purpose |
|-------|--------|--------|-------------|-------------------|---------|
| PO-001 | Open | Vendor A | $10,000 | $10,000 | Happy path — full balance available |
| PO-002 | Open | Vendor A | $5,000 | $2,500 | Partial — already invoiced |
| PO-003 | Open | Vendor A | $1,000 | $0.01 | Boundary — near-zero balance |
| PO-004 | Closed | Vendor A | $3,000 | $0 | Negative — fully exhausted |
| PO-005 | Open | Vendor B | $8,000 | $8,000 | Cross-vendor IDOR testing |
| PO-006 | Open | Vendor A | $50,000 | $50,000 | High-value for approval tier testing |
| PO-007 | Open | Vendor A | $100 | $100 | Boundary — low-value PO |
| PO-008 | Open | Vendor C | $20,000 | $20,000 | Concurrent submission testing |
| PO-009 | Open | Vendor C | $20,000 | $20,000 | Concurrent submission testing (duplicate) |
| PO-010 | Open | Vendor A | $500 | $500 | Duplicate invoice detection testing |

### 20.3 Invoice Test Data

| INV-ID | Vendor | PO | Amount | Status | Purpose |
|--------|--------|----|--------|--------|---------|
| INV-001 | Vendor A | PO-001 | $1,000 | Submitted | AP review tests |
| INV-002 | Vendor A | PO-001 | $500 | Approved | Payment forwarding tests |
| INV-003 | Vendor A | PO-001 | $750 | Rejected | Resubmission tests |
| INV-004 | Vendor A | PO-001 | $2,000 | Forwarded | Status display tests |
| INV-005 | Vendor A | PO-010 | $500 | Submitted | Duplicate detection (submit INV-010 same details) |
| INV-006 | Vendor B | PO-005 | $1,000 | Submitted | IDOR test (Vendor A should not access) |
| INV-007 | Vendor A | PO-003 | $0.01 | Submitted | Boundary — exact remaining balance |
| INV-008 through INV-020 | Various | Various | Various | Various | Reporting tests — distributed across calendar months |

### 20.4 Test Environment Data Management

- Test data is seeded via a dedicated script run before each test phase.
- Data is reset to a known baseline before each test run.
- Production data is never used in test environments.
- Sensitive data in UAT is anonymised/pseudonymised.
- All test user passwords follow the format `Test@[role][number]!` (e.g., `Test@Vendor1!`).

---

## 21. Requirement Traceability Matrix (RTM)

| REQ-ID | Requirement | Test Cases | Coverage |
|--------|-------------|------------|---------|
| REQ-01 | Vendors can register and log in to the portal | TC-REG-001, TC-REG-002, TC-REG-003, TC-LOG-001, TC-LOG-002, TC-LOG-003, TC-LOG-004, TC-NEG-001 through TC-NEG-007, TC-API-001 through TC-API-011, TC-SEC-018, EC-REG-001 through EC-LOG-004, WF-01, WF-06, WF-07 | Full |
| REQ-02 | Vendors can submit invoices against purchase orders | TC-INV-001 through TC-INV-004, TC-NEG-008 through TC-NEG-016, TC-API-012 through TC-API-017, TC-API-026, TC-SEC-001, TC-SEC-002, TC-SEC-010, TC-SEC-011, EC-INV-001 through EC-INV-008, WF-01 through WF-03 | Full |
| REQ-03 | The AP team can view, approve, or reject invoices | TC-APR-001 through TC-APR-004, TC-NEG-017, TC-NEG-018, TC-API-020 through TC-API-025, TC-SEC-005, TC-SEC-014, TC-SEC-015, TC-RBAC-006 through TC-RBAC-008, EC-APR-001 through EC-APR-006, WF-01, WF-02, WF-04, WF-10 | Full |
| REQ-04 | Approved invoices are forwarded for payment processing | TC-PAY-001, TC-PAY-002, IT-02, IT-06, IT-07, IT-11, IT-12, EC-PAY-001 through EC-PAY-004, WF-01, WF-05 | Full |
| REQ-05 | Both parties receive email notifications on status changes | TC-NTF-001 through TC-NTF-003, IT-03, IT-08, TC-SEC-016, TC-SEC-017, EC-NTF-001 through EC-NTF-004, WF-01, WF-02 | Full |
| REQ-06 | The system generates monthly invoice activity reports | TC-RPT-001 through TC-RPT-016, TC-API-027 through TC-API-030, TC-RBAC-009, EC-RPT-001 through EC-RPT-006, WF-08, WF-09 | Full |
| REQ-07 | Only authorized users may access the system | TC-NEG-020, TC-SEC-003 through TC-SEC-009, TC-SEC-012 through TC-SEC-015, TC-RBAC-001 through TC-RBAC-015, TC-API-015, TC-API-016, TC-API-019, TC-API-022, TC-API-028 | Full |

**Total Unique Test Cases by Requirement:**

| REQ-ID | Functional | Negative | Edge | Security | RBAC | API | Workflow | Total |
|--------|-----------|----------|------|----------|------|-----|----------|-------|
| REQ-01 | 7 | 7 | 8 | 1 | 0 | 11 | 3 | **37** |
| REQ-02 | 4 | 9 | 8 | 5 | 0 | 6 | 3 | **35** |
| REQ-03 | 4 | 2 | 6 | 4 | 4 | 6 | 4 | **30** |
| REQ-04 | 2 | 0 | 4 | 0 | 0 | 2 | 2 | **10** |
| REQ-05 | 3 | 0 | 4 | 2 | 0 | 0 | 2 | **11** |
| REQ-06 | 8 | 1 | 6 | 2 | 2 | 4 | 2 | **25** |
| REQ-07 | 0 | 1 | 2 | 12 | 15 | 5 | 0 | **35** |
| **Total** | **28** | **20** | **38** | **26** | **21** | **34** | **16** | **183** |

---

## 22. Defect Management Approach

### 22.1 Defect Severity Classification

| Severity | Definition | Examples |
|----------|-----------|---------|
| **Critical (S1)** | System is unusable; financial loss or security breach possible; no workaround | Vendor can approve own invoice; duplicate payment issued; system crash on login; IDOR exposing vendor data |
| **High (S2)** | Major feature broken; significant business impact; workaround is cumbersome | Invoice cannot be submitted; approval action fails; notifications not sent; report data incorrect |
| **Medium (S3)** | Feature partially working; workaround exists; user experience degraded | File upload works but size error message unclear; filter does not work; incorrect date display |
| **Low (S4)** | Cosmetic or minor UX issue; no functional impact | Typo in UI text; button alignment; non-critical label inconsistency |

### 22.2 Defect Lifecycle

```
New → Assigned → In Progress → Fixed → Ready for Retest → Retest Pass → Closed
                                     ↘ Retest Fail → Reopened → In Progress
                   ↘ Rejected (not a defect) → Closed
                   ↘ Deferred → Backlog
```

### 22.3 Defect Report Template

Every defect must include:
- **Title:** Concise description of the failure observed
- **Severity / Priority:** As per the matrix above
- **Environment:** DEV / QA / UAT / PROD
- **Build Version:** Application version where defect was found
- **Preconditions:** System state required to reproduce
- **Steps to Reproduce:** Numbered, exact steps
- **Expected Result:** What should happen per requirements
- **Actual Result:** What actually happened
- **Evidence:** Screenshot, video, API response body, log excerpt
- **Test Case ID:** The TC-ID that surfaced this defect
- **Assignee:** Developer assigned for investigation

### 22.4 Defect Resolution SLA

| Severity | Acknowledgement | Resolution |
|----------|----------------|-----------|
| Critical (S1) | 2 hours | Same business day |
| High (S2) | 1 business day | Current sprint |
| Medium (S3) | 3 business days | Next sprint |
| Low (S4) | 1 week | Product backlog |

### 22.5 Defect Metrics

The following metrics are tracked weekly:

- Total defects found / fixed / open / closed
- Defect density per feature area (defects per 100 test cases)
- Defect leakage (defects found in UAT or PROD that should have been caught in QA)
- Defect aging (open defects by severity past their SLA)
- Retest pass rate

---

## 23. Automation Candidates

### 23.1 Automation Priority Matrix

| Priority | Test Suite | Tool | Trigger | Estimated Effort |
|----------|-----------|------|---------|-----------------|
| **P1 — Sprint 1** | All API tests (TC-API-001 to TC-API-030) | Postman + Newman | Every PR | 3 days |
| **P1 — Sprint 1** | OWASP ZAP baseline security scan | OWASP ZAP | Every PR | 1 day setup |
| **P1 — Sprint 1** | Core regression smoke suite (10 tests) | Playwright | Every deployment | 2 days |
| **P2 — Sprint 2** | Full regression suite (60 tests) | Playwright | Every sprint release | 5 days |
| **P2 — Sprint 2** | Core workflow E2E (WF-01, WF-02, WF-03) | Playwright | Every sprint release | 3 days |
| **P2 — Sprint 2** | Performance baseline tests (PT-01, PT-02) | k6 | Pre-release | 2 days |
| **P3 — Sprint 3** | Full RBAC matrix (TC-RBAC-001 to TC-RBAC-015) | Playwright + API | Every release | 2 days |
| **P3 — Sprint 3** | All workflow tests (WF-01 to WF-10) | Playwright | Every sprint release | 3 days |
| **P3 — Sprint 3** | Full performance suite (PT-01 to PT-08) | k6 | Pre-release | 2 days |

### 23.2 What Remains Manual

| Test Type | Reason |
|-----------|--------|
| UAT scenarios | Requires human business judgment and real-world user perspective |
| Exploratory testing | Unscripted discovery; cannot be scripted by definition |
| Usability and UX review | Subjective assessment; requires human evaluation |
| New feature first-pass smoke | Selectors may not be stable before automation is written |
| Compliance walkthroughs | Require human attestation for regulatory purposes |
| Payment system integration (live) | May require manual verification in production-like environment |

### 23.3 Automation Architecture

```
GitHub Actions Pipeline
│
├── On Pull Request
│   ├── npm test (unit tests — developer-owned)
│   ├── newman run vimp-api-collection.json (API tests)
│   └── zap-baseline.py (OWASP ZAP)
│
├── On Sprint Deployment to QA
│   ├── playwright test --grep @smoke
│   └── playwright test --grep @regression
│
└── On Release Candidate
    ├── playwright test (full suite)
    ├── k6 run performance/load-test.js
    └── zap-full-scan.py
```

---

## 24. Regression Test Suite

### 24.1 Suite Composition

| Suite | Test Count | Run Time Target | Trigger |
|-------|-----------|-----------------|---------|
| Smoke | 12 | < 5 minutes | Every deployment |
| Core Regression | 60 | < 30 minutes | Every sprint release |
| Full Regression | 150+ | < 2 hours | Every release candidate |

### 24.2 Smoke Suite (12 Tests — Must Pass Before Any Further Testing)

| RG-ID | Scenario | Tool |
|-------|----------|------|
| RG-SMOKE-01 | Vendor can register with valid details | Playwright |
| RG-SMOKE-02 | Vendor can log in and reach dashboard | Playwright |
| RG-SMOKE-03 | Vendor can submit a valid invoice against a valid PO | Playwright |
| RG-SMOKE-04 | Submitted invoice appears in AP team review queue | Playwright |
| RG-SMOKE-05 | AP team can approve an invoice; status changes correctly | Playwright |
| RG-SMOKE-06 | AP team can reject an invoice with a reason; status changes correctly | Playwright |
| RG-SMOKE-07 | Approved invoice is forwarded to payment system | API |
| RG-SMOKE-08 | Vendor receives email notification on approval | Playwright + Mailtrap |
| RG-SMOKE-09 | Monthly report can be generated by Finance Controller | Playwright |
| RG-SMOKE-10 | Vendor cannot access AP team pages | Playwright |
| RG-SMOKE-11 | Unauthenticated user is redirected to login from any protected URL | Playwright |
| RG-SMOKE-12 | API returns 401 for any protected endpoint called without a token | API (Newman) |

### 24.3 Core Regression Suite (60 Tests — Run on Every Sprint Release)

The core regression suite includes all smoke tests plus the following additional scenarios:

**Authentication (+ 8 tests):** Duplicate email blocked, invalid credentials, account lockout, password reset, session timeout, logout invalidates session, deactivated account blocked, rate limiting enforced.

**Invoice Submission (+ 12 tests):** Non-existent PO, PO belonging to other vendor, amount exceeds balance, exact balance boundary, duplicate invoice, future-dated invoice, file attachment valid, file attachment invalid format, file attachment oversized, vendor views own invoices only, vendor cannot view other vendor's invoice, concurrent submission race condition.

**AP Workflow (+ 8 tests):** View invoice with attachment, view invoice without attachment, concurrent approval handled correctly, rejection reason mandatory, approve already-approved blocked, all actions in audit log, SLA flag visible, escalation notification triggered.

**Payment (+ 4 tests):** Forwarding failure queued, retry resolves forwarding, idempotent retry no double payment, payment status reflected in portal.

**Notifications (+ 6 tests):** AP notified on submission, vendor notified on approval, vendor notified on rejection with reason, email link requires auth, notification queued when email service down, notification content contains no sensitive financials.

**Reporting (+ 6 tests):** Report counts match DB, amounts reconcile, zero-activity report, future-month report blocked, vendor blocked from report, correct timezone boundary.

**Security (+ 6 tests):** IDOR on invoice ID, SQL injection in invoice fields, XSS in company name, role escalation via API, CSRF protection on approve endpoint, session replay rejected.

### 24.4 Full Regression Suite

Full regression adds all remaining test cases from Sections 11–19, all workflow tests (WF-01 to WF-10), full RBAC matrix, all edge cases, and all security test cases — totalling 150+ tests.

---

## 25. Entry and Exit Criteria

### 25.1 Unit Testing

| | Criteria |
|-|---------|
| **Entry** | Feature branch created; code review approved; component code complete |
| **Exit** | All unit tests passing; ≥ 80% code coverage on business logic (100% on financial calculations); no Critical/High code smells flagged in static analysis |

### 25.2 Integration Testing

| | Criteria |
|-|---------|
| **Entry** | All external service endpoints (real or mocked) are available in QA environment; API contracts documented in Swagger; test data seeded |
| **Exit** | All 12 integration test scenarios executed; no silent failures; retry/queue behaviour verified; integration test report signed off by Tech Lead |

### 25.3 System Testing (SIT)

| | Criteria |
|-|---------|
| **Entry** | Integration testing complete with zero Critical open defects; all features deployed to QA environment; test data at known baseline; all test cases reviewed and approved |
| **Exit** | 100% of test cases executed; zero Critical (S1) open defects; zero High (S2) open defects; OWASP ZAP scan passed with no High/Critical findings; all workflow tests passed; system test report signed off by QA Lead |

### 25.4 Performance Testing

| | Criteria |
|-|---------|
| **Entry** | Application deployed in a production-equivalent performance environment; performance targets confirmed with client; load test scripts reviewed; synthetic dataset loaded |
| **Exit** | All 8 performance scenarios executed within agreed targets; breaking point identified and documented; no memory leaks in endurance test; performance report reviewed by Tech Lead |

### 25.5 UAT

| | Criteria |
|-|---------|
| **Entry** | All S1/S2 system test defects resolved; UAT environment loaded with representative data; UAT participants briefed and credentialled; UAT scripts distributed |
| **Exit** | All 12 UAT scenarios executed by business participants; zero S1/S2 UAT defects open; written sign-off from Product Owner and Finance Lead; go/no-go decision documented |

### 25.6 Release / Production

| | Criteria |
|-|---------|
| **Entry** | UAT sign-off obtained; smoke suite passing in UAT/staging environment; release readiness checklist completed; rollback plan documented and rehearsed |
| **Exit** | Production deployment successful; post-deployment smoke suite passing against production; no Critical incidents within 24 hours of go-live; on-call support rostered |

---

## 26. Test Deliverables

The following documents and artefacts will be produced by the QA team:

| Deliverable | Purpose | Owner | Timing |
|-------------|---------|-------|--------|
| This QA Document (baseline) | Master test plan and reference | QA Lead | Sprint 0 |
| Updated QA Document (per-sprint revision) | Reflects confirmed requirements and new test cases | QA Lead | Each sprint |
| Test Case Repository | Detailed executable test cases in Jira/TestRail | QA Engineers | Sprint 1 onwards |
| API Test Collection (Postman) | Executable and CI-integrated API tests | QA Automation | Sprint 1 |
| Playwright E2E Test Suite | Automated regression scripts | QA Automation | Sprint 2 |
| k6 Performance Test Scripts | Load and stress test scripts | QA / DevOps | Sprint 2 |
| OWASP ZAP Scan Report | DAST security findings and resolutions | QA / Security | Each release candidate |
| Integration Test Report | Results of all integration scenarios | QA Team | Post-integration testing |
| System Test Execution Report | Test run results, defect summary, coverage metrics | QA Lead | Post-SIT |
| Performance Test Report | Load test results, capacity recommendations | QA / DevOps | Pre-release |
| UAT Sign-off Sheet | Written business acceptance | Product Owner / Finance Lead | Pre-go-live |
| Defect Summary Report | All defects by severity, status, and feature | QA Lead | End of each sprint |
| Release Readiness Checklist | Go / no-go decision artefact | QA Lead + PM | Pre-release |
| Post-Release Test Report | Smoke test results and first-24-hour incident report | QA Lead | 24 hours post go-live |

---

## 27. Risks and Mitigation Plan

### 27.1 QA-Specific Risks

| Risk-ID | Risk | Probability | Impact | Mitigation |
|---------|------|-------------|--------|-----------|
| QR-01 | Requirements not finalised before Sprint 1 — test cases cannot be written | High | High | Write test cases from confirmed requirements; flag ambiguous areas as "TBC"; revise as requirements are clarified |
| QR-02 | PO data source undefined — PO validation tests cannot be executed | High | Critical | Create a mock PO data service for QA environment; flag as a hard blocker for SIT sign-off |
| QR-03 | Payment system integration unavailable in test environment | Medium | High | Use a payment system mock/stub; document that real integration tests are deferred to a dedicated integration sprint |
| QR-04 | Email testing infrastructure not available | Medium | High | Deploy Mailhog or Mailtrap in QA environment in Sprint 1; make it a deployment pre-condition |
| QR-05 | Insufficient test data — POs and vendor accounts not seeded | High | High | Create and maintain a data-seeding script; make seeding a mandatory step in the QA environment setup runbook |
| QR-06 | Automation scripts brittle due to unstable UI selectors | Medium | Medium | Use data-testid attributes for all test selectors; QA to coordinate with developers to add these in Sprint 1 |
| QR-07 | Performance test environment not production-equivalent | Medium | High | Work with DevOps to provision a production-equivalent environment; document infrastructure differences as test caveats |
| QR-08 | UAT participants unavailable or unprepared | Medium | High | Identify and confirm UAT participants in Sprint 1; schedule UAT 2 weeks before the planned date |
| QR-09 | Security test findings require architectural rework near release | Medium | Critical | Begin security testing from Sprint 1 (OWASP ZAP in CI); do not defer security testing to pre-release |
| QR-10 | Defect volume exceeds team capacity to resolve before release | Medium | High | Implement severity-gated releases: only S1/S2 defects block go-live; S3/S4 go to post-release backlog |
| QR-11 | Concurrent approval/submission race conditions not reproducible manually | High | High | Write automated concurrency tests using k6 or custom scripts; do not rely on manual test execution for concurrency validation |
| QR-12 | Scope creep from missing requirements adding unplanned test coverage | High | Medium | Maintain RTM; assess impact of every scope change on test effort; raise change-control if coverage gap exceeds 2 days of work |

### 27.2 Financial / Business Testing Risks

| Risk-ID | Risk | Testing Mitigation |
|---------|------|--------------------|
| QR-13 | Duplicate payment due to missing idempotency on forwarding | Dedicated idempotency test (EC-PAY-001); mandatory test before any payment integration goes live |
| QR-14 | Vendor approves own invoice (segregation of duties failure) | TC-SEC-005 and TC-RBAC-002 are P1 tests; must pass before release sign-off |
| QR-15 | IDOR exposing another vendor's invoice data | TC-SEC-004 is a mandatory P1 test; verified by both manual and automated API test |
| QR-16 | Concurrent PO over-billing | EC-INV-002 requires automated concurrency test; not manually reproducible |

---

## 28. Release Readiness Checklist

This checklist must be completed and signed off before every production release. All items must be "Pass" or "N/A (with written justification)" for the release to proceed.

### 28.1 Test Execution Completeness

| # | Item | Status | Sign-off |
|---|------|--------|---------|
| 1 | All functional test cases executed | ☐ Pass / ☐ Fail / ☐ N/A | QA Lead |
| 2 | All negative test cases executed | ☐ Pass / ☐ Fail / ☐ N/A | QA Lead |
| 3 | All edge case test cases executed | ☐ Pass / ☐ Fail / ☐ N/A | QA Lead |
| 4 | All security test cases executed | ☐ Pass / ☐ Fail / ☐ N/A | Security Lead |
| 5 | All RBAC test cases executed | ☐ Pass / ☐ Fail / ☐ N/A | QA Lead |
| 6 | All API test cases executed | ☐ Pass / ☐ Fail / ☐ N/A | QA Lead |
| 7 | All workflow (E2E) test cases executed | ☐ Pass / ☐ Fail / ☐ N/A | QA Lead |
| 8 | All integration test cases executed | ☐ Pass / ☐ Fail / ☐ N/A | QA + Tech Lead |
| 9 | Performance testing completed and within targets | ☐ Pass / ☐ Fail / ☐ N/A | QA / DevOps |
| 10 | UAT completed and signed off in writing | ☐ Pass / ☐ Fail / ☐ N/A | Product Owner |

### 28.2 Defect Status

| # | Item | Status | Sign-off |
|---|------|--------|---------|
| 11 | Zero Critical (S1) defects open | ☐ Pass / ☐ Fail | QA Lead |
| 12 | Zero High (S2) defects open | ☐ Pass / ☐ Fail / ☐ Waived (written approval) | QA Lead + PO |
| 13 | All deferred Medium/Low defects documented in post-release backlog | ☐ Pass / ☐ Fail | QA Lead |
| 14 | No defect regressions on previously passing test cases | ☐ Pass / ☐ Fail | QA Lead |

### 28.3 Security and Compliance

| # | Item | Status | Sign-off |
|---|------|--------|---------|
| 15 | OWASP ZAP DAST scan completed; no High/Critical findings open | ☐ Pass / ☐ Fail | Security Lead |
| 16 | All S1 security test cases (TC-SEC-001 to TC-SEC-018) passed | ☐ Pass / ☐ Fail | Security Lead |
| 17 | IDOR test (TC-SEC-004) passed | ☐ Pass / ☐ Fail | Security Lead |
| 18 | Server-side RBAC enforcement verified on all endpoints (TC-SEC-005) | ☐ Pass / ☐ Fail | Security Lead |
| 19 | Session invalidation on logout verified (TC-SEC-006) | ☐ Pass / ☐ Fail | QA Lead |
| 20 | Audit trail captures all financial state-change actions (TC-SEC-015) | ☐ Pass / ☐ Fail | Security Lead |
| 21 | No sensitive financial data exposed in email notification bodies (TC-SEC-017) | ☐ Pass / ☐ Fail | QA Lead |
| 22 | TLS/HTTPS enforced on all endpoints (TC-SEC-013) | ☐ Pass / ☐ Fail | DevOps |

### 28.4 Financial Controls

| # | Item | Status | Sign-off |
|---|------|--------|---------|
| 23 | Duplicate invoice detection verified (TC-NEG-012) | ☐ Pass / ☐ Fail | QA Lead |
| 24 | Vendor cannot approve own invoice (TC-RBAC-002) | ☐ Pass / ☐ Fail | QA Lead |
| 25 | PO balance enforcement verified including boundary (EC-INV-001, TC-NEG-010) | ☐ Pass / ☐ Fail | QA Lead |
| 26 | Concurrent PO over-billing prevented (EC-INV-002) | ☐ Pass / ☐ Fail | QA Lead |
| 27 | Payment forwarding idempotency verified (EC-PAY-001) | ☐ Pass / ☐ Fail | QA + Tech Lead |
| 28 | Payment forwarding failure alerting verified (EC-PAY-002) | ☐ Pass / ☐ Fail | QA Lead |

### 28.5 Regression and Automation

| # | Item | Status | Sign-off |
|---|------|--------|---------|
| 29 | Smoke suite (12 tests) passing in staging/UAT environment | ☐ Pass / ☐ Fail | QA Lead |
| 30 | Full regression suite passing in QA environment | ☐ Pass / ☐ Fail | QA Lead |
| 31 | All API tests passing in CI pipeline | ☐ Pass / ☐ Fail | QA Automation |
| 32 | OWASP ZAP integrated into CI pipeline | ☐ Pass / ☐ Fail | DevOps |

### 28.6 Operational Readiness

| # | Item | Status | Sign-off |
|---|------|--------|---------|
| 33 | Rollback plan documented, tested, and rehearsed | ☐ Pass / ☐ Fail | DevOps + PM |
| 34 | On-call support rostered for go-live day and 48 hours post-release | ☐ Pass / ☐ Fail | PM |
| 35 | Monitoring and alerting configured (error rate, latency, queue depth) | ☐ Pass / ☐ Fail | DevOps |
| 36 | Log aggregation and search available in production | ☐ Pass / ☐ Fail | DevOps |
| 37 | Email notification infrastructure confirmed functional in production | ☐ Pass / ☐ Fail | DevOps |
| 38 | Payment system integration confirmed functional in production (sandbox/dry run) | ☐ Pass / ☐ Fail | Tech Lead |
| 39 | Production database backups verified and recovery tested | ☐ Pass / ☐ Fail | DevOps |
| 40 | All UAT participants notified of go-live date and post-go-live support process | ☐ Pass / ☐ Fail | PM |

### 28.7 Final Go / No-Go

| Signatory | Role | Decision | Date | Signature |
|-----------|------|---------|------|-----------|
| | QA Lead | ☐ Go / ☐ No-Go | | |
| | Product Owner | ☐ Go / ☐ No-Go | | |
| | Tech Lead | ☐ Go / ☐ No-Go | | |
| | Finance Lead | ☐ Go / ☐ No-Go | | |
| | Security Lead | ☐ Go / ☐ No-Go | | |
| | Project Manager | ☐ Go / ☐ No-Go | | |

**Unanimous Go required. A single No-Go blocks release unless a formal waiver is approved by the Product Owner and documented below.**

---

*This document is a living artefact. It must be updated when requirements change, scope is confirmed or revised, or new risks are identified. The version at the time of UAT sign-off is the baseline for release.*

*Document Owner: QA Lead | Review Cadence: Every sprint | Next Scheduled Review: Sprint 1 retrospective*
