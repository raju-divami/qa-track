# Risk Analysis
## Vendor Invoice Management Portal

**Prepared by:** Senior Solution Architect, QA Lead & Risk Analyst
**Date:** 2026-06-06
**Version:** 1.0

---

## Risk Rating Matrix

| Probability \ Impact | Low | Medium | High |
|----------------------|-----|--------|------|
| **High** | Medium Risk | High Risk | Critical Risk |
| **Medium** | Low Risk | Medium Risk | High Risk |
| **Low** | Low Risk | Low Risk | Medium Risk |

---

## Risk Categories

| Code | Category |
|------|----------|
| BR | Business Risk |
| TR | Technical Risk |
| OR | Operational Risk |
| SEC | Security Risk |
| CR | Compliance Risk |
| SR | Scalability Risk |

---

## Business Risks

---

### BR-01 — No Vendor Vetting Process Defined

| Field | Detail |
|-------|--------|
| **Risk Description** | The requirements state vendors can self-register, but there is no mention of a vetting or approval process before a vendor can submit invoices. Any person with an email address could register and submit invoices against valid PO numbers, including fraudulent actors. |
| **Category** | BR |
| **Probability** | High |
| **Impact** | High |
| **Overall Rating** | Critical |
| **Mitigation Strategy** | Define a vendor onboarding approval workflow: admin or AP team must activate a vendor account before the vendor can submit invoices. Maintain an approved vendor register. PO numbers should only be matchable by the vendor they were issued to. |
| **Recommended Testing** | Attempt to submit an invoice from a newly registered, unapproved vendor account. Verify the system blocks submission. Test that PO numbers from one vendor cannot be used by another. |

---

### BR-02 — Payment Terms and Due Dates Not Captured

| Field | Detail |
|-------|--------|
| **Risk Description** | Payment terms (e.g., Net 30, Net 60) are not mentioned in the requirements. Without capturing payment terms at the PO or vendor level, the system cannot calculate due dates, identify overdue payments, or alert finance teams before late-payment penalties are triggered. |
| **Category** | BR |
| **Probability** | High |
| **Impact** | High |
| **Overall Rating** | Critical |
| **Mitigation Strategy** | Capture payment terms on the PO or vendor profile. Calculate and display the payment due date on every approved invoice. Build an overdue alert for the AP/finance team when a payment due date is approaching. |
| **Recommended Testing** | Verify that payment due dates are correctly calculated from the approval date + payment terms. Verify alerts fire before the due date. |

---

### BR-03 — No Invoice Review SLA Defined

| Field | Detail |
|-------|--------|
| **Risk Description** | No time limit is set for how long the AP team has to review a submitted invoice. An invoice could sit unreviewed indefinitely, causing vendors to miss payment terms and potentially triggering breach-of-contract penalties against the organization. |
| **Category** | BR |
| **Probability** | Medium |
| **Impact** | High |
| **Overall Rating** | High |
| **Mitigation Strategy** | Define an SLA for invoice review (e.g., 5 business days). Build aging indicators in the AP dashboard. Escalate to a supervisor if an invoice exceeds the SLA without action. |
| **Recommended Testing** | Verify that invoices past the SLA threshold are visually flagged in the AP queue. Verify escalation notifications are triggered correctly. |

---

### BR-04 — No Dispute or Appeal Process

| Field | Detail |
|-------|--------|
| **Risk Description** | The requirements allow AP to reject invoices but define no dispute or appeal mechanism. If a vendor believes a rejection was incorrect, there is no structured process for resolution — all disputes would happen outside the system via email or phone, creating untracked liability. |
| **Category** | BR |
| **Probability** | Medium |
| **Impact** | Medium |
| **Overall Rating** | Medium |
| **Mitigation Strategy** | Define a vendor appeal process: vendor can flag a rejection for re-review, which escalates to an AP manager. All dispute correspondence should be tracked within the invoice record. |
| **Recommended Testing** | Verify vendors can flag a rejection. Verify the escalation path routes correctly to the AP manager. Verify the audit trail captures the full dispute history. |

---

### BR-05 — Double Payment Risk Due to Duplicate Invoice Submission

| Field | Detail |
|-------|--------|
| **Risk Description** | Nothing in the requirements prevents a vendor from submitting the same invoice twice — either intentionally or by accident. If the AP team approves both, the payment system could issue two payments for the same goods or services. |
| **Category** | BR |
| **Probability** | High |
| **Impact** | High |
| **Overall Rating** | Critical |
| **Mitigation Strategy** | Enforce uniqueness on invoice number per vendor per PO at the database level, not just the UI. Add a duplicate detection check before storing any invoice. Alert the AP team if a suspicious duplicate is submitted. |
| **Recommended Testing** | Submit the identical invoice number twice against the same PO. Verify the second is blocked. Submit the same invoice number against a different PO — verify system behavior. Test concurrent duplicate submission (race condition). |

---

### BR-06 — Approved Invoice Forwarded But Payment System Returns Failure Silently

| Field | Detail |
|-------|--------|
| **Risk Description** | The requirements say approved invoices are "forwarded for payment processing" but define no feedback loop. If the payment system rejects or fails to receive the invoice, and the portal has no visibility, the invoice status shows "Forwarded" while the vendor is never paid — with no one aware. |
| **Category** | BR |
| **Probability** | Medium |
| **Impact** | High |
| **Overall Rating** | High |
| **Mitigation Strategy** | Implement synchronous or asynchronous acknowledgement from the payment system. Expose a "Forwarding Failed" status. Alert the AP team on failure. Implement automated retry with a dead-letter queue for persistent failures. |
| **Recommended Testing** | Simulate payment system unavailability after invoice approval. Verify the invoice enters a "Forwarding Failed" state and an alert is raised. Verify retry logic resolves the state on recovery. |

---

## Technical Risks

---

### TR-01 — Race Condition in Concurrent Invoice Submissions Against the Same PO

| Field | Detail |
|-------|--------|
| **Risk Description** | If two invoices are submitted simultaneously against the same PO and only one fits within the remaining balance, a race condition could allow both to pass validation — resulting in the PO being overbilled. This cannot be caught by unit tests and requires database-level locking. |
| **Category** | TR |
| **Probability** | Medium |
| **Impact** | High |
| **Overall Rating** | High |
| **Mitigation Strategy** | Use database-level pessimistic or optimistic locking on the PO balance check and invoice insert as an atomic transaction. Implement idempotency keys on invoice submissions. |
| **Recommended Testing** | Concurrent load test: fire 10+ simultaneous invoice submissions against the same PO from different sessions. Verify that only the correct number are accepted and the PO balance is never exceeded. |

---

### TR-02 — No Idempotency on Payment Forwarding — Risk of Double Payment

| Field | Detail |
|-------|--------|
| **Risk Description** | If the payment forwarding request times out and the system retries, but the first request actually succeeded, the payment system could receive and process the same invoice twice. Without idempotency keys, this results in a duplicate payment. |
| **Category** | TR |
| **Probability** | Medium |
| **Impact** | High |
| **Overall Rating** | High |
| **Mitigation Strategy** | Assign a unique, immutable forwarding reference ID to each approval event. Include this ID in every forwarding request so the payment system can deduplicate. Log forwarding attempts and verify success before retrying. |
| **Recommended Testing** | Simulate a network timeout on the first forwarding attempt where the payment system did receive it. Trigger a retry. Verify the payment system deduplicates and only one payment is made. |

---

### TR-03 — No Source of Truth Defined for PO Data

| Field | Detail |
|-------|--------|
| **Risk Description** | The requirements state vendors submit invoices "against purchase orders" but define no source for PO data. If PO numbers are manually entered with no validation, fraudulent or erroneous POs will pass through. If an ERP integration is needed but not scoped, it becomes a critical missing dependency. |
| **Category** | TR |
| **Probability** | High |
| **Impact** | High |
| **Overall Rating** | Critical |
| **Mitigation Strategy** | Define the PO data source before architecture is finalized: internal database table, CSV import, or ERP API. Scope the integration or import mechanism accordingly. Never accept vendor-typed PO numbers without cross-referencing the defined source of truth. |
| **Recommended Testing** | Submit invoices against PO numbers that exist in the source of truth and verify acceptance. Submit against fabricated PO numbers and verify rejection. Test PO source synchronization latency (if integrated with ERP). |

---

### TR-04 — File Upload as a Malware Injection Vector

| Field | Detail |
|-------|--------|
| **Risk Description** | Invoice attachments are uploaded by external vendors — an untrusted population. Without virus scanning and content-type validation, an attacker could upload malicious files (ransomware, embedded macros in PDFs, XXE in XML-based formats). When an AP member opens the file, their machine is compromised. |
| **Category** | TR / SEC |
| **Probability** | Medium |
| **Impact** | High |
| **Overall Rating** | High |
| **Mitigation Strategy** | Integrate a file scanning service (e.g., ClamAV, cloud-based AV) before files are persisted to storage. Validate file type by inspecting the file's magic bytes (not just the extension). Store uploaded files in an isolated storage bucket with no execute permissions. Serve files via a signed URL with a short TTL. |
| **Recommended Testing** | Upload a known virus signature (EICAR test file). Verify it is blocked and not stored. Upload a file with a renamed extension (e.g., malware.exe renamed to invoice.pdf). Verify content-type check catches it. |

---

### TR-05 — No API Versioning Strategy

| Field | Detail |
|-------|--------|
| **Risk Description** | If no API versioning is planned, any breaking change to an API contract (e.g., renaming a field, changing a response structure) will immediately break all integrations — including the payment system, email service, and any vendor-side integrations. |
| **Category** | TR |
| **Probability** | Medium |
| **Impact** | Medium |
| **Overall Rating** | Medium |
| **Mitigation Strategy** | Implement versioned API routes from day one (e.g., /api/v1/invoices). Define a deprecation policy. Never make breaking changes to an active version. |
| **Recommended Testing** | Verify all API routes include a version prefix. Verify that a v1 consumer is not broken when a v2 endpoint is introduced. |

---

## Operational Risks

---

### OR-01 — No Escalation Path for Long-Unreviewed Invoices

| Field | Detail |
|-------|--------|
| **Risk Description** | If an AP team member is absent (sick leave, resignation) and has invoices assigned to them or in their queue, those invoices could be delayed indefinitely. There is no escalation or re-assignment mechanism defined. |
| **Category** | OR |
| **Probability** | High |
| **Impact** | Medium |
| **Overall Rating** | High |
| **Mitigation Strategy** | Implement an escalation workflow: invoices not reviewed within the SLA are escalated to an AP supervisor. Enable invoice re-assignment between AP team members. Ensure the AP queue is shared and not siloed per individual. |
| **Recommended Testing** | Simulate an invoice aged beyond the SLA threshold. Verify escalation notification is sent to supervisor. Verify re-assignment transfers the invoice correctly with a full audit trail. |

---

### OR-02 — Vendor Notification Email Address Not Kept Current

| Field | Detail |
|-------|--------|
| **Risk Description** | Vendors can change their contact email over time (e.g., staff turnover). If the system sends notifications to a stale email address, the vendor receives no information about approval or rejection — leading to missed follow-ups and delayed payments. |
| **Category** | OR |
| **Probability** | High |
| **Impact** | Medium |
| **Overall Rating** | High |
| **Mitigation Strategy** | Allow vendors to update their profile email address with re-verification. Monitor and alert on email delivery failures (bounces, undeliverable). Log the email address used for each notification in the audit record. |
| **Recommended Testing** | Update vendor email address and verify subsequent notifications go to the new address. Send a notification to a non-existent email and verify the bounce is caught and flagged. |

---

### OR-03 — Monthly Report Generation Failure at Month-End Has No Fallback

| Field | Detail |
|-------|--------|
| **Risk Description** | The monthly report is a critical finance deliverable. If the scheduled job fails (server issue, query timeout, data corruption), and there is no retry, alerting, or manual trigger mechanism, the finance team may not know the report was never generated until they go looking for it. |
| **Category** | OR |
| **Probability** | Medium |
| **Impact** | High |
| **Overall Rating** | High |
| **Mitigation Strategy** | Monitor report generation jobs with alerting on failure. Implement a manual "Re-generate Report" function for authorised users. Store each generated report so it is retrievable — never regenerate destructively over an existing report. |
| **Recommended Testing** | Simulate a scheduled job failure. Verify an alert is triggered. Verify the manual regeneration produces a consistent result. Verify a previously generated report is not overwritten on retry. |

---

### OR-04 — No Offboarding Process for Deactivated Vendors or AP Staff

| Field | Detail |
|-------|--------|
| **Risk Description** | When a vendor relationship ends or an AP team member leaves, their access must be revoked immediately. With no offboarding process defined, former users could retain active sessions and access financial data or perform actions on live invoices. |
| **Category** | OR |
| **Probability** | High |
| **Impact** | High |
| **Overall Rating** | Critical |
| **Mitigation Strategy** | Define an account deactivation process. On deactivation, immediately invalidate all active sessions for that user. Provide an admin interface for access revocation. Log all access revocation events with timestamps. |
| **Recommended Testing** | Deactivate a vendor account. Verify that their existing session is invalidated within seconds. Verify their login is blocked. Verify their in-flight invoices are unaffected but they cannot take further action. |

---

### OR-05 — No Defined Support Process for Vendor Queries

| Field | Detail |
|-------|--------|
| **Risk Description** | The requirements make no provision for how vendors get help — whether a help desk, in-portal support chat, or documentation. Vendors who encounter errors or have questions about rejected invoices will escalate directly to the AP team, which is not equipped or resourced for a support function. |
| **Category** | OR |
| **Probability** | High |
| **Impact** | Medium |
| **Overall Rating** | High |
| **Mitigation Strategy** | Define and communicate a vendor support channel before go-live. Include contextual help text on key screens. Ensure rejection emails contain enough information for vendors to self-resolve without contacting the AP team. |
| **Recommended Testing** | Review all rejection and error messages from the vendor's perspective. Verify each message is actionable and does not require AP team contact for standard scenarios. |

---

## Security Risks

---

### SEC-01 — Server-Side Authorization Not Enforced — UI-Only Protection

| Field | Detail |
|-------|--------|
| **Risk Description** | Hiding AP features in the UI is not security. If the API endpoints for approval and rejection are not protected with server-side role checks, any vendor with a valid session token can call them directly using a tool like Postman or curl — bypassing the UI entirely. |
| **Category** | SEC |
| **Probability** | High |
| **Impact** | High |
| **Overall Rating** | Critical |
| **Mitigation Strategy** | Enforce RBAC at the API/service layer, not just the frontend. Every request must be validated server-side against the authenticated user's role. Never trust role information supplied in the request body or headers by the client. |
| **Recommended Testing** | Using a vendor's JWT token, directly call PATCH /invoices/{id}/approve via an API client. Verify HTTP 403 is returned and the approval is not recorded. Attempt the same for all AP-only endpoints. |

---

### SEC-02 — Insecure Direct Object Reference (IDOR) on Invoice IDs

| Field | Detail |
|-------|--------|
| **Risk Description** | If invoice IDs are sequential integers (e.g., /invoices/1001, /invoices/1002), a vendor can enumerate other vendors' invoices by incrementing the ID in the URL. This exposes sensitive commercial data: PO values, invoice amounts, and business volumes of competitors. |
| **Category** | SEC |
| **Probability** | High |
| **Impact** | High |
| **Overall Rating** | Critical |
| **Mitigation Strategy** | Use non-guessable identifiers for invoices (UUIDs). Enforce ownership checks server-side on every GET/PATCH/DELETE request — verify that the requesting user owns or is authorized to access that specific resource regardless of the ID format. |
| **Recommended Testing** | As Vendor A, retrieve your invoice UUID. As Vendor B, attempt to GET /invoices/{vendor-A-UUID}. Verify HTTP 403 is returned. Test ID enumeration with sequential integers if not using UUIDs. |

---

### SEC-03 — No Multi-Factor Authentication for AP Team Handling Financial Approvals

| Field | Detail |
|-------|--------|
| **Risk Description** | The AP team has the authority to approve invoices that trigger real payments. If an AP team member's password is compromised (phishing, credential stuffing, data breach from another site), an attacker gains full approval power with no second factor to stop them. |
| **Category** | SEC |
| **Probability** | Medium |
| **Impact** | High |
| **Overall Rating** | High |
| **Mitigation Strategy** | Require MFA for all AP team accounts. Email/password alone is insufficient for accounts with financial approval authority. Use TOTP (authenticator app) or hardware token. |
| **Recommended Testing** | Verify that an AP team account without MFA configured cannot complete login. Verify MFA challenge is presented for every login, not just first login. Verify MFA bypass attempts are blocked and logged. |

---

### SEC-04 — No Audit Trail for Financial State-Change Actions

| Field | Detail |
|-------|--------|
| **Risk Description** | Without a tamper-evident audit log recording who approved or rejected each invoice, when, and from which IP, the organization cannot investigate fraudulent approvals, respond to audit queries, or provide evidence in a dispute. |
| **Category** | SEC / CR |
| **Probability** | High |
| **Impact** | High |
| **Overall Rating** | Critical |
| **Mitigation Strategy** | Log every state-changing action (submit, approve, reject, forward, re-assign) with: user ID, role, timestamp, invoice ID, previous state, new state, and IP address. Store audit logs in an append-only, write-protected store separate from the application database. |
| **Recommended Testing** | Perform each state-changing action and verify the audit log entry is created with all required fields. Attempt to modify or delete an audit log entry directly in the database and verify it is prevented. Verify log timestamps use a consistent timezone (UTC). |

---

### SEC-05 — Session Token Not Invalidated After Logout

| Field | Detail |
|-------|--------|
| **Risk Description** | If a JWT or session token is not server-side invalidated on logout, a token captured during the session (via network sniff, XSS, or shoulder surfing) can be replayed after the user has logged out — giving indefinite unauthorized access. |
| **Category** | SEC |
| **Probability** | Medium |
| **Impact** | High |
| **Overall Rating** | High |
| **Mitigation Strategy** | Maintain a server-side token revocation list (blacklist or Redis-based token store). On logout, add the token to the revocation list. For short-lived JWTs, ensure the expiry is genuinely short (15–30 minutes) with a refresh token flow. |
| **Recommended Testing** | Capture a valid token. Log out. Replay the captured token against a protected API endpoint. Verify HTTP 401 is returned. |

---

### SEC-06 — Sensitive Financial Data Potentially Exposed in Email Notifications

| Field | Detail |
|-------|--------|
| **Risk Description** | If invoice amounts, PO numbers, vendor names, or payment details are included in notification email bodies, this data travels through email infrastructure that may not be encrypted, may be forwarded, or may be stored by the recipient's email provider — outside the organization's control. |
| **Category** | SEC |
| **Probability** | Medium |
| **Impact** | Medium |
| **Overall Rating** | Medium |
| **Mitigation Strategy** | Limit email body content to the minimum necessary (status change, invoice reference, a portal link). Require recipients to authenticate to the portal to view full invoice details. Never include amounts, PO values, or vendor financials in the email body. |
| **Recommended Testing** | Review the content of every notification email type. Verify no sensitive financial data appears in the body. Verify the portal link requires authentication before displaying invoice details. |

---

## Compliance Risks

---

### CR-01 — No Data Retention Policy — Risk of Non-Compliance with Tax and Audit Laws

| Field | Detail |
|-------|--------|
| **Risk Description** | Most jurisdictions require financial records (invoices, POs, payments) to be retained for 5–7 years for tax and audit purposes. Without a defined retention policy, records may be deleted prematurely (storage cost reduction), or retained indefinitely without a legal basis — both are compliance violations. |
| **Category** | CR |
| **Probability** | High |
| **Impact** | High |
| **Overall Rating** | Critical |
| **Mitigation Strategy** | Define a data retention policy in collaboration with legal and finance: minimum retention period per jurisdiction, archiving strategy for records past the active period, and a scheduled purge process for records past the maximum retention period. |
| **Recommended Testing** | Verify that invoice records cannot be deleted before the defined retention period expires. Verify that records past the maximum retention period are flagged for purge. Test that the archiving process preserves data integrity and retrievability. |

---

### CR-02 — GDPR / Data Privacy Risk for Vendor Personal Data

| Field | Detail |
|-------|--------|
| **Risk Description** | Vendor registration captures personal and business data (name, email, contact details, possibly bank information). Under GDPR (and similar regulations), the organization must define a lawful basis for processing, respond to subject access requests, and honor right-to-erasure requests — none of which are mentioned in the requirements. |
| **Category** | CR |
| **Probability** | Medium |
| **Impact** | High |
| **Overall Rating** | High |
| **Mitigation Strategy** | Engage legal counsel to define the privacy notice, lawful basis, and data processing register. Build a process for subject access requests and right to erasure (balanced against retention requirements). Implement data minimization — only collect what is genuinely needed. |
| **Recommended Testing** | Verify a privacy notice is displayed and acknowledged at registration. Verify a process exists for fulfilling subject access requests. Verify that deletion requests trigger a retention-versus-erasure check before acting. |

---

### CR-03 — No Segregation of Duties — Same Person Could Submit and Approve

| Field | Detail |
|-------|--------|
| **Risk Description** | The requirements do not explicitly enforce segregation of duties. If a user somehow holds both vendor and AP roles, or if the system does not prevent an AP member from approving invoices they submitted on behalf of a vendor, the financial control is broken. This violates SOX, internal audit, and procurement compliance requirements in most organizations. |
| **Category** | CR |
| **Probability** | Medium |
| **Impact** | High |
| **Overall Rating** | High |
| **Mitigation Strategy** | Enforce at the data model level that an invoice submitter and approver can never be the same user identity. Log a compliance warning if the system detects any configuration that could allow this. Have the internal audit team review the access control matrix before go-live. |
| **Recommended Testing** | Attempt to approve an invoice using the same user account that submitted it (if that is architecturally possible). Verify the system blocks this. Verify the audit log records the submitter and approver as separate entities for every invoice. |

---

### CR-04 — No Defined Cross-Border Data Transfer Controls

| Field | Detail |
|-------|--------|
| **Risk Description** | If vendors are located in different countries (e.g., EU vendors, US-based portal), transferring their personal and financial data across jurisdictions may require specific legal mechanisms — Standard Contractual Clauses, adequacy decisions, or data residency controls. None of this is addressed. |
| **Category** | CR |
| **Probability** | Medium |
| **Impact** | Medium |
| **Overall Rating** | Medium |
| **Mitigation Strategy** | Map the geographic locations of vendors and the infrastructure hosting the portal. Engage legal to determine whether cross-border transfer mechanisms are needed. Consider data residency options if required by regulation. |
| **Recommended Testing** | Verify the cloud hosting region is documented. Verify that personal data of EU-resident vendors is processed in compliance with GDPR transfer rules. Verify vendor registration collects country of registration for jurisdictional classification. |

---

## Scalability Risks

---

### SR-01 — Monthly Report Generation Will Fail on Large Datasets

| Field | Detail |
|-------|--------|
| **Risk Description** | A monthly report query that pulls all invoices for a period is simple at launch with 100 invoices per month. At scale — thousands of vendors, hundreds of thousands of invoices — a naive query will time out, exhaust memory, or produce a file too large to serve. There is no pagination or streaming strategy mentioned. |
| **Category** | SR |
| **Probability** | High |
| **Impact** | High |
| **Overall Rating** | Critical |
| **Mitigation Strategy** | Design the report as an asynchronous background job from the start, not a synchronous web request. Use streaming or paginated database queries. Pre-aggregate invoice statistics nightly to avoid full-table scans at report generation time. |
| **Recommended Testing** | Load the database with 100,000+ invoice records. Trigger report generation and measure: job completion time, memory consumed, and file size. Verify the portal remains responsive for other users during report generation. |

---

### SR-02 — Email Notification Service Becomes a Bottleneck at Peak Load

| Field | Detail |
|-------|--------|
| **Risk Description** | At month-end, hundreds of vendors may submit invoices within a short window, each triggering multiple notifications. If notifications are sent synchronously within the request lifecycle, the submission API will be slow or fail when the email service is under load. If asynchronous but with no queue, notifications will be dropped. |
| **Category** | SR |
| **Probability** | High |
| **Impact** | Medium |
| **Overall Rating** | High |
| **Mitigation Strategy** | Decouple notification sending from the invoice submission request entirely. Publish notification events to a message queue (e.g., RabbitMQ, SQS). A separate notification worker consumes and dispatches emails asynchronously. The queue absorbs burst load. |
| **Recommended Testing** | Simulate 500 concurrent invoice submissions. Verify that submission response times are not affected by notification sending. Verify that all 500 notifications are eventually delivered, even with a backlogged queue. |

---

### SR-03 — File Storage Growth Without an Archiving or Lifecycle Strategy

| Field | Detail |
|-------|--------|
| **Risk Description** | Every invoice submission includes an attached document. Over time, this storage grows indefinitely with no archiving, tiering, or cleanup strategy. At scale, this becomes a significant cost and a performance risk if files are stored in the same hot tier as active data. |
| **Category** | SR |
| **Probability** | High |
| **Impact** | Medium |
| **Overall Rating** | High |
| **Mitigation Strategy** | Implement a storage lifecycle policy: move files older than 12 months to cold/archive storage. Enforce maximum file size per invoice. Set storage quotas per vendor if needed. Monitor total storage usage with alerts. |
| **Recommended Testing** | Verify lifecycle policy moves files to archive storage after the defined period. Verify archived files are still retrievable. Verify storage cost metrics are monitored and alertable. |

---

### SR-04 — No Database Index Strategy for Invoice List Queries

| Field | Detail |
|-------|--------|
| **Risk Description** | The AP team views all submitted invoices, potentially filtered by vendor, date, status, or PO number. Without appropriate database indexes on these columns, queries will perform full-table scans. With a large dataset, invoice list pages will be slow, degrading the AP team's productivity. |
| **Category** | SR |
| **Probability** | Medium |
| **Impact** | Medium |
| **Overall Rating** | Medium |
| **Mitigation Strategy** | Design indexes from the start based on the known query patterns: status, vendor ID, submission date, PO number. Use composite indexes for multi-column filter combinations. Implement pagination on all list endpoints — never return an unbounded result set. |
| **Recommended Testing** | With 100,000+ invoice records, run the AP invoice list query with filters for status, date range, and vendor. Measure query execution time using EXPLAIN ANALYZE. Verify all list endpoints return paginated results, not unbounded arrays. |

---

### SR-05 — No Horizontal Scaling Strategy for the Portal Application Layer

| Field | Detail |
|-------|--------|
| **Risk Description** | If the portal is deployed as a single-instance application, a traffic spike (month-end rush) or server failure will cause a full outage. There is no mention of load balancing, session stickiness requirements, or stateless design — all prerequisites for horizontal scaling. |
| **Category** | SR |
| **Probability** | Medium |
| **Impact** | High |
| **Overall Rating** | High |
| **Mitigation Strategy** | Design the application to be stateless from the start: externalize sessions to Redis, not in-process memory. Store uploaded files in shared object storage, not local disk. Deploy behind a load balancer. Test with at least two application instances running concurrently. |
| **Recommended Testing** | Deploy two application instances behind a load balancer. Submit invoices from multiple clients and verify requests are distributed. Kill one instance mid-session and verify the user session is preserved on the surviving instance. |

---

## Risk Summary Dashboard

| Risk ID | Risk Name | Category | Probability | Impact | Rating |
|---------|-----------|----------|-------------|--------|--------|
| BR-01 | No vendor vetting process | BR | High | High | **Critical** |
| BR-02 | Payment terms not captured | BR | High | High | **Critical** |
| BR-03 | No invoice review SLA | BR | Medium | High | **High** |
| BR-04 | No dispute / appeal process | BR | Medium | Medium | **Medium** |
| BR-05 | Double payment from duplicate invoices | BR | High | High | **Critical** |
| BR-06 | Silent payment forwarding failure | BR | Medium | High | **High** |
| TR-01 | Race condition on PO balance check | TR | Medium | High | **High** |
| TR-02 | No idempotency on payment forwarding | TR | Medium | High | **High** |
| TR-03 | No PO data source defined | TR | High | High | **Critical** |
| TR-04 | File upload as malware vector | TR/SEC | Medium | High | **High** |
| TR-05 | No API versioning strategy | TR | Medium | Medium | **Medium** |
| OR-01 | No escalation for unreviewed invoices | OR | High | Medium | **High** |
| OR-02 | Stale vendor email address | OR | High | Medium | **High** |
| OR-03 | Report generation failure at month-end | OR | Medium | High | **High** |
| OR-04 | No offboarding process | OR | High | High | **Critical** |
| OR-05 | No vendor support process | OR | High | Medium | **High** |
| SEC-01 | UI-only authorization (no server-side) | SEC | High | High | **Critical** |
| SEC-02 | IDOR on invoice IDs | SEC | High | High | **Critical** |
| SEC-03 | No MFA for AP team | SEC | Medium | High | **High** |
| SEC-04 | No audit trail for financial actions | SEC/CR | High | High | **Critical** |
| SEC-05 | Session not invalidated after logout | SEC | Medium | High | **High** |
| SEC-06 | Sensitive data in notification emails | SEC | Medium | Medium | **Medium** |
| CR-01 | No data retention policy | CR | High | High | **Critical** |
| CR-02 | GDPR / data privacy risk | CR | Medium | High | **High** |
| CR-03 | No segregation of duties enforcement | CR | Medium | High | **High** |
| CR-04 | Cross-border data transfer controls | CR | Medium | Medium | **Medium** |
| SR-01 | Report generation fails at scale | SR | High | High | **Critical** |
| SR-02 | Email service bottleneck at peak | SR | High | Medium | **High** |
| SR-03 | File storage growth unmanaged | SR | High | Medium | **High** |
| SR-04 | No database index strategy | SR | Medium | Medium | **Medium** |
| SR-05 | No horizontal scaling strategy | SR | Medium | High | **High** |

---

## Critical Risks — Immediate Action Required

| # | Risk | Why It Cannot Wait |
|---|------|--------------------|
| 1 | BR-01 — No vendor vetting | Fraudulent vendors can inject invoices on day one |
| 2 | BR-02 — No payment terms | Late payment penalties begin accruing from first approval |
| 3 | BR-05 — Duplicate invoice double payment | Financial loss from first duplicate submission |
| 4 | TR-03 — No PO data source | Architecture cannot be finalized without this decision |
| 5 | OR-04 — No offboarding process | Terminated access is a day-one security gap |
| 6 | SEC-01 — UI-only authorization | Any API call bypasses all UI access controls |
| 7 | SEC-02 — IDOR on invoice IDs | Vendor data cross-exposure from first deployment |
| 8 | SEC-04 — No audit trail | Irretrievable — cannot reconstruct history retroactively |
| 9 | CR-01 — No retention policy | Non-compliance accrues from the first record stored |
| 10 | SR-01 — Report fails at scale | Report design must be async from the start — retrofitting is expensive |

---

> **Risk Analyst Recommendation:** Before any sprint planning begins, hold a mandatory risk resolution workshop for the 10 Critical risks above. These are architectural decisions that, if deferred, will require expensive rework or result in live security, financial, or compliance incidents. All remaining High risks should be assigned owners and resolution deadlines before development begins.
