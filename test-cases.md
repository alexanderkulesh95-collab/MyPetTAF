# Test Cases List

This document contains all test cases in the MyPetTAF project.

**Total Test Cases: 24**

---

## Authentication - Login Tests

1. TC-001: Verify successful login with valid credentials
2. TC-002: Verify login fails with invalid username
3. TC-003: Verify login fails with invalid password
4. TC-004: Verify login fails with empty username
5. TC-005: Verify login fails with empty password
6. TC-006: Verify successful logout
7. TC-007: Verify locked out user cannot login

---

## Cart - Cart Tests

1. TC-001: Verify cart displays correct product details (name, description, price, quantity)
2. TC-002: Verify removing product from cart using "Remove" button
3. TC-003: Verify "Continue Shopping" button navigates back to inventory page
4. TC-004: Verify "Checkout" button navigates to checkout page

---

## Inventory - Inventory Tests

1. TC-001: Verify all items are present in inventory page
2. TC-002: Verify all navigation in inventory page
   - Validates navigation to product details for all 6 products (Backpack, Bike Light, Bolt T-Shirt, Fleece Jacket, Onesie, allTheThings T-Shirt)
3. TC-003: Verify sorting products by Name (A to Z)
4. TC-004: Verify sorting products by Name (Z to A)
5. TC-005: Verify sorting products by Price (low to high)
6. TC-006: Verify sorting products by Price (high to low)
7. TC-007: Verify "Add to cart" button changes to "Remove" and cart badge updates
8. TC-008: Verify removing product from inventory page decreases cart count

---

## Checkout - Checkout Page Tests

1. TC-001: Verify filling checkout form with valid data and continue to checkout overview
2. TC-002: Verify cancel button returns to cart page
3. TC-003: Verify error messages for empty required fields
   - Empty first name validation
   - Empty last name validation
   - Empty postal code validation

---

## Checkout - Checkout Overview Page Tests

1. TC-001: Verify product details and complete order
2. TC-002: Verify cancel button navigation

---

*Generated on March 3, 2026*
