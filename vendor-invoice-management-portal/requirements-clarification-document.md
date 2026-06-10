# Requirements Clarification Document
## Vendor Invoice Management Portal

**Document Version:** 1.0
**Prepared By:** Business Analysis Team
**Date:** 2026-06-10
**Status:** Draft — Pending Client Review

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Requirement-wise Analysis](#2-requirement-wise-analysis)
3. [Ambiguous Requirements](#3-ambiguous-requirements)
4. [Missing Requirements](#4-missing-requirements)
5. [Assumptions Identified](#5-assumptions-identified)
6. [Clarification Questions for the Client](#6-clarification-questions-for-the-client)
7. [Recommended Business Rules](#7-recommended-business-rules)
8. [Risks if Clarifications Are Not Obtained](#8-risks-if-clarifications-are-not-obtained)
9. [Summary and Next Steps](#9-summary-and-next-steps)

---

## 1. Introduction

### Purpose

This document presents a structured analysis of the seven requirements provided for the Vendor Invoice Management Portal (VIMP). The intent is to surface ambiguities, identify gaps, and pose targeted clarification questions before development begins. Each requirement has been examined from a business, process, data, and integration perspective.

### Scope

The requirements reviewed are the seven statements from the Product Requirements Document (PRD) dated 2026-06-10. No other documentation, wireframes, or verbal briefings were available at the time of this analysis.

### Audience

- Client / Product Owner
- Project Manager
- Development and QA Leads
- UX Designer

### Document Conventions

| Symbol | Meaning |
|--------|---------|
| [HIGH] | High-priority clarification — blocks design or architecture decisions |
| [MED] | Medium-priority — affects scope or complexity estimates |
| [LOW] | Low-priority — affects fine-grained implementation details |

---

## 2. Requirement-wise Analysis

---

### REQ-01 — Vendor Registration and Login

**Stated Requirement:**
> *"Vendors can register and log in to the portal."*

**Analysis:**

This requirement covers two distinct flows — onboarding (registration) and recurring access (authentication) — but provides no detail for either.

#### Ambiguities

| # | Ambiguity | Impact |
|---|-----------|--------|
| 1.1 | Is registration self-service, or does an internal admin create vendor accounts? | Determines whether a public-facing registration form is needed |
| 1.2 | Is there an approval step between "registration submitted" and "account activated"? | Affects the vendor onboarding workflow and email notification triggers |
| 1.3 | A "vendor" may be an organisation with many contacts — can multiple users share one vendor account? | Drives the data model (1:1 vs 1:many vendor–user relationship) |
| 1.4 | What authentication method is required: username/password, SSO (e.g., Google, Microsoft Entra), or both? | Affects security architecture |
| 1.5 | Is multi-factor authentication (MFA) required? | Compliance and security posture |
| 1.6 | What data must a vendor provide during registration (legal name, tax ID, bank details, contact person)? | Determines registration form fields and validation rules |

#### Clarification Questions

**Q1.1** — Is vendor registration self-service (vendor fills a public form) or invitation-only (internal admin sends an invite link)?
*Why it matters: Self-service requires a publicly accessible registration page, email verification flow, and potentially a manual or automated vetting step. Invitation-only is simpler but places the onboarding burden on internal staff.*

**Q1.2** — After a vendor submits their registration, does an internal administrator need to approve the account before the vendor can log in?
*Why it matters: An approval gate introduces a new internal workflow and at least two additional email notifications (approval / rejection). Without clarity, this step may be omitted entirely.*

**Q1.3** — Can a single vendor organisation have multiple portal user accounts (e.g., an accounts manager and a finance director both logging in under the same vendor)?
*Why it matters: A 1:many relationship between vendors and users requires role management within a vendor account, shared invoice visibility, and potentially different permission levels per user.*

**Q1.4** — What are the password policy requirements (minimum length, complexity, expiry, history)?
*Why it matters: Password policies are often mandated by the client's information-security team or regulatory framework and cannot be retrofitted cheaply.*

**Q1.5** — Is single sign-on (SSO) integration required with any identity provider (Microsoft Entra / Azure AD, Google Workspace, Okta)?
*Why it matters: SSO integration is a significant development effort and an architectural decision that affects all authentication flows.*

**Q1.6** — Which data fields are mandatory at registration, and which (e.g., bank account details) can be completed later?
*Why it matters: Mandatory bank details at registration may deter vendors from completing sign-up; capturing them later requires a separate profile completion flow.*

---

### REQ-02 — Invoice Submission Against Purchase Orders

**Stated Requirement:**
> *"Vendors can submit invoices against purchase orders."*

**Analysis:**

This is the core transactional requirement of the portal, yet it specifies neither the data captured on an invoice nor the rules governing submission. It also implies a Purchase Order (PO) data source without explaining where POs come from.

#### Ambiguities

| # | Ambiguity | Impact |
|---|-----------|--------|
| 2.1 | Where do purchase orders originate? Are they created inside this portal, imported from an ERP, or entered manually by vendors? | Determines whether a PO management module and/or ERP integration is in scope |
| 2.2 | What fields constitute a valid invoice (invoice number, date, line items, tax, currency, payment terms)? | Drives form design and database schema |
| 2.3 | Can one invoice reference multiple POs? Can one PO have multiple invoices? | Many-to-many relationship affects data modelling |
| 2.4 | Are file attachments (scanned invoice PDF, supporting documents) required? | Affects file-storage architecture and size/format limits |
| 2.5 | Can a vendor edit or withdraw a submitted invoice before AP review begins? | Affects invoice lifecycle state machine |
| 2.6 | How is a duplicate invoice detected and handled? | Critical for financial integrity |
| 2.7 | Are multiple currencies supported, and if so, who sets the exchange rate? | Affects reporting and payment processing |
| 2.8 | How is tax (GST, VAT, withholding tax) captured and validated? | May have regulatory implications |

#### Clarification Questions

**Q2.1** — Where do purchase orders originate? Will the portal receive POs via an integration with an ERP or procurement system (e.g., SAP, Oracle, NetSuite), or will AP staff enter POs manually into the portal?
*Why it matters: If POs live in an external system, the portal needs a real-time API or batch-import mechanism to validate that a vendor-submitted invoice references a legitimate, open PO. Without this, there is no reliable way to link invoices to authorised spend.*

**Q2.2** — What is the complete list of fields required on an invoice submission form? Please indicate which are mandatory versus optional. At minimum, we expect: vendor details (auto-populated from account), PO number, invoice number, invoice date, invoice amount, tax amount, currency, line items, and payment terms. Are there additional fields?
*Why it matters: Form design, validation logic, and the database schema cannot be finalised until every required field is known.*

**Q2.3** — After submitting an invoice, can a vendor make changes to it (a) before the AP team opens it, or (b) after it has been rejected? If changes are allowed, should the system maintain a full revision history?
*Why it matters: Editability rules define the invoice state machine. Allowing edits after submission without versioning creates an audit risk.*

**Q2.4** — Is a scanned copy or PDF of the original vendor invoice required as a mandatory attachment, or is structured data entry sufficient?
*Why it matters: Mandatory attachments require a document-storage solution, virus-scanning, and size/format constraints. They also affect the AP team's review workflow.*

**Q2.5** — How should the system detect and respond to a duplicate invoice (same vendor, same invoice number, same amount)? Should it hard-block submission, warn the vendor, or flag it for AP review?
*Why it matters: Duplicate payment is one of the highest-risk outcomes in AP automation. The detection logic and response must be explicitly defined.*

**Q2.6** — Is multi-currency invoicing required? If so, which currencies must be supported, and should the system store the invoice in the original currency, the functional currency, or both?
*Why it matters: Multi-currency support adds significant complexity to reporting, payment processing, and GL posting. It is best scoped in or out explicitly at this stage.*

---

### REQ-03 — AP Team Review: Approve or Reject

**Stated Requirement:**
> *"The AP team can view, approve, or reject invoices."*

**Analysis:**

This requirement names only two terminal outcomes (approve, reject) and one team (AP). Real-world AP processes typically involve multiple roles, approval tiers based on invoice value, and intermediate states such as "on hold" or "queried."

#### Ambiguities

| # | Ambiguity | Impact |
|---|-----------|--------|
| 3.1 | Is the AP team a single homogeneous role, or are there sub-roles (reviewer, approver, finance controller)? | Determines role-based access control and multi-step workflow |
| 3.2 | Are there monetary thresholds above which additional approval levels are required (e.g., invoices >$50,000 need a Finance Director sign-off)? | Multi-tier approval is architecturally very different from single-step |
| 3.3 | Can the AP team place an invoice "on hold" or send a query back to the vendor requesting clarification? | Introduces additional states and communication workflows |
| 3.4 | Is a written reason mandatory when rejecting an invoice? | Affects the rejection form and vendor-facing messaging |
| 3.5 | Can the AP team edit invoice data (e.g., correct a line-item amount) before approving? | Raises audit and data-integrity concerns |
| 3.6 | Are SLAs defined for invoice review (e.g., AP must action within 5 business days)? | May require escalation notifications and SLA dashboards |
| 3.7 | Can invoices be assigned to a specific AP team member, or does the whole team see a shared queue? | Affects workload management and accountability |

#### Clarification Questions

**Q3.1** — Is there a single "AP team" role with equal permissions for all members, or are there distinct sub-roles (e.g., AP Clerk who can review and query, AP Supervisor who can approve, Finance Controller who must co-approve above a threshold)?
*Why it matters: Role hierarchy dictates the entire approval workflow design and the RBAC matrix. A single-role model is simple; a multi-role model requires routing logic, delegation, and potentially a workflow engine.*

**Q3.2** — Are invoice approval authority limits (monetary thresholds) required? For example, does an invoice for $100,000 require a different approver or additional sign-off compared to one for $500?
*Why it matters: Tiered approval is a fundamental process requirement in most organisations' financial controls frameworks. Omitting it may render the portal non-compliant with the client's delegation-of-authority policy.*

**Q3.3** — Can the AP team return an invoice to the vendor with a query or request for additional information, without fully rejecting it? If so, should this create a new invoice state (e.g., "Awaiting Vendor Response")?
*Why it matters: A binary approve/reject model forces AP to reject invoices that merely need a minor correction, which creates unnecessary re-submission overhead and damages vendor relationships.*

**Q3.4** — When an invoice is rejected, is the AP team required to provide a rejection reason? Should the vendor see the full reason or a summarised version?
*Why it matters: Rejection reasons are essential for vendors to correct and resubmit. They are also required for audit trails and dispute resolution.*

**Q3.5** — Is there a target SLA for invoice review (e.g., approve or reject within X business days of submission)? If so, should the system send escalation alerts when an invoice is approaching or past the SLA?
*Why it matters: SLA tracking requires timestamp recording, business-day calculation, escalation notification rules, and likely a reporting dimension.*

---

### REQ-04 — Payment Processing Forwarding

**Stated Requirement:**
> *"Approved invoices are forwarded for payment processing."*

**Analysis:**

"Forwarded" is undefined. This single word conceals what may be the most complex integration in the entire system: the handoff between the portal and the organisation's payment infrastructure.

#### Ambiguities

| # | Ambiguity | Impact |
|---|-----------|--------|
| 4.1 | What does "forwarded" mean technically — an API call to an ERP/payment system, a file export (CSV, XML, EDI), a trigger email to a finance team, or a manual export? | Determines whether a system integration is required |
| 4.2 | Which payment or ERP system is the target (SAP, Oracle Financials, NetSuite, QuickBooks, a bank payment platform)? | Every target system has a different integration method and data format |
| 4.3 | What payment data must be sent (bank account, IBAN/SWIFT, payment reference, amount, currency, payment terms due date)? | The portal must capture all data required by the downstream system |
| 4.4 | Is the payment outcome (paid, failed, returned) fed back into the portal? Should vendors be able to see payment status? | Affects invoice lifecycle states beyond "approved" |
| 4.5 | Who sets and enforces payment terms (Net 30, Net 60) — the PO, the vendor contract, or the invoice itself? | Affects due-date calculation and payment scheduling |

#### Clarification Questions

**Q4.1** — What does "forwarded for payment processing" mean in practice? Is this: (a) a real-time API call to an ERP or accounting system, (b) a scheduled batch export (CSV/XML) to a payment platform, (c) an automated email to the finance team, or (d) a manual export triggered by an AP team member?
*Why it matters: A real-time API integration is a major scope item requiring developer access to the target system, sandbox environments, and error handling. A manual export is a fraction of that effort. The answer materially changes the project estimate.*

**Q4.2** — Which downstream system receives the approved invoice data? Please name the specific product and version (e.g., SAP S/4HANA, Oracle Fusion, NetSuite, Xero, QuickBooks Online).
*Why it matters: Each system has its own API, authentication method, data format, and field mapping. This cannot be designed without knowing the target.*

**Q4.3** — Should the payment status (e.g., "Payment Scheduled," "Payment Sent," "Payment Failed") be reflected back in the portal for the AP team and/or the vendor to see?
*Why it matters: Closing the payment loop in the portal requires a bidirectional integration or a reconciliation import job, significantly increasing complexity.*

**Q4.4** — How are vendor bank/payment details managed? Are they stored in the portal, sourced from the ERP, or maintained elsewhere? Who is authorised to add or change bank details?
*Why it matters: Bank detail management is a high-fraud-risk area. The system must have strict controls around who can add or modify payment destinations, with a mandatory verification step.*

---

### REQ-05 — Email Notifications on Status Changes

**Stated Requirement:**
> *"Both parties receive email notifications on status changes."*

**Analysis:**

"Both parties" and "status changes" are undefined. The set of statuses, the notification recipients, and the email content all need specification.

#### Ambiguities

| # | Ambiguity | Impact |
|---|-----------|--------|
| 5.1 | What are all the invoice status values that trigger a notification? | Defines the notification matrix |
| 5.2 | On the AP team side, does "both parties" mean all AP team members, only the assigned reviewer, or a configured distribution list? | Determines recipient logic for each event |
| 5.3 | What is the content and format of each notification email? | Requires email template design per event type |
| 5.4 | Can users opt out of specific notification types, or are all notifications mandatory? | Affects user settings design |
| 5.5 | What email sending infrastructure is expected (client's own SMTP server, SendGrid, AWS SES, other)? | Infrastructure and deliverability planning |
| 5.6 | Are in-app notifications (bell icon, dashboard alerts) also required, or only email? | Scope boundary question |

#### Clarification Questions

**Q5.1** — Please confirm the complete set of invoice lifecycle events that should trigger an email notification. We propose the following candidate events — please confirm, remove, or add to this list:
- Invoice submitted by vendor → notify AP team
- Invoice approved → notify vendor
- Invoice rejected (with reason) → notify vendor
- Invoice queried / returned for information → notify vendor
- Payment forwarded / scheduled → notify vendor
- Invoice approaching SLA deadline → notify AP team / manager
- Account registration approved or rejected → notify vendor

*Why it matters: Each event requires a dedicated email template, recipient resolution logic, and a trigger hook in the system. Completeness at this stage prevents late-stage rework.*

**Q5.2** — When the AP team receives a notification (e.g., "new invoice submitted"), should it go to all AP team members, only the assigned reviewer, or a shared inbox / distribution list?
*Why it matters: Notifying all AP members for every new invoice will generate noise in large teams. A shared inbox or assignment-based routing is typically preferred.*

**Q5.3** — What email infrastructure should the portal use for outbound email (client's own SMTP relay, a managed email service such as SendGrid or AWS SES)?
*Why it matters: This affects deliverability, domain authentication (SPF, DKIM), and who manages bounce/unsubscribe handling.*

---

### REQ-06 — Monthly Invoice Activity Reports

**Stated Requirement:**
> *"The system generates monthly invoice activity reports."*

**Analysis:**

Neither the content, the format, the recipient, nor the delivery mechanism of the report is specified.

#### Ambiguities

| # | Ambiguity | Impact |
|---|-----------|--------|
| 6.1 | What metrics and data does the report contain? | Determines which data must be captured and aggregated |
| 6.2 | Who receives or can access the report (AP team, finance management, all vendors for their own data)? | Drives access control on the reporting module |
| 6.3 | In what format is the report produced (PDF, Excel/XLSX, CSV, interactive dashboard)? | Determines the reporting technology stack |
| 6.4 | Is the report generated and emailed automatically, or must a user trigger it? | Background job vs on-demand feature |
| 6.5 | What defines the reporting period boundary — calendar month, fiscal month, a configurable cut-off? | Affects date calculations and timezone handling |
| 6.6 | Should vendors receive a report showing only their own invoices, or is reporting an internal-only function? | Scope question |
| 6.7 | Are ad-hoc reports or custom date-range exports also required, or strictly monthly? | Significant scope expansion if yes |

#### Clarification Questions

**Q6.1** — What specific metrics should the monthly report contain? Suggested candidates:
- Total invoices submitted / approved / rejected / pending
- Total invoice value by status
- Average processing time (submission to approval)
- Top vendors by invoice volume or value
- Invoices past SLA
- Exception counts (duplicates flagged, rejections by reason)

Please confirm which are required and whether any additional metrics are needed.
*Why it matters: Report content drives what data must be stored and indexed. Metrics that are not captured during transaction processing cannot be reconstructed retrospectively.*

**Q6.2** — Is the monthly report generated and distributed automatically (e.g., emailed on the 1st of each month), or does an authorised user trigger it on demand?
*Why it matters: Automated scheduled reports require a background job scheduler, recipient configuration, and failure alerting. On-demand reports are simpler but rely on users remembering to run them.*

**Q6.3** — Should vendors be able to see a report of their own invoice activity (e.g., a self-service export from their dashboard), or is reporting strictly an internal AP function?
*Why it matters: Vendor-facing reporting doubles the scope of the reporting module and requires per-vendor data filtering and access control.*

**Q6.4** — What format is expected for the report output — PDF (for distribution), Excel/CSV (for further analysis), an on-screen dashboard, or a combination?
*Why it matters: A PDF report, a downloadable spreadsheet, and an interactive dashboard are three different implementation efforts with different tool dependencies.*

---

### REQ-07 — Authorisation and Access Control

**Stated Requirement:**
> *"Only authorized users may access the system."*

**Analysis:**

This is the broadest and least specific requirement in the PRD. It does not define what "authorised" means, how authorisation is granted or revoked, or what different users are permitted to do within the system.

#### Ambiguities

| # | Ambiguity | Impact |
|---|-----------|--------|
| 7.1 | What user roles exist and what are their permissions? | Fundamental to the entire system design |
| 7.2 | Who administers user accounts (creates, deactivates, changes roles)? Is there a system administrator role? | Operational and security requirement |
| 7.3 | Are there any data-visibility restrictions beyond role-level access (e.g., an AP team member in Region A cannot see invoices from Region B)? | May require row-level security |
| 7.4 | What happens to invoices and data when a vendor account is deactivated? | Data retention and legal-hold implications |
| 7.5 | Is an audit log of user actions (login, view, approve, reject, export) required? | Compliance and forensic requirement |
| 7.6 | Are there session management requirements (idle timeout, concurrent session limits)? | Security policy question |

#### Clarification Questions

**Q7.1** — Please provide or confirm the full list of user roles the system must support, along with the specific actions each role is permitted to perform. We propose the following as a starting point:

| Role | Proposed Permissions |
|------|---------------------|
| Vendor User | Register, log in, submit invoices, view own invoice status |
| AP Reviewer | View all invoices, query vendor, recommend approval/rejection |
| AP Approver | Approve or reject invoices (within authority limits) |
| Finance Controller | Approve high-value invoices, view all reports |
| System Administrator | Manage all user accounts and system configuration |

Is this role structure correct? Are there roles to add, remove, or rename?

**Q7.2** — Is a full audit trail required — recording who performed which action on which invoice and when? If so, is this audit log accessible within the portal, or exported to an external SIEM or compliance tool?
*Why it matters: Audit trails are a regulatory requirement in most financial systems (SOX, GDPR, local tax regulations). Retrofitting comprehensive audit logging after the system is built is expensive and disruptive.*

**Q7.3** — Are there any regulatory or compliance frameworks this system must satisfy (e.g., SOX, GDPR, ISO 27001, local tax authority requirements)?
*Why it matters: Compliance requirements often impose non-negotiable constraints on data residency, encryption standards, audit log retention periods, and user access controls. These must be designed in from the start.*

---

## 3. Ambiguous Requirements

The following table summarises the most critical ambiguities across all requirements. Items marked [HIGH] must be resolved before design begins.

| ID | Requirement | Ambiguity | Priority |
|----|-------------|-----------|----------|
| A-01 | REQ-02 | Source and validation of purchase orders — where do POs come from? | [HIGH] |
| A-02 | REQ-04 | Meaning of "forwarded" — what technical mechanism transfers approved invoices to payment processing? | [HIGH] |
| A-03 | REQ-04 | Identity of the downstream payment/ERP system | [HIGH] |
| A-04 | REQ-03 | Whether a multi-tier approval workflow (based on invoice value) is required | [HIGH] |
| A-05 | REQ-07 | Full role and permission matrix | [HIGH] |
| A-06 | REQ-01 | Whether vendor registration is self-service or invitation-only | [HIGH] |
| A-07 | REQ-03 | Whether AP team can query vendors (intermediate state between submitted and rejected) | [MED] |
| A-08 | REQ-02 | Multi-currency support requirement | [MED] |
| A-09 | REQ-06 | Report content, format, and distribution mechanism | [MED] |
| A-10 | REQ-05 | Complete notification event matrix and recipient logic | [MED] |
| A-11 | REQ-01 | Multi-user accounts per vendor organisation | [MED] |
| A-12 | REQ-02 | Duplicate invoice detection and handling | [MED] |
| A-13 | REQ-07 | Audit trail and compliance framework requirements | [MED] |
| A-14 | REQ-03 | SLA for invoice review and escalation handling | [LOW] |
| A-15 | REQ-04 | Payment status feedback loop to the portal | [LOW] |

---

## 4. Missing Requirements

The PRD does not address the following capability areas, which are typically required in a vendor invoice management system. The client should confirm whether these are in scope, out of scope, or deferred to a later phase.

| # | Missing Area | Description | Risk of Omission |
|---|-------------|-------------|-----------------|
| M-01 | **Vendor bank/payment detail management** | No requirement covers how vendor bank accounts are captured, verified, and updated. This is the primary target for payment fraud. | Financial fraud, misdirected payments |
| M-02 | **Purchase Order management** | POs are referenced in REQ-02 but there is no requirement covering how POs enter the system, who manages them, or how balances are tracked. | Invoices cannot be validated against authorised spend |
| M-03 | **Invoice dispute and query workflow** | No mechanism exists for the vendor to formally dispute a rejection or for AP to query a vendor mid-review. | Vendor dissatisfaction, email-based workarounds, no audit trail for disputes |
| M-04 | **Credit notes and invoice corrections** | No provision for a vendor to submit a credit note against a previously approved invoice. | Cannot handle overpayments or returns |
| M-05 | **User and account administration** | No requirement covers creating, deactivating, or modifying user accounts — either vendor accounts or internal AP accounts. | No operational support model |
| M-06 | **Search and filtering** | No requirement addresses how AP staff or vendors find specific invoices among potentially thousands of records. | Portal becomes unusable at scale |
| M-07 | **Data retention and archival** | No requirement covers how long invoice records and supporting documents must be retained, and what happens when the retention period expires. | Regulatory non-compliance, uncontrolled storage growth |
| M-08 | **Audit trail / activity log** | No explicit requirement for recording who did what and when across the system. | Compliance failure, inability to investigate disputes or fraud |
| M-09 | **System integration overview** | The PRD references PO validation and payment forwarding without identifying integration points, protocols, or external systems. | Scope creep, delayed delivery, cost overruns |
| M-10 | **Non-functional requirements** | No performance targets (page load time, concurrent users), availability SLA (uptime %), scalability targets, or disaster recovery objectives are stated. | System may not meet operational expectations; no basis for infrastructure sizing |
| M-11 | **Mobile / browser compatibility** | No requirement specifies whether the portal must be mobile-responsive, or which browsers it must support. | Vendor accessibility issues |
| M-12 | **Localisation and internationalisation** | No requirement addresses language support, date/number formats, or timezone handling. | Overseas vendors may face usability issues |

---

## 5. Assumptions Identified

In the absence of explicit statements, the following assumptions have been made. Each must be validated with the client.

| # | Assumption | Basis | If Wrong |
|---|-----------|-------|---------|
| AS-01 | The portal is a web application accessible via a standard browser; no native mobile app is required. | No mobile requirement stated | Native app development adds significant cost and timeline |
| AS-02 | The portal serves a single organisation (i.e., it is not a multi-tenant SaaS product). | No mention of multi-tenancy | Multi-tenancy requires complete data isolation architecture |
| AS-03 | English is the only language required for the user interface. | No localisation requirement stated | Internationalisation requires a translation framework and content management |
| AS-04 | A single functional currency is used; multi-currency is out of scope unless confirmed. | No currency requirement stated | Multi-currency adds significant complexity to reporting and payment processing |
| AS-05 | The AP team exists within the same organisation that owns the portal; they are internal employees, not third parties. | Implied by the term "AP team" | If AP is outsourced, access controls and data-sharing agreements may be required |
| AS-06 | The client has or will provision an email sending service for system notifications. | REQ-05 implies email capability | Without an email service, notifications cannot be delivered |
| AS-07 | Invoice approval follows a single-level workflow unless the client confirms tiered approval. | REQ-03 states only "approve or reject" | Tiered approval requires a workflow engine |
| AS-08 | The monthly report described in REQ-06 is for internal use only; vendors do not receive it. | "System generates" implies internal use | Vendor-facing reports increase scope |
| AS-09 | Vendors submit invoices in PDF/structured form; paper invoices are out of scope. | "Vendor submits" implies digital self-service | Paper handling would require OCR or manual data entry |
| AS-10 | The system will maintain a full audit log of all user actions for compliance purposes. | Best practice in financial systems | Regulatory audit findings if omitted |

---

## 6. Clarification Questions for the Client

The following is a consolidated, prioritised list of all clarification questions raised in Section 2. Questions are grouped by priority and functional area.

### Priority 1 — Blockers (Must Be Resolved Before Design)

| Q# | Question | Functional Area |
|----|----------|----------------|
| Q-B01 | Where do purchase orders originate, and how will the portal access or validate them? | Invoice Submission |
| Q-B02 | What does "forwarded for payment processing" mean technically — real-time API, file export, or manual trigger? | Payment |
| Q-B03 | What is the target payment or ERP system (name and version)? | Payment / Integration |
| Q-B04 | Is a multi-tier invoice approval workflow required based on invoice value or vendor type? | Approval Workflow |
| Q-B05 | Please provide or validate the complete user role and permission matrix. | Access Control |
| Q-B06 | Is vendor registration self-service (public form) or invitation-only? | Vendor Onboarding |
| Q-B07 | Are there regulatory or compliance frameworks (SOX, GDPR, local tax law) the system must satisfy? | Compliance |

### Priority 2 — High Importance (Should Be Resolved Before Development Sprint 1)

| Q# | Question | Functional Area |
|----|----------|----------------|
| Q-H01 | Can AP team members return an invoice to the vendor with a query, as a state distinct from rejection? | Approval Workflow |
| Q-H02 | Is multi-currency invoicing required? | Finance |
| Q-H03 | How is a duplicate invoice detected, and what action should the system take? | Invoice Submission |
| Q-H04 | Can a single vendor organisation have multiple portal user accounts? | Vendor Account |
| Q-H05 | How are vendor bank/payment details captured, verified, and updated? Who is authorised to change them? | Payment / Security |
| Q-H06 | Is an audit trail of all user actions (login, view, approve, export) required? | Compliance |
| Q-H07 | What is the complete set of invoice status events that trigger an email notification, and who receives each? | Notifications |

### Priority 3 — Standard (Should Be Resolved Before Development Sprint 2)

| Q# | Question | Functional Area |
|----|----------|----------------|
| Q-S01 | What fields are mandatory vs optional on the invoice submission form? | Invoice Submission |
| Q-S02 | Are file attachments (PDF invoices, supporting documents) required? | Invoice Submission |
| Q-S03 | Is there a review SLA, and should the system escalate when it is breached? | Approval Workflow |
| Q-S04 | What should the monthly report contain, who receives it, and in what format? | Reporting |
| Q-S05 | Should the monthly report be auto-generated and emailed, or triggered on demand? | Reporting |
| Q-S06 | What email infrastructure should the portal use for outbound notifications? | Notifications |
| Q-S07 | Should payment status (paid, failed) be reflected back in the portal after forwarding? | Payment |
| Q-S08 | What are the password, session timeout, and MFA policies? | Security |
| Q-S09 | Are there performance, uptime, or scalability targets? | Non-Functional |
| Q-S10 | What browsers and devices must the portal support? | Non-Functional |

---

## 7. Recommended Business Rules

Based on standard AP automation practice, the following business rules are recommended. Each should be confirmed or modified by the client before implementation.

| # | Rule | Rationale |
|---|------|-----------|
| BR-01 | An invoice may only be submitted against a PO that is (a) assigned to the submitting vendor, (b) in "Open" or "Partially Invoiced" status, and (c) has sufficient remaining balance to cover the invoice amount. | Prevents over-invoicing and invoice fraud |
| BR-02 | An invoice is rejected automatically if it duplicates an existing invoice (same vendor + same invoice number + same amount within a 12-month window). A human-reviewable flag is raised for partial matches. | Prevents duplicate payments |
| BR-03 | Invoices above a defined monetary threshold (e.g., $50,000) require secondary approval from a Finance Controller before forwarding to payment processing. | Segregation of duties; financial control |
| BR-04 | A rejected invoice may be resubmitted by the vendor, but a new invoice record is created; the original record is retained in "Rejected" status for audit purposes. | Full audit trail integrity |
| BR-05 | Vendor bank account details may only be added or modified by a designated account administrator, and every change must be confirmed via an out-of-band email verification to the vendor's registered email address before taking effect. | Prevents fraudulent redirection of payments |
| BR-06 | An invoice that has not been actioned within the defined SLA period automatically triggers an escalation notification to the AP Supervisor. | Ensures timely processing and SLA compliance |
| BR-07 | An approved invoice may not be edited or reversed within the portal; corrections must be handled via a formal credit note or adjustment note workflow. | Financial integrity and audit compliance |
| BR-08 | All user actions on an invoice (view, edit, status change, export) are recorded in an immutable audit log with timestamp and user ID. | Regulatory compliance and fraud detection |
| BR-09 | A vendor account that has been inactive for 12 months is automatically flagged for review by the system administrator; it is not deleted until explicitly confirmed. | Data retention compliance; avoids accidental data loss |
| BR-10 | All uploaded documents are scanned for malware before being stored and associated with an invoice. | Cybersecurity best practice |

---

## 8. Risks if Clarifications Are Not Obtained

| # | Risk | Likelihood | Impact | Consequence |
|---|------|-----------|--------|-------------|
| R-01 | **Wrong integration architecture built** — If the payment forwarding mechanism and target ERP system are not confirmed, the wrong integration pattern may be designed and built, requiring a full rework. | High | Critical | Cost overrun of 30–50%; delayed go-live |
| R-02 | **PO validation impossible without PO data source** — Without a defined PO source, the portal cannot validate invoices against authorised spend, making it functionally equivalent to a plain invoice submission form with no financial controls. | High | Critical | Business stakeholder rejection; significant rework |
| R-03 | **Approval workflow mismatch** — If tiered approval is required but a single-step workflow is built, the system will fail financial controls review and be rejected by the finance team. | Medium | High | System cannot go live until reworked |
| R-04 | **Non-compliance with regulatory obligations** — Failure to identify applicable regulations (SOX, GDPR, local tax law) before build may result in missing audit logs, inadequate data residency, or insufficient retention policies. | Medium | High | Regulatory penalties; mandatory rework |
| R-05 | **Payment fraud due to missing bank detail controls** — Vendor bank details are a primary vector for business email compromise (BEC) fraud. Without explicit controls, a fraudster could change payment details and redirect payments. | Low | Critical | Direct financial loss; legal liability |
| R-06 | **Notification overload or under-notification** — Without a defined notification matrix, developers will make assumptions. AP teams may be spammed with irrelevant emails, or vendors may not be notified of rejections. | High | Medium | Poor user adoption; manual follow-up processes reintroduced |
| R-07 | **Report unusable at launch** — If report content and format are not confirmed, the generated report may not meet management's reporting needs, requiring redesign post-launch. | Medium | Medium | Delayed stakeholder sign-off |
| R-08 | **Scope creep from missing requirements** — The 12 missing requirement areas identified in Section 4 represent potential mid-project additions, each with cost and timeline implications. | High | High | Budget and timeline overrun; team morale impact |
| R-09 | **System unusable at scale without search/filter** — If no search or filtering capability is built, AP staff will be unable to locate specific invoices as volume grows, leading to portal abandonment. | Medium | Medium | Users revert to email-based invoice management |
| R-10 | **Data loss or legal liability from undefined retention policy** — Without explicit data retention rules, the system may delete records needed for tax audits or retain records beyond legally permitted periods. | Low | High | Regulatory penalties; legal exposure |

---

## 9. Summary and Next Steps

### Summary of Findings

The PRD in its current form provides a high-level outline of the Vendor Invoice Management Portal's intended purpose. However, it is insufficient to proceed with design or development. The analysis has identified:

- **15 material ambiguities** across all seven requirements, of which 5 are development blockers
- **12 missing requirement areas**, including critical capabilities such as PO management, audit logging, vendor bank detail controls, and system integrations
- **10 unvalidated assumptions** that could significantly alter scope if incorrect
- **28 clarification questions** to be resolved with the client, prioritised into three tiers
- **10 recommended business rules** drawn from AP automation best practice, pending client confirmation
- **10 material risks** that will materialise if clarifications are not obtained before design begins

### Recommended Next Steps

The following actions are recommended in sequence:

**Step 1 — Requirements Workshop (Target: within 5 business days)**
Schedule a structured 2–3 hour workshop with the Product Owner, AP team lead, Finance Controller, and IT/Systems team. Work through Priority 1 and Priority 2 clarification questions. Record decisions in writing.

**Step 2 — Integration Discovery (Concurrent with Step 1)**
Engage the client's IT team to document the target ERP/payment system, available APIs, data formats, and sandbox environments. This is the longest-lead-time item and must begin immediately.

**Step 3 — Revised PRD and Process Flow Diagrams (Target: within 10 business days)**
Incorporate workshop outputs into an updated PRD. Produce swimlane process flow diagrams for: (a) vendor onboarding, (b) invoice submission and approval, (c) payment forwarding, and (d) reporting. Circulate for sign-off.

**Step 4 — Role and Permission Matrix Sign-off (Target: within 10 business days)**
Circulate the proposed role matrix (Section 6, Q-B05) to stakeholders for formal sign-off. This document will become the basis for the access control specification.

**Step 5 — Compliance Review (Target: within 10 business days)**
Request a brief from the client's legal/compliance team to identify applicable regulatory obligations. These will be incorporated as non-negotiable constraints in the technical specification.

**Step 6 — Updated Estimation (Target: within 15 business days)**
Once Sections 2–5 are resolved, re-estimate effort and timeline based on the confirmed scope. Present a revised project plan for client approval before development commences.

---

*This document was prepared to facilitate requirements clarification and does not constitute a final specification. All content is subject to revision following client responses to the clarification questions raised herein.*

*Document Owner: Business Analysis Team | Next Review: Upon receipt of client responses*
