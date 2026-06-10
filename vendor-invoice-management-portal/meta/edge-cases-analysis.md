# Edge Case & Scenario Analysis
## Vendor Invoice Management Portal

**Date:** 2026-06-06
**Version:** 1.0

---

## Scenario Categories

| Symbol | Category |
|--------|----------|
| EC | Edge Case |
| NEG | Negative Scenario |
| EX | Exception Handling |
| SEC | Security Scenario |
| CON | Concurrency Scenario |
| DV | Data Validation |

---

## 1. Vendor Registration & Login

| # | Type | Feature | Scenario / Edge Case | Expected Behavior | Priority | Business Impact |
|---|------|---------|----------------------|-------------------|----------|-----------------|
| 1.1 | DV | Registration | Vendor registers with an email address that is already in the system | System displays an error: "An account with this email already exists." Registration is blocked. No duplicate account is created. | High | Duplicate accounts cause split invoice history, notification failures, and identity confusion for the AP team. |
| 1.2 | DV | Registration | Vendor submits the registration form with one or more mandatory fields left blank | System highlights all missing fields with inline error messages. Form is not submitted. | High | Incomplete vendor records block payment processing — bank details or tax IDs may be missing. |
| 1.3 | DV | Registration | Vendor enters an invalid email format (e.g., vendor@, vendor.com, @domain.com) | System validates email format on blur and on submit. Displays: "Please enter a valid email address." | High | Undeliverable notification emails mean vendors miss approval/rejection alerts. |
| 1.4 | EC | Registration | Vendor enters a password at the exact minimum allowed length boundary | Password is accepted if it meets all rules. Rejected if one character below the minimum. | Medium | Boundary conditions in validation are the most common source of bugs in form handling. |
| 1.5 | EC | Registration | Vendor enters a company name with special characters (e.g., O'Brien & Sons, Müller GmbH) | System accepts valid special characters. Data is stored and displayed correctly without encoding errors. | Medium | Incorrect character handling corrupts vendor records and breaks invoice exports/reports. |
| 1.6 | SEC | Registration | Vendor enters an SQL injection string in a registration field (e.g., `' OR 1=1 --`) | Input is sanitized. No SQL is executed. Data is stored as a literal string or rejected. No database error is exposed. | High | SQL injection in a financial portal can expose or corrupt all vendor and invoice records. |
| 1.7 | SEC | Registration | Vendor enters an XSS payload in the company name field (e.g., `<script>alert('XSS')</script>`) | Script is not executed when the name is displayed anywhere in the portal. Input is escaped or sanitized. | High | Stored XSS can steal AP team session tokens, enabling unauthorized invoice approvals. |
| 1.8 | NEG | Login | Vendor logs in with a correct email but incorrect password | System displays a generic message: "Invalid email or password." No indication of which field is wrong. | High | Specific error messages (e.g., "wrong password") assist attackers in account enumeration. |
| 1.9 | NEG | Login | Vendor attempts to log in with an email address that does not exist | System displays the same generic message as an incorrect password. Does not confirm whether the email exists. | High | Revealing that an email is not registered allows attackers to enumerate valid vendor accounts. |
| 1.10 | SEC | Login | Vendor makes 5+ consecutive failed login attempts | Account is temporarily locked. User is informed of the lockout and how to regain access. Alert may be sent to the account email. | High | Without lockout, brute-force attacks can compromise vendor accounts and enable fraudulent invoice submissions. |
| 1.11 | SEC | Login | Attacker attempts a brute-force login using an automated script | Rate limiting is enforced per IP and per account. Requests exceeding the threshold are blocked and return HTTP 429. | High | Automated credential stuffing can compromise multiple vendor accounts simultaneously. |
| 1.12 | EC | Login | Vendor tries to log in immediately after registering, before completing email verification (if required) | System blocks login and prompts the vendor to verify their email first. A resend verification link is available. | Medium | Unverified accounts receiving notifications at bad emails creates communication failure. |
| 1.13 | EC | Login | Vendor's account has been deactivated by an admin | System blocks login and displays: "Your account has been deactivated. Please contact support." | High | A deactivated vendor (e.g., end of contract) must not access historical invoice data or submit new invoices. |
| 1.14 | SEC | Login | Vendor logs out and then presses the browser Back button to return to a protected page | Session is fully invalidated on logout. Browser navigating back returns the user to the login page, not cached portal content. | High | Session persistence after logout allows a second person using the same machine to act as the vendor. |
| 1.15 | EX | Login | The authentication service is temporarily unavailable when a vendor attempts to log in | System displays a user-friendly error: "We're experiencing a technical issue. Please try again shortly." No stack trace is shown. | High | Exposing error details reveals system architecture to attackers. Downtime without a clear message damages vendor trust. |

---

## 2. Invoice Submission

| # | Type | Feature | Scenario / Edge Case | Expected Behavior | Priority | Business Impact |
|---|------|---------|----------------------|-------------------|----------|-----------------|
| 2.1 | DV | Invoice Submission | Vendor submits an invoice with a PO number that does not exist in the system | System rejects the submission with: "PO number not found. Please verify and try again." Invoice is not created. | High | Invoices against fake PO numbers create fraudulent payment risk and AP team workload. |
| 2.2 | DV | Invoice Submission | Vendor submits an invoice against a valid PO number that belongs to a different vendor | System rejects the submission. The vendor is not informed which vendor the PO belongs to. | High | Cross-vendor PO access could expose commercially sensitive procurement information. |
| 2.3 | EC | Invoice Submission | Vendor submits an invoice for exactly the remaining balance on a PO (zero remaining after submission) | Submission is accepted. PO shows a remaining balance of zero. Any further invoice against the same PO is blocked. | High | Exact boundary handling is critical — under or over-blocking causes either financial loss or vendor disputes. |
| 2.4 | NEG | Invoice Submission | Vendor submits an invoice with an amount greater than the remaining PO balance | System rejects submission with: "Invoice amount exceeds the remaining PO balance of [amount]." | High | Overpayment against a PO is a direct financial loss and a procurement policy violation. |
| 2.5 | EC | Invoice Submission | Vendor submits an invoice with a zero (0) or negative amount | System validates that the invoice amount must be greater than zero. Displays a clear validation error. | High | A zero or negative invoice could corrupt payment totals in reports and the payment system. |
| 2.6 | CON | Invoice Submission | Two invoices from the same vendor are submitted simultaneously against the same PO, and only one fits within the remaining balance | System uses database-level locking or optimistic concurrency. Only one submission succeeds. The other receives a balance error. Neither submission is partially saved. | High | A race condition here allows double payment beyond PO value, causing financial loss. |
| 2.7 | DV | Invoice Submission | Vendor enters an invoice date in the future | System rejects the future date and displays: "Invoice date cannot be in the future." | Medium | Future-dated invoices distort monthly reports and create payment scheduling confusion. |
| 2.8 | DV | Invoice Submission | Vendor enters an invoice date before the PO creation date | System warns or blocks: "Invoice date cannot be earlier than the PO creation date." | Medium | An invoice predating its own PO signals a data integrity issue or potential fraud. |
| 2.9 | DV | Invoice Submission | Vendor uploads a file in an unsupported format (e.g., .exe, .zip, .docx) | System rejects the file with: "Unsupported file type. Please upload a PDF, JPG, or PNG." | High | Malicious file uploads (e.g., ransomware disguised as an invoice) can compromise the server. |
| 2.10 | DV | Invoice Submission | Vendor uploads a file that exceeds the maximum allowed size | System rejects the upload before or immediately after transfer with: "File exceeds the maximum allowed size of [X] MB." | Medium | Oversized files strain storage and can be used as a denial-of-service vector. |
| 2.11 | SEC | Invoice Submission | Vendor uploads a file containing a virus or malware | File is scanned before storage. If a threat is detected, the file is rejected, the upload is blocked, and a security alert is logged. | High | Storing malicious files exposes everyone who downloads the attachment — including the AP team. |
| 2.12 | EC | Invoice Submission | Vendor submits an invoice with a very large number of line items (e.g., 500+ rows) | System accepts the submission without timeout or data truncation. UI renders the line items without performance degradation. | Medium | Large invoices from manufacturing or retail vendors are common. Truncation causes payment errors. |
| 2.13 | EC | Invoice Submission | Vendor submits the exact same invoice twice (same invoice number against the same PO) | System detects the duplicate invoice number and blocks the second submission: "An invoice with this number has already been submitted for this PO." | High | Duplicate invoices result in double payment — a direct financial loss. |
| 2.14 | NEG | Invoice Submission | Vendor attempts to submit an invoice while their account is under suspension | System blocks the action and informs the vendor that their account is suspended. | High | A suspended vendor (fraud or dispute) must not be able to inject new invoices into the workflow. |
| 2.15 | EX | Invoice Submission | The file storage service is unavailable when a vendor submits an invoice with an attachment | System displays a user-friendly error. The invoice is not partially saved. Vendor is prompted to retry. Data is not left in an inconsistent state. | High | Partial saves create orphaned records — an invoice exists with no attachment, blocking AP review. |
| 2.16 | EX | Invoice Submission | Network connection drops mid-submission | System either detects the incomplete submission and rolls it back, or implements idempotency so retrying the submission does not create a duplicate. | High | A partial or duplicate invoice submission caused by network failure is a financial integrity risk. |

---

## 3. Invoice Approval Workflow (AP Team)

| # | Type | Feature | Scenario / Edge Case | Expected Behavior | Priority | Business Impact |
|---|------|---------|----------------------|-------------------|----------|-----------------|
| 3.1 | CON | Approval | Two AP team members open the same invoice and attempt to approve it simultaneously | System uses optimistic locking. The first action succeeds. The second receives: "This invoice has already been actioned by another reviewer." No duplicate approval record is created. | High | Concurrent approval could create duplicate payment forwarding, resulting in double payment. |
| 3.2 | CON | Approval | One AP member approves while another simultaneously rejects the same invoice | System commits only the first action. The second reviewer sees a stale state error and is shown the updated invoice status. | High | A conflicting approve/reject state corrupts the invoice lifecycle and causes undefined payment behavior. |
| 3.3 | NEG | Rejection | AP team member rejects an invoice without providing a rejection reason (if required) | System blocks the rejection action and highlights the required reason field: "Please provide a rejection reason." | High | Vendors cannot correct and resubmit without knowing why their invoice was rejected, stalling payment. |
| 3.4 | EC | Approval | AP team member attempts to approve an invoice that is already in "Approved" status | System blocks the action and displays the current status. No duplicate approval event is logged. | Medium | Redundant approval events could trigger duplicate payment forwarding in integrated systems. |
| 3.5 | EC | Approval | AP team member attempts to reject an invoice that is already in "Rejected" status | System blocks the action and shows the current status and existing rejection reason. | Low | Prevents noise in the audit log; a re-rejection does not change anything but could confuse audit trails. |
| 3.6 | SEC | Approval | Vendor directly calls the approve/reject API endpoint without going through the UI | API enforces role-based authorization. Vendor's token returns HTTP 403 Forbidden. Action is not executed and the attempt is logged. | High | A vendor approving their own invoice is fraudulent. A missing API-level authorization check makes UI-only guards worthless. |
| 3.7 | SEC | Approval | AP team member attempts to access invoices from a business unit or region they are not authorized for (if scoped access applies) | System filters invoice visibility by the user's scope. Accessing out-of-scope invoices via URL manipulation returns HTTP 403 or 404. | High | Unauthorized AP access to other business units' invoices violates segregation of duties. |
| 3.8 | EX | Approval | AP team member approves an invoice but the payment system is unreachable when forwarding is attempted | System queues the approved invoice for forwarding retry. AP member sees a success message. The forwarding failure is logged and retried automatically. AP or admin is notified of the failure. | High | A silent forwarding failure means an approved invoice never reaches payment processing. Vendor is never paid. |
| 3.9 | EC | Invoice View | AP team member opens an invoice that was submitted without an attachment (if attachments are optional) | Invoice is displayed with a clear "No attachment" indicator. AP member can still approve or reject. | Low | AP team needs to know when supporting documentation is absent to make an informed review decision. |
| 3.10 | NEG | Approval | AP team member attempts to approve an invoice that has been flagged as a duplicate | System warns: "This invoice number was previously submitted. Review carefully before approving." | High | Approving a known duplicate invoice results in double payment. |

---

## 4. Payment Processing

| # | Type | Feature | Scenario / Edge Case | Expected Behavior | Priority | Business Impact |
|---|------|---------|----------------------|-------------------|----------|-----------------|
| 4.1 | EX | Payment Forwarding | The payment processing system is down when an invoice is approved | Approved invoice is queued. Forwarding is retried automatically with exponential backoff. AP team is notified of the delay. Invoice remains in "Approved — Pending Forwarding" state. | High | Silent forwarding failure means vendors are never paid, and no one in the system is aware. |
| 4.2 | EC | Payment Forwarding | The same approved invoice is forwarded to the payment system more than once (e.g., due to a retry on a network timeout where the first attempt actually succeeded) | Payment system or portal implements idempotency. Duplicate forwarding requests are detected and deduplicated. Only one payment is issued. | High | Double forwarding without idempotency results in double payment — a direct financial loss. |
| 4.3 | EX | Payment Forwarding | The payment system returns an error response after receiving the invoice | Error is logged. The invoice status is updated to "Forwarding Failed." AP team or admin is notified to investigate. Vendor is not notified until the issue is resolved. | High | An unhandled error response leaves the invoice in an unknown state — neither paid nor clearly failed. |
| 4.4 | EC | Payment Forwarding | Invoice is approved on a weekend or public holiday when the payment system may have a processing blackout | System successfully forwards the invoice. Payment system applies its own business calendar. Status reflects "Pending Payment" with no assumed processing date from the portal. | Medium | Assuming immediate payment on a bank holiday causes incorrect due date calculations and vendor disputes. |
| 4.5 | EC | Payment Forwarding | An AP manager recalls/revokes an approval after the invoice has already been forwarded to the payment system | System attempts to send a cancellation to the payment system. If payment is already processed, a clear alert is raised: "Payment already issued — contact finance to initiate a reversal." | High | Silently failing to cancel a forwarded payment results in an unauthorized payment being made. |

---

## 5. Email Notifications

| # | Type | Feature | Scenario / Edge Case | Expected Behavior | Priority | Business Impact |
|---|------|---------|----------------------|-------------------|----------|-----------------|
| 5.1 | EX | Notification | Vendor's email address is invalid or the mailbox no longer exists when a notification is sent | System logs the delivery failure. Does not crash or retry indefinitely. AP team or admin is alerted to the undeliverable email so they can contact the vendor through another channel. | High | An undeliverable notification means the vendor is unaware their invoice was rejected — they never correct and resubmit. |
| 5.2 | EX | Notification | Email service (SMTP or third-party provider) is unavailable when a status change occurs | Notification is queued and retried when the service recovers. Status change in the portal is not blocked by the email failure. | High | Email failures must not block the AP workflow. However, undelivered notifications cause vendor confusion and support calls. |
| 5.3 | EC | Notification | An invoice status changes multiple times in rapid succession (e.g., submitted → approved → recalled → re-approved) | Each status change triggers its own notification. Notifications are sent in the correct order and reflect the accurate final status. No notifications are dropped or merged. | Medium | Out-of-order or missing notifications leave vendors with an incorrect understanding of their invoice status. |
| 5.4 | EC | Notification | A notification email is triggered but the vendor's inbox is full | Email delivery fails. Failure is logged. No retry storms. If the email bounces, the system treats it as an undeliverable address. | Low | A full inbox is the vendor's responsibility, but the system must handle the bounce gracefully without retry loops. |
| 5.5 | SEC | Notification | Notification email contains a link to the invoice — can it be accessed by anyone with the link? | Invoice links require the recipient to be authenticated. Clicking the link redirects to login if the session is not active. The link does not expose invoice data to unauthenticated users. | High | An unguarded invoice link in an email exposes sensitive financial data to anyone who intercepts or forwards the email. |
| 5.6 | EC | Notification | AP team has a shared inbox and receives a notification — multiple members see and act on the same notification | Notification is informational only. Actual action (approve/reject) is controlled by the portal's concurrency rules. Multiple team members reading the same notification does not cause duplicate actions. | Medium | Shared inbox usage is common in AP teams. Notifications should not create a race condition for action. |

---

## 6. Monthly Invoice Activity Reports

| # | Type | Feature | Scenario / Edge Case | Expected Behavior | Priority | Business Impact |
|---|------|---------|----------------------|-------------------|----------|-----------------|
| 6.1 | EC | Reporting | Monthly report is generated for a month in which zero invoices were submitted | Report is generated successfully with zero counts and amounts. Clearly indicates "No invoice activity for this period." Not an empty/broken file. | Low | An error on a zero-data report suggests the system only works in the happy path, raising quality concerns. |
| 6.2 | EC | Reporting | Report generation is triggered at midnight, crossing a timezone boundary (e.g., UTC vs. local time) | Report uses a clearly defined and consistent timezone (e.g., UTC or the organization's local time). The date range is unambiguous. | High | Timezone ambiguity causes invoices submitted near midnight to appear in the wrong month's report, causing reconciliation errors. |
| 6.3 | EX | Reporting | Report generation job fails partway through (e.g., server crash mid-generation) | The partial report is not saved or published. The failure is logged and alerted. The job is retried. The previous month's complete report remains available. | High | A corrupt or incomplete report presented to finance leadership causes incorrect business decisions. |
| 6.4 | EC | Reporting | A very large number of invoices (e.g., 10,000+) must be included in a single monthly report | Report generation completes within an acceptable time. The report file does not hit memory or size limits. Pagination or streaming is used if needed. | Medium | A timeout or crash during report generation leaves finance without month-end data, delaying reconciliation. |
| 6.5 | SEC | Reporting | A vendor attempts to access the monthly report page via direct URL manipulation | Access is denied with HTTP 403. The report is not returned. The attempt is logged. | High | Monthly reports contain all vendors' invoice data. A vendor viewing competitors' invoice volumes is a serious data privacy violation. |
| 6.6 | EC | Reporting | An invoice changes status (e.g., from Pending to Approved) on the last day of the month, just before the report is generated | Report reflects the status at the exact moment of generation. The cutoff time is consistent and documented. | Medium | An inconsistent cutoff causes the same invoice to appear in different statuses across successive reports, confusing reconciliation. |
| 6.7 | NEG | Reporting | AP team member requests a report for a future month | System rejects the request: "Reports cannot be generated for a future period." | Low | A future-period report would be empty and meaningless, but the request should be handled gracefully, not crash. |

---

## 7. Authorization & Access Control

| # | Type | Feature | Scenario / Edge Case | Expected Behavior | Priority | Business Impact |
|---|------|---------|----------------------|-------------------|----------|-----------------|
| 7.1 | SEC | Authorization | Unauthenticated user directly accesses a portal URL (e.g., /invoices/123) | System redirects to the login page. No invoice data is returned or visible. The URL is preserved for post-login redirect. | High | Any unauthorized access to invoice data is a financial data breach. |
| 7.2 | SEC | Authorization | Authenticated vendor manipulates the URL to access another vendor's invoice (e.g., changes invoice ID in the URL) | System checks that the invoice belongs to the requesting vendor. Returns HTTP 403 or 404 if not. No data from the other vendor is exposed. | High | Invoice data includes amounts, PO references, and business details. Cross-vendor access is a data privacy and commercial breach. |
| 7.3 | SEC | Authorization | Authenticated vendor attempts to access AP-only pages (e.g., /admin/invoices, /reports) via URL manipulation | System enforces role-based access control at the server level. Returns HTTP 403. The AP dashboard is not rendered for a vendor role. | High | A vendor reaching the AP approval interface could approve or reject their own invoices, enabling fraud. |
| 7.4 | SEC | Authorization | An AP team member attempts to submit an invoice as if they were a vendor | AP role does not have access to the invoice submission endpoint. The attempt returns HTTP 403 and is logged. | Medium | Segregation of duties requires that invoice submitters and approvers are different parties. |
| 7.5 | SEC | Session | A vendor's session token is stolen (e.g., via XSS or network interception) and used from a different IP/device | System detects anomalous session usage (different IP, device fingerprint change). Session is invalidated or re-authentication is required. | High | A stolen session token gives a full impersonation of the vendor — including invoice submission. |
| 7.6 | EC | Session | A vendor's session expires while they are mid-way through filling in an invoice form | System notifies the vendor that their session has expired. Redirects to login. After login, returns them to the invoice form. Form data is preserved where possible. | Medium | Losing all entered invoice data due to a session timeout frustrates vendors and causes re-entry errors. |
| 7.7 | SEC | Session | The same vendor account logs in from two different devices simultaneously | System either allows concurrent sessions (and logs both) or invalidates the older session when a new one starts, depending on policy. | Medium | Unrestricted concurrent sessions increase the window of exploitation if credentials are compromised. |
| 7.8 | EC | Authorization | An AP team member's account is deactivated while they have an invoice open and are mid-review | On their next action (approve/reject/save), the system detects the deactivated session and forces logout. The invoice returns to its previous state. | High | A deactivated AP member completing an action could leave an audit trail attributed to an invalid account. |
| 7.9 | SEC | Authorization | Attacker attempts parameter tampering in an API call to escalate their role (e.g., adding `role=admin` to a request) | Server ignores client-supplied role parameters. Role is always read from the server-side session. HTTP 403 is returned. Attempt is logged. | High | Client-side role injection is a common privilege escalation vector. Server-side enforcement is mandatory. |
| 7.10 | SEC | Authorization | Attacker replays a captured API request (e.g., an approval request) after the session has ended | Expired or invalidated session tokens are rejected. Replay of a captured request returns HTTP 401. | High | Request replay could re-approve a recalled invoice or re-trigger a payment forwarding event. |

---

## Summary by Priority

| Priority | Count |
|----------|-------|
| High | 40 |
| Medium | 14 |
| Low | 5 |
| **Total** | **59** |

## Summary by Category

| Category | Count |
|----------|-------|
| Security (SEC) | 18 |
| Edge Case (EC) | 18 |
| Exception Handling (EX) | 10 |
| Data Validation (DV) | 7 |
| Negative Scenario (NEG) | 4 |
| Concurrency (CON) | 4 |
| **Total** | **59** |

---

> **QA Recommendation:** All 40 High-priority scenarios must have test cases written and executed before UAT sign-off. Security scenarios (SEC) should be covered by both manual testing and automated DAST scanning. Concurrency scenarios (CON) require dedicated load/concurrency test scripts and cannot be verified through manual testing alone.
