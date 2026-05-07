# Security Specification - MicroCaaS / Nexus DF

## Data Invariants
1. A user can only read and write their own profile in `/users/{userId}`.
2. Orders can only be created by authenticated users.
3. Users can only read their own orders.
4. Orders are immutable once created (except for status changes by admin, if implemented).

## The Dirty Dozen Payloads
- P1: Attempt to create a user profile for another UID.
- P2: Attempt to read someone else's order.
- P3: Attempt to create an order without being logged in.
- P4: Attempt to delete an order (orders should be kept for audit).
- P5: Attempt to update an order's total after creation.
- P6: Attempt to inject generic keys into a user profile.

## Test Runner (Draft)
A test file `firestore.rules.test.ts` will verify these denials.
