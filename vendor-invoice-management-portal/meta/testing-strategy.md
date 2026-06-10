# Testing Strategy
## Vendor Invoice Management Portal

**Prepared by:** Test Architect
**Date:** 2026-06-06
**Version:** 1.0

---

## Testing Pyramid Overview

```
                    ┌──────────┐
                    │   UAT    │  ← Business validation
                  ┌─┴──────────┴─┐
                  │   E2E / UI   │  ← Workflow flows
                ┌─┴──────────────┴─┐
                │  Integration/API  │  ← Service contracts
              ┌─┴──────────────────┴─┐
              │    Unit / Component   │  ← Logic & validation
              └───────────────────────┘
```

---

## 1. Functional Testing

### Scope
Validates that every stated requirement behaves correctly under normal operating conditions. Covers the full set of user-facing features: vendor registration, login, invoice submission, AP review, payment forwarding, notifications, and report generation.

### Test Scenarios

| ID | Scenario | Feature |
|----|----------|---------|
| FT-01 | Vendor completes registration with all valid mandatory fields | Registration |
| FT-02 | Vendor logs in with valid credentials and is redirected to the dashboard | Login |
| FT-03 | Vendor submits a valid invoice against an existing PO with a supporting document | Invoice Submission |
| FT-04 | Vendor views the status of a previously submitted invoice | Invoice Status |
| FT-05 | AP team member logs in and views the list of all submitted invoices | Invoice View |
| FT-06 | AP team member approves a valid submitted invoice | Approval |
| FT-07 | AP team member rejects an invoice with a rejection reason | Rejection |
| FT-08 | Approved invoice status changes to "Forwarded for Payment" | Payment Forwarding |
| FT-09 | Vendor receives an email notification when invoice is approved | Notifications |
| FT-10 | AP team receives an email notification when a new invoice is submitted | Notifications |
| FT-11 | Monthly report is generated and lists all invoice activity for the period | Reporting |
| FT-12 | User without a valid session cannot access any protected page | Authorization |
| FT-13 | Vendor cannot access AP team pages and vice versa | Role Separation |
| FT-14 | Vendor submits an invoice against a PO with a remaining balance of exactly the invoice amount | Boundary |
| FT-15 | Report shows zero activity for a month with no invoice submissions | Reporting Edge Case |

### Entry Criteria
- All 7 requirements are documented and signed off
- Development environment is stable and deployed
- Test data (vendors, POs, AP accounts) is prepared
- Test cases are reviewed and approved

### Exit Criteria
- 100% of test cases executed
- Zero open Critical or High defects
- All edge cases from FT-14 and FT-15 verified
- Test execution report reviewed and signed off

### Risks Covered
- Incorrect form validation allowing bad data into the system
- Feature gaps where a stated requirement is not implemented
- UI inconsistencies causing usability failures for vendors or AP team

---

## 2. Integration Testing

### Scope
Validates the data flow and contract between the portal's internal services and any external systems it depends on: the email notification service, the payment processing system, the file storage service, and the PO data source.

### Test Scenarios

| ID | Scenario | Integration Point |
|----|----------|-------------------|
| IT-01 | Invoice submission triggers a record creation in the invoice database and a notification event on the message queue | Portal → Database + Queue |
| IT-02 | Approved invoice payload is correctly structured and successfully received by the payment processing system | Portal → Payment System |
| IT-03 | Email notification service receives the correct event payload and sends to the correct recipient | Portal → Email Service |
| IT-04 | File upload stores the document in the storage service and the correct file URL is linked to the invoice record | Portal → File Storage |
| IT-05 | PO validation query returns the correct vendor, balance, and status from the PO data source | Portal → PO Data Source |
| IT-06 | Payment system returns a success response and portal updates invoice status to "Forwarded" | Payment System → Portal |
| IT-07 | Payment system is unavailable — portal queues the invoice and retries on recovery | Portal Retry Logic |
| IT-08 | Email service is unavailable — portal queues the notification and retries; invoice workflow is not blocked | Email Resilience |
| IT-09 | File storage service is unavailable — invoice submission fails gracefully with no partial record saved | Storage Resilience |
| IT-10 | PO data source returns a timeout — portal displays a user-friendly error and does not accept the submission | PO Source Resilience |

### Entry Criteria
- All integrated services have stable endpoints (real or stubbed)
- API contracts for all integrations are documented
- Message queue and retry configuration is deployed

### Exit Criteria
- All integration paths tested including happy path and failure modes
- No data loss or orphaned records under any failure scenario
- Retry and queue behaviour verified under simulated outages
- Integration test report signed off by the Tech Lead

### Risks Covered
- Data lost between services due to broken contracts
- Silent failures where an integration call fails but the portal shows success
- Cascading failures where one service outage brings down the whole workflow

---

## 3. API Testing

### Scope
Validates every API endpoint for correct request/response structure, HTTP status codes, authentication enforcement, input validation, and error handling. Tested independently of the UI layer.

### Test Scenarios

| ID | Endpoint | Scenario | Expected HTTP Status |
|----|----------|----------|----------------------|
| AT-01 | POST /auth/register | Valid registration payload | 201 Created |
| AT-02 | POST /auth/register | Duplicate email | 409 Conflict |
| AT-03 | POST /auth/register | Missing mandatory field | 400 Bad Request |
| AT-04 | POST /auth/login | Valid credentials | 200 OK + token |
| AT-05 | POST /auth/login | Invalid credentials | 401 Unauthorized |
| AT-06 | POST /invoices | Valid invoice with all fields | 201 Created |
| AT-07 | POST /invoices | Invoice amount exceeds PO balance | 422 Unprocessable Entity |
| AT-08 | POST /invoices | No auth token in header | 401 Unauthorized |
| AT-09 | POST /invoices | AP team token used (wrong role) | 403 Forbidden |
| AT-10 | GET /invoices/{id} | Vendor accesses another vendor's invoice ID | 403 Forbidden |
| AT-11 | GET /invoices | AP team retrieves full invoice list | 200 OK with correct pagination |
| AT-12 | PATCH /invoices/{id}/approve | Valid approval by AP member | 200 OK |
| AT-13 | PATCH /invoices/{id}/approve | Vendor token used | 403 Forbidden |
| AT-14 | PATCH /invoices/{id}/approve | Invoice already approved | 409 Conflict |
| AT-15 | PATCH /invoices/{id}/reject | Missing rejection reason | 400 Bad Request |
| AT-16 | GET /reports/monthly?month=2026-05 | Valid month, AP role | 200 OK with report data |
| AT-17 | GET /reports/monthly?month=2026-05 | Vendor token used | 403 Forbidden |
| AT-18 | GET /reports/monthly?month=2027-01 | Future month | 400 Bad Request |
| AT-19 | POST /invoices | SQL injection in invoice number field | 400 Bad Request, no DB error exposed |
| AT-20 | Any endpoint | Expired JWT token | 401 Unauthorized |

### Entry Criteria
- API documentation (OpenAPI/Swagger) is available and up to date
- Test environment with seeded data is accessible
- API testing tool (Postman / RestAssured / similar) is configured

### Exit Criteria
- All endpoints tested for happy path, negative path, and auth enforcement
- Zero endpoints returning 500 for any expected input
- No endpoint returning data for an unauthorized role
- API test collection committed to the repository and runnable in CI

### Risks Covered
- UI-bypass attacks hitting API endpoints directly
- Missing or inconsistent server-side validation
- Incorrect HTTP status codes causing client-side mishandling
- Authentication and authorization gaps not visible through the UI

---

## 4. Security Testing

### Scope
Validates that the system is resistant to common attack vectors, enforces least-privilege access, protects sensitive data in transit and at rest, and produces an audit trail for all financial actions.

### Test Scenarios

| ID | Category | Scenario | Expected Result |
|----|----------|----------|-----------------|
| ST-01 | Injection | SQL injection in all input fields | Input sanitized; no DB error returned |
| ST-02 | Injection | XSS payload stored via registration or invoice fields | Script not executed on any page where data is displayed |
| ST-03 | Auth | Unauthenticated access to protected routes | Redirect to login; HTTP 401 |
| ST-04 | Auth | Vendor accesses AP routes via URL manipulation | HTTP 403; attempt logged |
| ST-05 | Auth | AP member accesses another AP member's assigned invoices (if scoped) | HTTP 403 |
| ST-06 | Auth | Session remains valid after logout (browser back button) | Session invalidated; redirected to login |
| ST-07 | Auth | Replay of a captured authentication token after logout | HTTP 401; token blacklisted |
| ST-08 | Auth | Privilege escalation via parameter tampering (adding role=admin to request) | Server ignores; role always resolved server-side |
| ST-09 | Brute Force | 10+ rapid login attempts on the same account | Account locked; HTTP 429 returned |
| ST-10 | File Upload | Upload of a file containing a virus/malware signature | File rejected; upload blocked; security event logged |
| ST-11 | File Upload | Upload of a file with a disguised extension (e.g., malware.pdf renamed) | File type validated by content, not extension; rejected |
| ST-12 | Data Exposure | API error response contains stack trace or DB schema details | Only a generic error message is returned |
| ST-13 | Data Exposure | Invoice links in emails accessible without authentication | Link requires login; data not exposed without valid session |
| ST-14 | Transport | HTTP (non-HTTPS) request to any endpoint | Redirected to HTTPS or rejected |
| ST-15 | Audit | Approve, reject, and submit actions generate immutable audit log entries | Each action logged with user ID, timestamp, and invoice ID |
| ST-16 | CSRF | Cross-site request forgery against approve/reject endpoints | CSRF token validated; forged request rejected |
| ST-17 | IDOR | Vendor changes invoice ID in URL or request body to access others' records | Ownership check enforced server-side; HTTP 403 |

### Entry Criteria
- Application deployed in a security test environment
- OWASP Top 10 test checklist prepared
- DAST tool (e.g., OWASP ZAP, Burp Suite) configured against the test environment
- Penetration test scope agreed with stakeholders

### Exit Criteria
- All Critical and High OWASP Top 10 vulnerabilities verified as remediated
- DAST scan completed with no High or Critical findings open
- Audit log verified for all financial state-change actions
- Security test sign-off from the Security Lead

### Risks Covered
- Financial data breach via injection or unauthorized access
- Fraudulent invoice approval via privilege escalation
- Double payment via request replay
- Regulatory non-compliance due to missing audit trail

---

## 5. Role-Based Access Testing

### Scope
Validates that every feature, page, and API endpoint is accessible only to the roles for which it is intended. Tests both positive access (correct role can perform action) and negative access (wrong role is blocked).

### Role Matrix

| Feature / Action | Vendor | AP Team Member | Unauthenticated |
|-----------------|--------|----------------|-----------------|
| Register | ✅ | ❌ | ✅ (public) |
| Log in | ✅ | ✅ | ✅ (public) |
| Submit invoice | ✅ | ❌ | ❌ |
| View own invoices | ✅ | ❌ | ❌ |
| View all invoices | ❌ | ✅ | ❌ |
| Approve invoice | ❌ | ✅ | ❌ |
| Reject invoice | ❌ | ✅ | ❌ |
| View monthly report | ❌ | ✅ | ❌ |
| Manage users | ❌ | ❌ (Admin only) | ❌ |

### Test Scenarios

| ID | Role | Action | Expected Result |
|----|------|--------|-----------------|
| RB-01 | Vendor | Accesses the AP invoice review dashboard | HTTP 403; page not rendered |
| RB-02 | Vendor | Calls PATCH /invoices/{id}/approve | HTTP 403 |
| RB-03 | Vendor | Calls GET /reports/monthly | HTTP 403 |
| RB-04 | Vendor | Calls GET /invoices (all invoices list) | HTTP 403 or only own invoices returned |
| RB-05 | AP Member | Calls POST /invoices (submit invoice) | HTTP 403 |
| RB-06 | AP Member | Accesses vendor registration page | HTTP 403 or redirect |
| RB-07 | AP Member | Approves a valid invoice | 200 OK; status updated |
| RB-08 | Unauthenticated | Accesses /invoices | Redirect to /login |
| RB-09 | Unauthenticated | Calls any API endpoint | HTTP 401 |
| RB-10 | Vendor | Views another vendor's invoice by ID | HTTP 403 |
| RB-11 | Vendor | Calls API with AP team's JWT | Own-role enforced; AP token not accepted for vendor actions |
| RB-12 | Any Role | Sends request with a manipulated role claim in JWT | Server-side role resolution used; claim ignored |

### Entry Criteria
- Test accounts created for each role
- Role-to-permission matrix agreed and documented
- All API endpoints mapped to their required roles

### Exit Criteria
- Every role tested against every feature it should and should not access
- Zero cases where a role can access or perform an action outside its permission set
- Role matrix signed off by the Product Owner and Security Lead

### Risks Covered
- Vendor submitting and self-approving invoices
- AP team bypassing segregation of duties
- Privilege escalation via token or parameter manipulation

---

## 6. Workflow Testing (End-to-End)

### Scope
Tests the complete business process flows from start to finish across all actors, validating that the system correctly transitions an invoice through every state in its lifecycle.

### Invoice Lifecycle State Machine

```
[Draft] → [Submitted] → [Under Review] → [Approved] → [Forwarded] → [Paid]
                                      ↘ [Rejected] → [Resubmitted] → ...
```

### Test Scenarios

| ID | Workflow | Steps | Expected Outcome |
|----|----------|-------|-----------------|
| WF-01 | Happy Path — Approval | Vendor registers → logs in → submits invoice → AP approves → invoice forwarded for payment → both parties notified | Invoice reaches "Forwarded" status; both parties receive correct notifications |
| WF-02 | Happy Path — Rejection & Resubmission | Vendor submits → AP rejects with reason → vendor receives rejection email → vendor corrects and resubmits → AP approves | Resubmitted invoice approved; no data from original rejected invoice bleeds into the new submission |
| WF-03 | Partial PO Billing | Vendor submits 3 partial invoices against one PO summing to exact PO value → 4th submission blocked | First 3 accepted; 4th blocked with balance error |
| WF-04 | Concurrent Approval Attempt | Two AP members simultaneously open and act on the same invoice | First action succeeds; second receives a conflict error; invoice in correct final state |
| WF-05 | Payment Forwarding Failure & Recovery | AP approves invoice → payment system is down → system queues → payment system recovers → invoice forwarded automatically | Invoice eventually reaches "Forwarded" status; no manual intervention needed |
| WF-06 | Vendor Account Deactivation Mid-Workflow | Vendor submits invoice → admin deactivates vendor → AP approves invoice | Invoice workflow completes; deactivated vendor cannot log in; approval is still valid |
| WF-07 | Session Expiry Mid-Submission | Vendor fills invoice form → session expires → vendor logs in again | Vendor is redirected to login; after login, returns to invoice; form data preserved where possible |
| WF-08 | Full Month Cycle | Invoices submitted, approved, rejected across a full calendar month → monthly report generated | Report accurately reflects all invoice counts, amounts, and statuses for the period |
| WF-09 | Rapid Status Changes | Invoice submitted → AP approves → AP revokes → AP re-approves | Each state transition is correctly logged; final state is "Approved"; notifications sent for each change |
| WF-10 | Zero Activity Report | No invoices submitted in a month → report generated | Report generated successfully; shows zero activity; no errors |

### Entry Criteria
- Functional testing complete with no blocking defects
- All integrations (email, payment, storage) are connected in the test environment
- Full test data set available (multiple vendors, POs at various balance levels, AP accounts)

### Exit Criteria
- All 10 workflow scenarios executed and passed
- Each scenario verified end-to-end including notification delivery and status persistence
- No workflow leaves the system in an inconsistent state

### Risks Covered
- Invoice stuck in a state with no valid transition path
- Notifications fired at wrong stages or to wrong recipients
- Data inconsistency between invoice status and actual payment state

---

## 7. Performance Testing

### Scope
Validates that the system performs within acceptable response time and throughput thresholds under expected and peak load. Covers load testing, stress testing, and endurance testing for the highest-traffic operations.

### Performance Targets (baseline — to be confirmed with client)

| Operation | Target Response Time (p95) | Throughput Target |
|-----------|---------------------------|-------------------|
| Login | < 1s | 200 req/min |
| Invoice Submission | < 2s | 100 req/min |
| Invoice List (AP) | < 2s | 50 req/min |
| Invoice Approval | < 1.5s | 50 req/min |
| Monthly Report Generation | < 10s | 5 req/min |
| File Upload (5 MB) | < 5s | 50 req/min |

### Test Scenarios

| ID | Type | Scenario | Success Criterion |
|----|------|----------|-------------------|
| PT-01 | Load | 200 vendors submit invoices concurrently during simulated month-end peak | All submissions complete; p95 response time within target; zero 5xx errors |
| PT-02 | Load | 50 AP members browse the invoice list simultaneously | List loads within target; correct results returned; no timeout errors |
| PT-03 | Stress | Ramp users beyond expected peak to find the breaking point | Identify the maximum concurrent users before degradation; system recovers on load reduction |
| PT-04 | Spike | Sudden burst of 500 concurrent invoice submissions (simulating a month-end deadline rush) | System handles the spike gracefully; queues requests if needed; no data loss |
| PT-05 | Endurance | Sustained load of 100 concurrent users for 4 hours | No memory leaks; response times remain stable throughout; no crash or restart |
| PT-06 | Volume | Monthly report generated over a dataset of 10,000+ invoices | Report generated within 10 seconds; no timeout; complete and accurate data |
| PT-07 | Concurrency | 10 vendors submit invoices against the same PO simultaneously | Correct balance enforcement; no double-booking; all responses correct |
| PT-08 | File Upload | 50 concurrent file uploads of 10 MB each | All uploads succeed within target; no storage corruption |

### Entry Criteria
- Application deployed in a production-equivalent environment
- Performance targets agreed with client and product owner
- Test data representing 6 months of expected volume is loaded
- Load testing tool (k6, JMeter, or Gatling) scripts prepared and reviewed

### Exit Criteria
- All scenarios executed with results within agreed performance targets
- Breaking point identified and documented for infrastructure planning
- No memory leaks or resource exhaustion found during endurance test
- Performance test report reviewed by Tech Lead and Product Owner

### Risks Covered
- System crash at month-end peak when all vendors rush to submit
- Report generation timeout causing month-end finance reconciliation failure
- Concurrency bugs only visible under real load that unit tests cannot catch

---

## 8. Regression Testing

### Scope
Ensures that new code changes, bug fixes, or feature additions do not break previously working functionality. Executed on every sprint release and before every production deployment.

### Regression Suite Composition

| Suite | Coverage | Execution Frequency | Run Time Target |
|-------|----------|---------------------|-----------------|
| Smoke | Core happy paths (10 tests) | Every deployment | < 5 minutes |
| Core Regression | All functional flows (60 tests) | Every sprint release | < 30 minutes |
| Full Regression | All test types including security and edge cases (150+ tests) | Before major release | < 2 hours |

### Test Scenarios (Core Regression — minimum set)

| ID | Scenario |
|----|----------|
| RG-01 | Vendor can register, verify email, and log in |
| RG-02 | Vendor can submit a valid invoice with document attachment |
| RG-03 | AP team can view the submitted invoice |
| RG-04 | AP team can approve an invoice; status updates correctly |
| RG-05 | AP team can reject an invoice with a reason; status updates correctly |
| RG-06 | Approved invoice is forwarded to payment system |
| RG-07 | Vendor receives email on approval; AP receives email on new submission |
| RG-08 | Monthly report generates correctly with current test data |
| RG-09 | Vendor cannot access AP pages |
| RG-10 | Unauthenticated user is redirected to login |
| RG-11 | Duplicate invoice submission is blocked |
| RG-12 | Invoice exceeding PO balance is rejected |

### Entry Criteria
- A new build is deployed to the test environment
- Smoke suite passes before core regression begins
- Test data is reset to a known baseline state

### Exit Criteria
- Zero new defects introduced on previously passing test cases
- Any failing test investigated and either a defect raised or the test updated with justification
- Regression report attached to the sprint release notes

### Risks Covered
- Feature regressions introduced by code changes without test coverage
- Integration breakage from dependency updates
- Configuration drift between environments causing intermittent failures

---

## 9. UAT Testing (User Acceptance Testing)

### Scope
Validates that the system meets the business needs of real end users in a production-like environment. Conducted with actual business stakeholders — vendor representatives and AP team members — before go-live sign-off.

### UAT Participants

| Role | Participant | Responsibility |
|------|-------------|----------------|
| Vendor | 2–3 actual vendor representatives | Execute vendor-facing scenarios |
| AP Team Member | 2–3 AP staff | Execute AP review and approval scenarios |
| Finance Lead | 1 senior finance stakeholder | Validate reporting and payment forwarding |
| Product Owner | 1 PO | Facilitate sessions and document sign-off |

### Test Scenarios

| ID | Scenario | Performed By |
|----|----------|-------------|
| UAT-01 | Vendor registers on the portal and receives a welcome/verification email | Vendor |
| UAT-02 | Vendor logs in, navigates the dashboard, and submits a real invoice against a provided test PO | Vendor |
| UAT-03 | Vendor views the submitted invoice and confirms the status is correct | Vendor |
| UAT-04 | Vendor receives an email notification and confirms the content is clear and actionable | Vendor |
| UAT-05 | AP team member logs in and finds the submitted invoice in the queue | AP Team |
| UAT-06 | AP team member reviews the invoice details and approves it | AP Team |
| UAT-07 | AP team member rejects a second invoice and the vendor receives the rejection reason | AP Team |
| UAT-08 | Vendor confirms the rejection email contains a clear reason and understands what to fix | Vendor |
| UAT-09 | Finance lead verifies that the approved invoice appears correctly in the payment processing queue | Finance Lead |
| UAT-10 | Finance lead views the monthly activity report and confirms it contains the expected data | Finance Lead |
| UAT-11 | AP team confirms they cannot access vendor-only features, and vendor confirms they cannot access AP features | Both |
| UAT-12 | Vendor attempts to submit against an invalid PO and receives a clear error message | Vendor |

### Entry Criteria
- All Critical and High functional defects resolved
- UAT environment loaded with representative test data
- UAT participants briefed on scenarios and provided with test credentials
- UAT test scripts and sign-off sheets prepared

### Exit Criteria
- All UAT scenarios executed by business participants
- Zero Critical or High defects raised during UAT remain open
- Business sign-off obtained in writing from the Product Owner and Finance Lead
- Go/No-Go decision recorded and communicated to all stakeholders

### Risks Covered
- System that passes technical testing but fails real business usage
- Missing usability issues only visible to actual end users
- Business process gaps not covered by the documented requirements

---

## 10. Automation Opportunities

### Automation Strategy

| Layer | Tool Recommendation | Ownership |
|-------|---------------------|-----------|
| API Testing | Postman (Newman) / RestAssured | QA Engineers |
| UI / E2E Testing | Playwright / Cypress | QA Automation Engineers |
| Performance Testing | k6 / Gatling | QA / DevOps |
| Security Scanning | OWASP ZAP (CI integration) | Security / DevOps |
| Unit & Component | Jest / JUnit (framework-dependent) | Developers |
| CI Orchestration | GitHub Actions / Jenkins | DevOps |

### Candidates for Automation

| Priority | Test ID(s) | Scenario | Reason for Automation |
|----------|------------|----------|----------------------|
| P1 — Immediate | RG-01 to RG-12 | Full regression suite | Runs on every deployment; manual execution is too slow |
| P1 — Immediate | AT-01 to AT-20 | All API endpoint tests | Fast, reliable, no UI dependency; ideal for CI pipeline |
| P1 — Immediate | ST-01, ST-02, ST-03, ST-04 | OWASP injection and auth tests | Security regressions must be caught automatically on every build |
| P2 — Sprint 2 | WF-01, WF-02, WF-03 | Core end-to-end workflow tests | High value; catches cross-service integration regressions |
| P2 — Sprint 2 | PT-01 to PT-08 | Performance test suite | Load tests must be scripted; cannot be run manually at scale |
| P3 — Later | RB-01 to RB-12 | Full role-based access matrix | Repetitive; high confidence when automated |
| P3 — Later | FT-13, FT-14, FT-15 | Boundary and edge case functional tests | Stable tests that rarely change; good ROI for automation |

### What Should Stay Manual

| Test Type | Reason |
|-----------|--------|
| UAT scenarios | Requires human business judgment and real user perspective |
| Exploratory testing | Unscripted discovery of defects not covered by known scenarios |
| Usability / UX review | Subjective assessment not automatable |
| New feature smoke testing | First pass on new functionality before stable selectors exist |

### CI/CD Integration Plan

```
On every Pull Request:
  └── Unit tests (developer-owned)
  └── API tests (Postman/Newman)
  └── OWASP ZAP baseline scan

On every Sprint Deployment:
  └── Smoke suite (Playwright — 5 mins)
  └── Core regression suite (Playwright — 30 mins)

On every Release Candidate:
  └── Full regression suite (Playwright — 2 hrs)
  └── Performance suite (k6 — 1 hr)
  └── Full DAST security scan (OWASP ZAP — 1 hr)
```

---

## Summary

| Testing Type | # Scenarios | Automation | When Run |
|-------------|-------------|------------|----------|
| Functional | 15 | Partial | Per sprint |
| Integration | 10 | Full | Per sprint |
| API | 20 | Full | Every PR |
| Security | 17 | Partial (DAST) | Every release |
| Role-Based Access | 12 | Full | Every release |
| Workflow (E2E) | 10 | Partial | Per sprint |
| Performance | 8 | Full | Per release |
| Regression | 12 (core) / 150+ (full) | Full | Every deployment |
| UAT | 12 | Manual only | Pre-go-live |
| **Total Coverage** | **116+** | | |

---

> **Test Architect Recommendation:** Invest in API test automation in Sprint 1 — it provides the highest return on investment and is independent of UI stability. Layer UI automation from Sprint 2 once UI components are stable. Do not defer security scanning — integrate OWASP ZAP into the CI pipeline from day one, not as a pre-release afterthought.
