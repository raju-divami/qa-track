# TC_CHECKOUT_VALIDATION — Checkout Form Validation

**Route**: `/checkout`
**Component**: `shop-checkout.js`
**Validation mechanism**: HTML5 `pattern` attributes + custom `aria-invalid` error messages

---

## CHK_VALID_001
**Title**: Submitting empty form shows validation errors
**Priority**: P0
**Preconditions**: Checkout page loaded with cart items; no fields filled

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Click "Place Order" without filling any fields | Form does not submit |
| 2 | Observe the form | At least one field is highlighted with an error state |
| 3 | Observe first invalid field | It receives focus and is scrolled into view |

---

## CHK_VALID_002
**Title**: Email field rejects invalid email format
**Priority**: P1
**Preconditions**: Checkout page loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter `notanemail` in the Email field | Value entered |
| 2 | Click "Place Order" | Form does not submit |
| 3 | Observe email field | Field is marked invalid (aria-invalid="true" or visual error) |

---

## CHK_VALID_003
**Title**: Email field accepts valid email format
**Priority**: P1
**Preconditions**: All other required fields are filled with valid data

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter `user@example.com` in the Email field | Value accepted |
| 2 | Submit the form | Email field does not block submission |

---

## CHK_VALID_004
**Title**: Phone field rejects fewer than 10 digits
**Priority**: P1
**Preconditions**: Checkout page loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter `12345` in the Phone Number field | Value entered |
| 2 | Click "Place Order" | Form does not submit |
| 3 | Observe phone field | Field shows error; error message "Invalid Phone Number" appears |

---

## CHK_VALID_005
**Title**: Phone field accepts 10 or more digits
**Priority**: P1
**Preconditions**: All other required fields are valid

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter `1234567890` in the Phone Number field | Value accepted |
| 2 | Submit the form | Phone field does not block submission |

---

## CHK_VALID_006
**Title**: Address field rejects fewer than 5 characters
**Priority**: P1
**Preconditions**: Checkout page loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter `123` in the Shipping Address field | Value entered |
| 2 | Click "Place Order" | Form does not submit |
| 3 | Observe address field | Field shows "Invalid Address" error |

---

## CHK_VALID_007
**Title**: City field rejects fewer than 2 characters
**Priority**: P1
**Preconditions**: Checkout page loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter `A` in the City field | Value entered |
| 2 | Click "Place Order" | Form does not submit |
| 3 | Observe city field | Field shows "Invalid City" error |

---

## CHK_VALID_008
**Title**: State field rejects fewer than 2 characters
**Priority**: P1
**Preconditions**: Checkout page loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter `X` in the State/Province field | Value entered |
| 2 | Click "Place Order" | Form does not submit |
| 3 | Observe state field | Field shows "Invalid State/Province" error |

---

## CHK_VALID_009
**Title**: Zip/Postal Code field rejects fewer than 4 characters
**Priority**: P1
**Preconditions**: Checkout page loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter `123` in the Zip/Postal Code field | Value entered |
| 2 | Click "Place Order" | Form does not submit |
| 3 | Observe zip field | Field shows "Invalid Zip/Postal Code" error |

---

## CHK_VALID_010
**Title**: Card name field rejects fewer than 3 characters
**Priority**: P1
**Preconditions**: Checkout page loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter `AB` in the Cardholder Name field | Value entered |
| 2 | Click "Place Order" | Form does not submit |
| 3 | Observe card name field | Field is marked invalid |

---

## CHK_VALID_011
**Title**: Card number field rejects fewer than 15 digits
**Priority**: P0
**Preconditions**: Checkout page loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter `12345678901234` (14 digits) in Card Number | Value entered |
| 2 | Click "Place Order" | Form does not submit |
| 3 | Observe card number field | Field is marked invalid |

---

## CHK_VALID_012
**Title**: Card number field accepts 15+ digits (with or without spaces)
**Priority**: P1
**Preconditions**: All other fields filled with valid data

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter `4111 1111 1111 1111` (16 digits with spaces) | Value accepted |
| 2 | Submit form | Card number field does not block submission |

---

## CHK_VALID_013
**Title**: CVV field rejects fewer than 3 digits
**Priority**: P1
**Preconditions**: Checkout page loaded

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter `12` in the CVV field | Value entered |
| 2 | Click "Place Order" | Form does not submit |
| 3 | Observe CVV field | Field is marked invalid |

---

## CHK_VALID_014
**Title**: CVV field accepts 3 digits
**Priority**: P1
**Preconditions**: All other fields filled with valid data

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter `123` in the CVV field | Value accepted |
| 2 | Submit form | CVV field does not block submission |

---

## CHK_VALID_015
**Title**: CVV field accepts 4 digits (Amex style)
**Priority**: P2
**Preconditions**: All other fields filled with valid data

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Enter `1234` in the CVV field | Value accepted |
| 2 | Submit form | CVV field does not block submission |

---

## CHK_VALID_016
**Title**: Billing address fields are required when billing toggle is checked
**Priority**: P1
**Preconditions**: Checkout page loaded; billing address toggle is checked

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Check the "Use a different billing address" checkbox | Billing fields appear |
| 2 | Fill all other fields except billing address fields | Billing address fields left empty |
| 3 | Click "Place Order" | Form does not submit |
| 4 | Observe billing fields | Billing address fields are highlighted as invalid |
