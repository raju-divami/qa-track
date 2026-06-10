# Requirements Ambiguity Analysis
## Vendor Invoice Management Portal

**Date:** 2026-06-06
**Version:** 1.0

---

## REQ-01: Vendors can register and log in to the portal

### Ambiguous Statements

| # | Ambiguous Statement | Why It Is Ambiguous | Possible Interpretations | Recommended Clarification |
|---|---------------------|----------------------|--------------------------|---------------------------|
| 1.1 | "Vendors can register" | No details on what registration requires or who approves it | (a) Self-service open registration — anyone can sign up and immediately access the portal. (b) Registration requires admin approval before access is granted. (c) Vendors are pre-registered by the AP team and simply activate their account. | Specify the registration flow: is it self-service, admin-approved, or invite-only? Define required fields (e.g., company name, tax ID, contact email). |
| 1.2 | "Log in to the portal" | Authentication method is not defined | (a) Email and password login. (b) Single Sign-On (SSO) via corporate identity provider. (c) OTP-based login. (d) Social login (Google, Microsoft). | Define the authentication method, password complexity rules, and whether multi-factor authentication (MFA) is required. |
| 1.3 | "Vendors" (singular entity) | Unclear whether a vendor is one person or an organization with multiple users | (a) One vendor = one login account. (b) One vendor organization can have multiple user accounts under it. | Clarify whether a vendor company can have multiple users and, if so, how roles and permissions within the vendor organization are managed. |
| 1.4 | No mention of account management | What happens after registration is not stated | (a) Vendor accounts are permanent. (b) Accounts can be deactivated by the AP team. (c) Vendors can deactivate their own accounts. | Define account lifecycle: email verification, account deactivation, password reset, and lockout policy after failed login attempts. |

---

## REQ-02: Vendors can submit invoices against purchase orders

### Ambiguous Statements

| # | Ambiguous Statement | Why It Is Ambiguous | Possible Interpretations | Recommended Clarification |
|---|---------------------|----------------------|--------------------------|---------------------------|
| 2.1 | "Submit invoices against purchase orders" | "Against" does not clarify the validation relationship between invoice and PO | (a) Vendor manually types a PO number with no system validation. (b) System validates that the PO number exists and belongs to that vendor. (c) System validates that the invoice amount does not exceed the remaining PO balance. | Specify whether the system validates PO existence, ownership, and available balance. Define the source of PO data (manual list, integrated ERP). |
| 2.2 | "Submit invoices" — no field definition | Required invoice fields are not mentioned | (a) Only a document upload is needed. (b) Structured form with mandatory fields (invoice number, date, amount, line items) plus a document attachment. | Define the mandatory and optional fields for an invoice submission. |
| 2.3 | "Submit invoices" — no mention of limits | No constraint on how many invoices can be raised against a single PO | (a) One invoice per PO. (b) Multiple partial invoices against one PO are allowed. (c) Invoice total across submissions cannot exceed PO value. | Clarify whether multiple invoices can be submitted against the same PO and whether there is a value cap. |
| 2.4 | No mention of draft or edit capability | Unclear whether a vendor can save work in progress or correct a mistake | (a) Once submitted, the invoice is final and cannot be changed. (b) Vendors can save a draft before submitting. (c) Vendors can withdraw and resubmit an invoice before AP review begins. | State explicitly whether draft saving, editing, or withdrawal is allowed and up to which point in the workflow. |
| 2.5 | No mention of supported file formats | If an attachment is required, acceptable formats are undefined | (a) Any file format is accepted. (b) Only PDF is accepted. (c) PDF, JPG, and PNG up to a size limit are accepted. | Define accepted file formats, maximum file size, and whether an attachment is mandatory or optional. |

---

## REQ-03: The AP team can view, approve, or reject invoices

### Ambiguous Statements

| # | Ambiguous Statement | Why It Is Ambiguous | Possible Interpretations | Recommended Clarification |
|---|---------------------|----------------------|--------------------------|---------------------------|
| 3.1 | "The AP team" | Treated as a single homogeneous group with no internal hierarchy | (a) Any AP team member can approve or reject any invoice. (b) Invoices are assigned to specific AP members. (c) There is a multi-level approval — AP clerk reviews, AP manager approves. | Define whether all AP users have equal authority or if there are sub-roles (e.g., reviewer vs. approver) with different permissions. |
| 3.2 | "Can view" invoices | Scope of visibility is not defined | (a) AP team sees all invoices from all vendors. (b) Each AP member only sees invoices assigned to them. (c) AP team sees invoices filtered by their business unit or region. | Specify what invoice list each AP user sees and what filtering/search capabilities are available. |
| 3.3 | "Approve or reject" — no conditions stated | Criteria for approval or rejection are not defined | (a) Approval is a free-form decision with no mandatory checklist. (b) Approval requires confirming specific fields match the PO. (c) Rejection requires a mandatory reason; approval does not. | Define the business rules for approval and rejection, and whether a comment or reason is mandatory in either case. |
| 3.4 | No mention of what happens after rejection | The rejected invoice lifecycle is undefined | (a) A rejected invoice is permanently closed. (b) The vendor can correct and resubmit. (c) The vendor can appeal a rejection. | Clarify whether a rejected invoice can be resubmitted by the vendor, and if so, how many times. |
| 3.5 | No mention of reversibility | Can an AP member reverse an approval after it is given? | (a) Approvals are final once submitted. (b) An AP manager can revoke an approval before payment is processed. | Specify whether approved invoices can be recalled and under what conditions. |

---

## REQ-04: Approved invoices are forwarded for payment processing

### Ambiguous Statements

| # | Ambiguous Statement | Why It Is Ambiguous | Possible Interpretations | Recommended Clarification |
|---|---------------------|----------------------|--------------------------|---------------------------|
| 4.1 | "Forwarded for payment processing" | "Forwarded" does not describe the mechanism or destination | (a) The system sends invoice data automatically to an integrated payment/ERP system. (b) An email with invoice details is sent to a finance team. (c) A manual task is created for someone to process the payment. | Define what "forwarded" means technically: API integration, email trigger, queue entry, or a manual handoff. Identify the receiving system or team. |
| 4.2 | "Payment processing" is undefined | No indication of who processes the payment or what the timeline is | (a) Payment is processed by the same AP team immediately after approval. (b) A separate finance/treasury team handles payment on defined payment terms (e.g., Net 30). | Clarify who is responsible for payment processing and what the expected payment timeline is. |
| 4.3 | No feedback loop defined | It is unclear whether payment completion is tracked in the system | (a) The portal only forwards the invoice and has no further visibility. (b) The portal tracks and displays payment status (Pending, Paid). (c) The vendor receives a notification when payment is made. | Specify whether the portal tracks post-approval payment status and whether vendors are notified upon payment. |

---

## REQ-05: Both parties receive email notifications on status changes

### Ambiguous Statements

| # | Ambiguous Statement | Why It Is Ambiguous | Possible Interpretations | Recommended Clarification |
|---|---------------------|----------------------|--------------------------|---------------------------|
| 5.1 | "Both parties" | Who the two parties are is assumed but not stated | (a) Vendor and the AP team. (b) Vendor and the finance/payment team. (c) All three: vendor, AP team, and payment team. | Explicitly name the parties who receive notifications for each status event. |
| 5.2 | "Status changes" — triggers not enumerated | Which events constitute a "status change" is not defined | (a) Only approval and rejection trigger notifications. (b) Every status change triggers a notification: submitted, under review, approved, rejected, forwarded for payment, paid. | List all status events and map which notification goes to which party for each event. |
| 5.3 | "Email notifications" — content is undefined | The content and format of the notification email is not specified | (a) A simple one-line status update (e.g., "Your invoice has been approved"). (b) Full invoice details included in the email body. (c) A link back to the portal for full details. | Define the content template for each notification type, including what data fields and links must be present. |
| 5.4 | No mention of notification preferences | It is unclear if notifications can be configured or opted out of | (a) All notifications are mandatory and cannot be turned off. (b) Users can configure which notifications they receive. | Specify whether notifications are system-mandatory or user-configurable. |

---

## REQ-06: The system generates monthly invoice activity reports

### Ambiguous Statements

| # | Ambiguous Statement | Why It Is Ambiguous | Possible Interpretations | Recommended Clarification |
|---|---------------------|----------------------|--------------------------|---------------------------|
| 6.1 | "Monthly invoice activity reports" | The content of the report is not defined | (a) A count of invoices by status. (b) Total invoice value processed, broken down by vendor and status. (c) A detailed line-by-line log of all invoice transactions. | Define the exact data points the report must include (e.g., total submitted, approved, rejected, paid; amounts; vendor breakdown). |
| 6.2 | "Generates" — trigger is not defined | It is unclear when and how the report is produced | (a) Automatically generated at the end of each calendar month. (b) Generated on the first day of the following month. (c) Generated on demand by an AP user for any selected month. | Specify the generation trigger (scheduled vs. on-demand) and the exact time/date for scheduled reports. |
| 6.3 | No mention of who can access reports | Report audience and access control are not stated | (a) All AP team members can view all reports. (b) Only AP managers or finance leads can view reports. (c) Reports are automatically emailed to a defined distribution list. | Define who can access reports in the portal and whether they are also auto-distributed via email. |
| 6.4 | No mention of report format or export | Output format is not specified | (a) Report is viewable only within the portal (no download). (b) Report can be exported as PDF. (c) Report can be exported as CSV or Excel for further analysis. | Specify the report format and whether export is required, and in which formats. |
| 6.5 | "Monthly" scope is ambiguous | The definition of a reporting month is not stated | (a) Calendar month (1st to last day). (b) Rolling 30-day window. (c) Fiscal month, which may differ from the calendar month. | Confirm whether "monthly" means calendar month or fiscal month and the exact date range covered. |

---

## REQ-07: Only authorized users may access the system

### Ambiguous Statements

| # | Ambiguous Statement | Why It Is Ambiguous | Possible Interpretations | Recommended Clarification |
|---|---------------------|----------------------|--------------------------|---------------------------|
| 7.1 | "Authorized users" | "Authorized" is not defined — it conflates authentication and authorization | (a) Any registered and logged-in user is authorized. (b) A user must be registered AND explicitly approved by an admin. (c) Authorization is role-based — different users can access different parts of the system. | Define what "authorized" means: registration alone, admin approval, or role assignment. Separate authentication (identity) from authorization (permissions). |
| 7.2 | "Access the system" | Unclear whether this means the entire portal or specific features | (a) Unauthorized users cannot reach any page of the portal. (b) Unauthorized users can see the login/register page but nothing else. (c) Certain features are restricted by role even for logged-in users. | Specify which parts of the system require authorization and what an unauthorized access attempt looks like (redirect, error page, HTTP 403). |
| 7.3 | No mention of session management | User session behavior after login is not defined | (a) A session remains active indefinitely. (b) A session expires after a period of inactivity (e.g., 30 minutes). (c) Only one active session per user is allowed at a time. | Define session timeout duration, behavior on timeout, and whether concurrent sessions from multiple devices are permitted. |
| 7.4 | No mention of how authorization is granted or revoked | The administration of user access is not addressed | (a) Users manage their own access. (b) An admin grants and revokes access. (c) Access is automatically revoked after a defined period of inactivity. | Define who is responsible for granting, modifying, and revoking user access, and the process to do so. |

---

## Summary

| REQ | Total Ambiguities Identified |
|-----|------------------------------|
| REQ-01 | 4 |
| REQ-02 | 5 |
| REQ-03 | 5 |
| REQ-04 | 3 |
| REQ-05 | 4 |
| REQ-06 | 5 |
| REQ-07 | 4 |
| **Total** | **30** |

All 30 ambiguities should be resolved with the client/product owner before development or test case authoring begins. Unresolved ambiguities at this stage will result in rework, missed test scenarios, and misaligned stakeholder expectations.
