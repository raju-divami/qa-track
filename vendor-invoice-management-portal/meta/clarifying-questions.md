# Clarifying Questions — Requirements Workshop
## Vendor Invoice Management Portal

**Date:** 2026-06-06
**Purpose:** Pre-workshop preparation to resolve open questions before development begins

---

## 1. User Management

---

**Q1.1 — How many user roles exist in the system, and what are their exact permissions?**

- **Why it matters:** The requirements mention vendors and the AP team, but do not define roles, sub-roles, or permission boundaries. Without this, developers will make assumptions about who can do what.
- **Risk if unanswered:** Developers build a flat permission model. Business later requests role hierarchy (e.g., AP Clerk vs. AP Manager), requiring a significant rework of the access control layer.

---

**Q1.2 — Can a single vendor organization have multiple user accounts?**

- **Why it matters:** A large vendor company may have multiple finance staff who need to submit invoices. If only one account per vendor is assumed, this blocks real-world usage.
- **Risk if unanswered:** The system is built for one account per vendor. Onboarding enterprise vendors becomes impossible without a workaround, delaying go-live.

---

**Q1.3 — Who is responsible for managing user accounts — users themselves, an admin, or both?**

- **Why it matters:** Determines whether a system admin panel is needed, who can deactivate accounts, and how access is revoked when a vendor relationship ends.
- **Risk if unanswered:** No offboarding process is built. Former vendors or ex-employees retain active access, creating a security and compliance risk.

---

**Q1.4 — What is the account lockout policy after failed login attempts?**

- **Why it matters:** A missing lockout policy leaves the system vulnerable to brute-force attacks. It also affects the support process — who unlocks accounts and how?
- **Risk if unanswered:** System is shipped without a lockout mechanism. A security audit flags it as a critical vulnerability, requiring an emergency patch post-launch.

---

**Q1.5 — Is there a password reset / forgot password flow required?**

- **Why it matters:** This is a standard usability requirement that is easy to overlook. Without it, locked-out users have no self-service recovery and must contact support.
- **Risk if unanswered:** Support team is flooded with password reset requests from day one, increasing operational cost.

---

## 2. Vendor Registration

---

**Q2.1 — Is vendor registration self-service, invite-only, or admin-approved?**

- **Why it matters:** This single decision changes the entire onboarding flow. Self-service needs a public registration page. Admin-approved needs an approval queue and notification. Invite-only needs an invitation system.
- **Risk if unanswered:** The wrong registration flow is built. If the client expected admin approval but self-service was implemented, any vendor with an email address can access the portal — a serious business and security risk.

---

**Q2.2 — What information must a vendor provide during registration?**

- **Why it matters:** Registration fields define the vendor data model. Missing a mandatory field like Tax ID or bank account details at this stage means a schema change and data migration later.
- **Risk if unanswered:** Vendors register with incomplete information. AP team cannot process payments without missing vendor details, requiring manual follow-up with each vendor.

---

**Q2.3 — Is email verification required after registration?**

- **Why it matters:** Without email verification, anyone can register using a fake or someone else's email address, leading to fraudulent accounts and undeliverable notifications.
- **Risk if unanswered:** Fraudulent or incorrect email addresses enter the system. Notifications go undelivered, and the system cannot reliably contact vendors.

---

**Q2.4 — Can a vendor update their own registration details after sign-up (e.g., change email, update bank details)?**

- **Why it matters:** Business details change. If vendors cannot update their own profile, every change requires manual admin intervention, which is not scalable.
- **Risk if unanswered:** No profile update flow is built. Vendors with changed bank details or contacts require manual database edits by the dev team to update — operational and audit risk.

---

**Q2.5 — Is there a vendor approval or vetting process before they can submit invoices?**

- **Why it matters:** Many organizations maintain an approved vendor list. A vendor registered in the portal may not yet be a cleared, contracted supplier.
- **Risk if unanswered:** Any registered vendor can immediately submit invoices. Unvetted or fraudulent vendors could submit invoices against real PO numbers.

---

## 3. Invoice Submission

---

**Q3.1 — What are the mandatory fields on an invoice submission form?**

- **Why it matters:** The data model, validation rules, and UI form all depend on knowing which fields are required. Mandatory fields also determine what testers must validate.
- **Risk if unanswered:** Developers create a minimal form. Key data needed for payment (e.g., bank reference, GST number, line-item breakdown) is absent, blocking the finance team from processing invoices.

---

**Q3.2 — Where does PO data come from — is it entered manually by the vendor, or does the system validate it against an existing list?**

- **Why it matters:** If PO data must be validated, there needs to be a data source (database table, ERP integration, uploaded CSV). Without this, the system cannot check if a PO is real or belongs to that vendor.
- **Risk if unanswered:** Vendors submit invoices against invalid or fabricated PO numbers. AP team spends time manually verifying every PO reference, defeating the purpose of automation.

---

**Q3.3 — Can multiple invoices be submitted against the same PO? Is there a total value cap?**

- **Why it matters:** Partial invoicing (progress billing) is common in construction, consulting, and services contracts. Without this rule, either the system blocks valid use cases or allows overbilling.
- **Risk if unanswered:** Vendors either cannot submit progress invoices (blocking their cash flow), or can submit invoices totalling more than the PO value (financial loss to the organization).

---

**Q3.4 — Can a vendor edit or withdraw an invoice after submission?**

- **Why it matters:** Vendors make mistakes. If editing is not allowed, a minor error requires rejection by the AP team followed by a full resubmission. If editing is allowed, the system needs version control and audit trail.
- **Risk if unanswered:** No edit flow is built. A vendor who submits with a typo must go through the full rejection/resubmission cycle, increasing AP workload and vendor frustration.

---

**Q3.5 — Is a document attachment (e.g., PDF invoice) mandatory, and what file formats and sizes are accepted?**

- **Why it matters:** Many AP teams require the original vendor invoice document for audit purposes. If attachments are mandatory, the system needs file upload, storage, and virus scanning.
- **Risk if unanswered:** No attachment mechanism is built, or it is built without size/format restrictions. The system receives unsupported or malicious files, or storage costs spiral out of control.

---

**Q3.6 — Should vendors be able to save a draft invoice before final submission?**

- **Why it matters:** Completing an invoice can take time, especially for line-item heavy submissions. Without draft support, a vendor who navigates away loses all entered data.
- **Risk if unanswered:** No draft functionality is built. Vendors repeatedly lose data mid-entry, leading to poor user experience and calls to support.

---

## 4. Invoice Approval Workflow

---

**Q4.1 — Is invoice approval single-level (any AP member approves) or multi-level (e.g., clerk reviews, manager approves)?**

- **Why it matters:** A single-level workflow is straightforward. A multi-level workflow requires routing logic, escalation, and different UI views per role — a significant increase in scope.
- **Risk if unanswered:** A single-level workflow is built. Business goes live and realizes their internal controls require dual approval above a certain invoice value. A full workflow redesign is needed.

---

**Q4.2 — Are invoices assigned to specific AP team members, or does any member pick from a shared queue?**

- **Why it matters:** Assignment logic determines UI design, workload visibility, and accountability. A shared queue needs different controls than a personal queue.
- **Risk if unanswered:** A shared queue is built but the AP manager expects to assign invoices to specific reviewers. No assignment mechanism exists, leading to duplicated effort or invoices falling through the cracks.

---

**Q4.3 — Is a rejection reason mandatory? What rejection categories exist?**

- **Why it matters:** A mandatory rejection reason provides vendors with actionable feedback and creates an audit record. Free-text reasons differ from structured dropdown categories.
- **Risk if unanswered:** AP team rejects invoices with no reason or vague text. Vendors resubmit the same incorrect invoice repeatedly, clogging the queue.

---

**Q4.4 — Can a vendor resubmit a rejected invoice? If yes, how many times?**

- **Why it matters:** Without a resubmission policy, there is no process for a vendor to correct a legitimate mistake. With no limit, a vendor can resubmit indefinitely.
- **Risk if unanswered:** No resubmission flow is built. Rejected invoices are dead ends. Vendors call the AP team directly to resolve issues, eliminating the efficiency gain of the portal.

---

**Q4.5 — Is there a time limit (SLA) within which the AP team must review an invoice?**

- **Why it matters:** Payment terms often depend on the invoice receipt date. If review takes too long, the organization may breach payment term agreements with vendors.
- **Risk if unanswered:** No SLA tracking or escalation alerts are built. Invoices sit unreviewed for weeks. Vendors breach payment terms and charge late fees.

---

**Q4.6 — Can an approved invoice be recalled before payment is processed?**

- **Why it matters:** Errors may be discovered after approval. Without a recall mechanism, the only option is to contact the payment team manually and hope the payment has not been issued.
- **Risk if unanswered:** No recall mechanism exists. An approved fraudulent or erroneous invoice cannot be stopped programmatically, requiring urgent manual intervention.

---

## 5. Payment Processing

---

**Q5.1 — Is payment processing handled within this portal or by an external system?**

- **Why it matters:** If an external system is involved (ERP, accounting software, payment gateway), an integration must be scoped, designed, and tested. This could double the project scope.
- **Risk if unanswered:** Development begins assuming no integration. The client later reveals invoices must feed into SAP. A full integration layer must be built post-launch under pressure.

---

**Q5.2 — What does "forwarded" mean in technical terms — API call, email, file export, or queue entry?**

- **Why it matters:** The handoff mechanism determines the technical architecture. Each option has different failure modes, retry logic, and confirmation requirements.
- **Risk if unanswered:** Developers assume email forwarding. The payment team expects a structured file or API call. The integration does not work, and invoices must be manually re-entered into the payment system.

---

**Q5.3 — Who is responsible for payment processing — the AP team or a separate finance/treasury team?**

- **Why it matters:** If a separate team is involved, they may need portal access, notifications, or a dedicated view that is not currently scoped.
- **Risk if unanswered:** No access or workflow is built for the finance team. They receive forwarded invoices but have no way to update payment status back into the portal, leaving vendors in the dark.

---

**Q5.4 — Should payment status (e.g., Pending Payment, Paid) be tracked and visible in the portal?**

- **Why it matters:** Vendors frequently want to know when they will be paid. If payment status is not tracked, they must call or email the AP team for every update.
- **Risk if unanswered:** No payment status tracking is built. Vendors flood the AP team with "when will I get paid?" queries, eliminating the self-service value of the portal.

---

**Q5.5 — What are the payment terms, and are they captured at the vendor or PO level?**

- **Why it matters:** Payment terms (Net 15, Net 30, etc.) determine when a payment is due. If they are tracked in the system, due date calculations and overdue alerts become possible.
- **Risk if unanswered:** Payment terms are not stored. Finance team manually tracks due dates outside the system, creating reconciliation errors and missed payment deadlines.

---

## 6. Email Notifications

---

**Q6.1 — What are all the events that should trigger an email notification?**

- **Why it matters:** Without a complete event list, some status changes will trigger no notification, leaving vendors and AP team members uninformed at critical moments.
- **Risk if unanswered:** Notifications are built only for the obvious events (approved/rejected). Vendors receive no acknowledgement when they submit, and AP team receives no alert when a high-value invoice arrives.

---

**Q6.2 — Who exactly receives each notification — the submitting vendor, all AP members, or a specific AP member?**

- **Why it matters:** Sending to all AP members for every event causes noise. Sending to no one causes missed actions. The routing logic must be explicitly defined.
- **Risk if unanswered:** All AP team members receive every notification email. Team of 20 people receives hundreds of emails per day, leading to notification fatigue and ignored alerts.

---

**Q6.3 — What should the email contain — a summary, full invoice details, or just a link?**

- **Why it matters:** Determines the email template design, what data must be passed to the notification service, and whether sensitive invoice data is transmitted via email.
- **Risk if unanswered:** Emails contain no actionable information (just "your invoice status changed"). Recipients must log in just to find out what happened, reducing the value of the notification.

---

**Q6.4 — Should vendors be able to opt out of certain notifications?**

- **Why it matters:** In some markets, email preference management is a legal requirement (GDPR, CAN-SPAM). Even where not mandatory, excessive emails damage the vendor relationship.
- **Risk if unanswered:** No preference management is built. A vendor in the EU complains about unsolicited emails. Legal team flags a compliance issue post-launch.

---

**Q6.5 — What email sender address and branding should be used for notifications?**

- **Why it matters:** A noreply@company.com domain and branded template builds trust. An unbranded or generic sender is often flagged as spam, meaning critical notifications never reach vendors.
- **Risk if unanswered:** Emails are sent from a generic or unverified domain. Vendor emails go to spam. Vendors miss rejection notices and miss resubmission windows.

---

## 7. Reporting

---

**Q7.1 — What data fields must the monthly report include?**

- **Why it matters:** Without a defined report structure, developers will guess. The report may be technically generated but contain the wrong data for the business team's needs.
- **Risk if unanswered:** Report is generated and presented to finance leadership. It is missing key metrics (e.g., value by vendor, aging analysis). Report must be redesigned and the data model potentially restructured.

---

**Q7.2 — When is the monthly report generated — automatically at month-end, or on demand?**

- **Why it matters:** Scheduled generation requires a background job and potentially email delivery. On-demand generation requires a UI control. Both must be scoped and built differently.
- **Risk if unanswered:** Only scheduled generation is built. Finance team wants to pull a report mid-month before a board meeting. No on-demand option exists.

---

**Q7.3 — Who can access the reports, and where — inside the portal, via email, or both?**

- **Why it matters:** If reports are emailed, a distribution list must be defined and managed. If portal-only, access control must restrict report visibility to authorised roles.
- **Risk if unanswered:** Reports are accessible to all logged-in users including vendors. Vendors can see the invoice activity of other vendors, a serious data privacy violation.

---

**Q7.4 — In what format should the report be available — PDF, CSV, Excel, or in-portal view only?**

- **Why it matters:** Finance teams typically need to manipulate data in Excel. Audit teams need a fixed-format PDF. Each format requires different generation logic.
- **Risk if unanswered:** A PDF-only report is built. Finance team cannot use it for further analysis and requests an Excel export, requiring additional development.

---

**Q7.5 — Should historical reports (past months) be stored and accessible in the portal?**

- **Why it matters:** Audit requirements often mandate that reports be retrievable for 3–7 years. Without storage, every historical report must be regenerated on request, or it is simply gone.
- **Risk if unanswered:** Reports are generated but not stored. Six months later, the client needs the March report for an audit. It no longer exists and must be manually reconstructed.

---

## 8. Security & Authorization

---

**Q8.1 — What defines an "authorized" user — being registered, being admin-approved, or holding a specific role?**

- **Why it matters:** "Authorized" is the core of the access control model. If it is not precisely defined, the authorization layer will be inconsistently implemented across the system.
- **Risk if unanswered:** Developers interpret "authorized" as "logged in." A suspended vendor can still access the portal. A new AP hire can approve invoices before receiving training.

---

**Q8.2 — Is Multi-Factor Authentication (MFA) required for any or all users?**

- **Why it matters:** MFA requirements change the authentication architecture significantly. MFA for the AP team may be mandated by internal security policy or compliance standards.
- **Risk if unanswered:** No MFA is built. A security policy review post-launch mandates MFA for finance system users. Retrofitting MFA is expensive and disruptive.

---

**Q8.3 — Are there compliance or regulatory standards this system must meet (e.g., SOC 2, ISO 27001, GDPR)?**

- **Why it matters:** Compliance requirements affect data storage, encryption, audit logging, data retention, and breach notification procedures — foundational architecture decisions.
- **Risk if unanswered:** System is built without compliance controls. A compliance audit flags multiple gaps. Remediation is costly and may require re-architecting core components.

---

**Q8.4 — How long should sessions stay active, and what happens on timeout?**

- **Why it matters:** Short timeouts frustrate users but protect sensitive financial data. The timeout duration and behavior (auto-save, warning prompt, forced logout) must be defined.
- **Risk if unanswered:** Sessions never expire. An AP member leaves their workstation unlocked. An unauthorized person approves invoices. Financial and legal liability results.

---

**Q8.5 — Must all actions (approve, reject, submit) be logged for audit purposes?**

- **Why it matters:** Financial systems are subject to audits. Without a tamper-evident audit log, there is no way to prove who did what and when — a regulatory and dispute resolution risk.
- **Risk if unanswered:** No audit trail is built. A disputed invoice approval cannot be investigated. The organization has no evidence of who approved a fraudulent payment.

---

## 9. Non-Functional Requirements

---

**Q9.1 — How many vendors and AP users are expected to use the system concurrently at peak?**

- **Why it matters:** Determines infrastructure sizing, database connection pooling, and load testing benchmarks. Underprovisioned infrastructure causes slow or failed transactions during month-end invoice surges.
- **Risk if unanswered:** System is sized for 50 users. At month-end, 500 vendors submit invoices simultaneously. The system crashes or becomes unusable at the most critical business moment.

---

**Q9.2 — What is the acceptable system uptime (SLA), and what are the maintenance windows?**

- **Why it matters:** Vendors operate across time zones and may submit invoices outside business hours. A 99% uptime SLA is very different from 99.9%, in terms of both infrastructure cost and architecture.
- **Risk if unanswered:** No uptime target is set. The system goes down during a deployment at 9 AM on a working day. Vendors cannot submit invoices, and the client has no contractual recourse.

---

**Q9.3 — What is the maximum acceptable page load time for key actions (invoice submission, report generation)?**

- **Why it matters:** Report generation and invoice listing can be data-heavy. Without performance benchmarks, there is no basis for testing or optimization.
- **Risk if unanswered:** No performance target is defined. The monthly report takes 45 seconds to load. Users assume it is broken and repeatedly click, making it worse. No contractual SLA to enforce improvement.

---

**Q9.4 — Which browsers and devices must be supported?**

- **Why it matters:** Supporting IE11 vs. modern Chrome requires very different front-end decisions. Mobile support requires responsive design — additional design and testing effort.
- **Risk if unanswered:** System is built for Chrome desktop only. A vendor uses Firefox on a Mac and finds the invoice form is broken. A support escalation reveals no browser compatibility testing was planned.

---

**Q9.5 — How long must invoice records and reports be retained in the system?**

- **Why it matters:** Tax and financial audit requirements in most jurisdictions mandate record retention for 5–7 years. This affects database storage planning and archiving strategy.
- **Risk if unanswered:** Old invoices are purged after 1 year to save storage costs. A tax authority requests invoice records from 3 years ago. The data no longer exists.

---

## Summary

| Category | Questions Raised |
|----------|-----------------|
| User Management | 5 |
| Vendor Registration | 5 |
| Invoice Submission | 6 |
| Invoice Approval Workflow | 6 |
| Payment Processing | 5 |
| Email Notifications | 5 |
| Reporting | 5 |
| Security & Authorization | 5 |
| Non-Functional Requirements | 5 |
| **Total** | **47** |

---

> **Workshop recommendation:** Prioritize questions in Invoice Submission, Invoice Approval Workflow, and Payment Processing first — they carry the highest delivery risk. Security & Authorization and Non-Functional Requirements should be resolved before architecture sign-off.
