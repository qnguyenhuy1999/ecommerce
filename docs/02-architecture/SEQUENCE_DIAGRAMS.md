# Sequence Diagrams

**Version:** 1.0.0 | **Date:** 2026-04-07

> **Related Documents:**
>
> - [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) — Architecture overview this diagrams are part of
> - [GLOSSARY.md](./../01-requirements/GLOSSARY.md) — Term definitions

---

## Table of Contents

1. [Flash Sale Checkout Flow](#1-flash-sale-checkout-flow)
2. [Normal Order Flow](#2-normal-order-flow)
3. [Payment Webhook Flow](#3-payment-webhook-flow)
4. [Inventory Reservation Flow](#4-inventory-reservation-flow)
5. [Refund Flow](#5-refund-flow)
6. [Seller Onboarding Flow](#6-seller-onboarding-flow)

---

## 1. Flash Sale Checkout Flow

### Mermaid Diagram

```mermaid
sequenceDiagram
    participant Buyer
    participant API_Gateway
    participant Inventory_Service
    participant Redis
    participant Order_Service
    participant Kafka
    participant Payment_Service
    participant Worker

    Note over Buyer,Redis: Flash Sale Mode - Pre-loaded inventory in Redis
    Buyer->>API_Gateway: POST /orders (checkout)
    API_Gateway->>Inventory_Service: Reserve Stock Request
    Inventory_Service->>Redis: DECRBY stock:{sku} {quantity}
    Redis-->>Inventory_Service: remaining_stock
    Inventory_Service->>Inventory_Service: Check: remaining >= 0 ?

    alt Stock Available
        Inventory_Service->>Redis: DECR confirmed
        Redis-->>API_Gateway: Reservation Successful
        API_Gateway->>Order_Service: Create Order (PENDING_PAYMENT)
        Order_Service->>Kafka: Publish ORDER_CREATED
        Kafka-->>Order_Service: Event acknowledged
        Order_Service-->>API_Gateway: Order created: {orderId}
        API_Gateway-->>Buyer: 201 Created (orderId)
        Buyer->>Payment_Service: Initiate Payment
        Payment_Service-->>Buyer: Redirect to Payment Gateway
    else Stock Depleted
        Redis-->>Inventory_Service: remaining < 0
        Inventory_Service->>Redis: INCRBY stock:{sku} {quantity}
        Redis-->>API_Gateway: Out of Stock
        API_Gateway-->>Buyer: 409 Conflict (SOLD_OUT)
    end

    Note over Worker: Async: Payment confirmation triggers settlement
    Worker->>Kafka: Consume PAYMENT_CONFIRMED
    Worker->>Inventory_Service: Confirm Stock Deduction (DB update)
    Worker->>Order_Service: Update Order → PAID
```

### Step-by-Step Explanation

**Step 1: Stock Reservation (Atomic)**

- Before the flash sale, inventory is pre-loaded into Redis as atomic counters
- On checkout, Inventory_Service calls `DECRBY` (atomic decrement) on Redis
- If remaining stock >= 0: reservation is successful
- If remaining stock < 0: immediately call `INCRBY` to restore and return SOLD_OUT

**Step 2: Order Creation**

- Once stock is reserved, Order_Service creates a parent order and sub-orders
- Publishes `ORDER_CREATED` event to Kafka
- Returns order ID to buyer immediately

**Step 3: Payment**

- Buyer is redirected to payment gateway
- Payment gateway processes payment

**Step 4: Async Settlement**

- Worker consumes `PAYMENT_CONFIRMED` from Kafka
- Confirms stock deduction in the database (async)
- Updates order status to PAID
- Triggers email notification

---

## 2. Normal Order Flow

### Mermaid Diagram

```mermaid
sequenceDiagram
    participant Buyer
    participant API_Gateway
    participant Cart_Service
    participant Order_Service
    participant Inventory_Service
    participant Payment_Service
    participant Worker

    Buyer->>API_Gateway: POST /orders (checkout)
    API_Gateway->>Cart_Service: Get Cart Items
    Cart_Service-->>API_Gateway: [{sku, qty, sellerId}, ...]
    API_Gateway->>Order_Service: Create Order
    Order_Service->>Inventory_Service: Reserve Stock (per seller/sku)
    Inventory_Service-->>Order_Service: All reservations confirmed
    Order_Service->>Order_Service: Create parent Order + SubOrders
    Order_Service->>Payment_Service: Create Payment Intent
    Payment_Service-->>Order_Service: {paymentIntentId}
    Order_Service-->>API_Gateway: Order {orderId}, paymentIntent
    API_Gateway-->>Buyer: 201 Created (redirect to payment)
    Buyer->>Payment_Service: Complete Payment
    Payment_Service-->>Buyer: Payment Success Page
    Payment_Service->>Kafka: Publish PAYMENT_SUCCESS
    Kafka->>Worker: PAYMENT_SUCCESS
    Worker->>Order_Service: Update Order status → PAID
    Worker->>Worker: Trigger Confirmation Email
    Worker->>Inventory_Service: Confirm Stock Deduction
```

### Step-by-Step Explanation

**Step 1: Cart Validation**

- Fetch all cart items for the authenticated buyer
- Validate each item: product exists, seller is approved, stock is available

**Step 2: Inventory Reservation**

- For each seller, reserve the required stock
- Use optimistic locking (version field) for DB updates
- If any reservation fails, rollback all and return error

**Step 3: Order Creation**

- Create parent Order with status `PENDING_PAYMENT`
- Create SubOrder per seller with their respective items
- Calculate subtotal per seller (for commission calculation)

**Step 4: Payment Intent**

- Create payment intent with idempotency key (prevents duplicate charges)
- Return payment redirect URL to buyer

**Step 5: Payment Confirmation (Async)**

- Payment gateway calls webhook with payment result
- Worker processes PAYMENT_SUCCESS:
  - Updates order to `PAID`
  - Confirms inventory deduction
  - Sends confirmation email

---

## 3. Payment Webhook Flow

### Mermaid Diagram

```mermaid
sequenceDiagram
    participant Payment_Gateway
    participant Webhook_Endpoint
    participant Payment_Service
    participant Kafka
    participant Idempotency_Cache

    Payment_Gateway->>Webhook_Endpoint: POST /payments/webhook<br/>{paymentIntentId, status, signature}
    Webhook_Endpoint->>Webhook_Endpoint: Verify Gateway Signature
    Webhook_Endpoint->>Idempotency_Cache: Check idempotencyKey exists?
    Idempotency_Cache-->>Webhook_Endpoint: Key not found (first time)

    alt Payment Succeeded
        Webhook_Endpoint->>Payment_Service: Process Payment Success
        Payment_Service->>Payment_Service: Idempotency check passed
        Payment_Service->>Kafka: Publish PAYMENT_SUCCESS
        Kafka-->>Payment_Service: Event acknowledged
        Payment_Service->>Idempotency_Cache: Store idempotencyKey (TTL: 24h)
        Payment_Service->>Payment_Service: Update Payment record: SUCCESS
        Payment_Service-->>Webhook_Endpoint: 200 OK
    else Payment Failed
        Webhook_Endpoint->>Payment_Service: Process Payment Failure
        Payment_Service->>Kafka: Publish PAYMENT_FAILED
        Kafka-->>Payment_Service: Event acknowledged
        Payment_Service->>Payment_Service: Update Payment record: FAILED
        Payment_Service->>Kafka: Publish ORDER_EXPIRATION
        Kafka-->>Payment_Service: Event acknowledged
        Payment_Service-->>Webhook_Endpoint: 200 OK
    else Duplicate Webhook
        Idempotency_Cache-->>Webhook_Endpoint: Key found (already processed)
        Webhook_Endpoint-->>Payment_Gateway: 200 OK (no-op)
    end
    Payment_Gateway-->>Webhook_Endpoint: Webhook received
```

### Step-by-Step Explanation

**Step 1: Signature Verification**

- Payment gateways sign webhook payloads with a secret key
- Always verify the signature before processing

**Step 2: Idempotency Check**

- Check Redis for the idempotency key associated with this payment
- If key exists: return 200 OK immediately (duplicate, no-op)
- If key does not exist: process the payment

**Step 3: Payment Success Path**

- Update Payment record to SUCCESS
- Publish PAYMENT_SUCCESS to Kafka
- Store idempotency key in Redis (TTL: 24 hours)

**Step 4: Payment Failure Path**

- Update Payment record to FAILED
- Publish PAYMENT_FAILED to Kafka (triggers inventory release)
- Trigger order expiration countdown

---

## 4. Inventory Reservation Flow

### Mermaid Diagram

```mermaid
sequenceDiagram
    participant Order_Service
    participant Inventory_Service
    participant Redis
    participant Database
    participant Scheduler

    Order_Service->>Inventory_Service: Reserve Stock (sku, qty)

    alt Normal Mode (Non-Flash Sale)
        Inventory_Service->>Database: BEGIN TRANSACTION
        Inventory_Service->>Database: SELECT stock, version<br/>FROM ProductVariant<br/>WHERE sku = ?
        Database-->>Inventory_Service: {stock, version}
        Inventory_Service->>Inventory_Service: Check: stock >= qty ?
        Inventory_Service->>Database: UPDATE ProductVariant<br/>SET stock = stock - qty,<br/>reserved_stock = reserved_stock + qty,<br/>version = version + 1<br/>WHERE sku = ?<br/>AND version = ?
        Database-->>Inventory_Service: rowsAffected = 1
        Inventory_Service->>Database: INSERT InventoryReservation<br/>(sku, qty, orderId, expiresAt)
        Inventory_Service->>Database: COMMIT
        Inventory_Service-->>Order_Service: Reservation confirmed
    else Flash Sale Mode
        Inventory_Service->>Redis: DECRBY stock:{sku} {qty}
        Redis-->>Inventory_Service: remaining
        alt remaining >= 0
            Inventory_Service->>Database: INSERT InventoryReservation (async)
            Inventory_Service->>Database: UPDATE stock (async batch)
            Inventory_Service-->>Order_Service: Reservation confirmed
        else remaining < 0
            Inventory_Service->>Redis: INCRBY stock:{sku} {qty}
            Inventory_Service-->>Order_Service: OUT_OF_STOCK
        end
    end

    Note over Scheduler: Background: Cleanup expired reservations
    Scheduler->>Database: SELECT reservations<br/>WHERE status = ACTIVE<br/>AND expiresAt < NOW()
    Database-->>Scheduler: Expired reservations
    Scheduler->>Inventory_Service: Release expired reservations
    Inventory_Service->>Redis: INCRBY stock:{sku} {qty}
    Inventory_Service->>Database: UPDATE reservation status → EXPIRED
    Inventory_Service->>Database: UPDATE stock: restore reserved
```

### Step-by-Step Explanation

**Normal Mode (MVP):**

- Uses optimistic locking with a version field
- Read current stock and version in a transaction
- Attempt update only if version matches
- If rowsAffected = 0, retry (up to 3 times) or fail
- Insert reservation record with expiration timestamp

**Flash Sale Mode:**

- Redis DECRBY is atomic — no race conditions
- If counter goes negative, immediately restore and reject
- Database updates are batched asynchronously

**Expired Reservation Cleanup:**

- Scheduled job runs every minute
- Finds all ACTIVE reservations past their expiration time
- Releases reserved stock back to available pool
- Updates reservation status to EXPIRED

---

## 5. Refund Flow

### Mermaid Diagram

```mermaid
sequenceDiagram
    participant Buyer
    participant API_Gateway
    participant Order_Service
    participant Payment_Service
    participant Admin
    participant Payment_Gateway
    participant Kafka

    Buyer->>API_Gateway: POST /orders/{id}/refund<br/>{reason}
    API_Gateway->>Order_Service: Request Refund
    Order_Service->>Order_Service: Validate:<br/>status = SHIPPED|COMPLETED?<br/>refund not already requested?
    Order_Service->>Order_Service: Update Order status → PENDING_REFUND
    Order_Service->>Kafka: Publish REFUND_REQUESTED
    Kafka-->>Admin: Notify admin for review
    Admin->>Order_Service: Review refund request
    Order_Service-->>Admin: Show order details, refund amount

    alt Admin Approves
        Admin->>Order_Service: Approve Refund
        Order_Service->>Payment_Service: Process Refund
        Payment_Service->>Payment_Gateway: POST /refunds<br/>{paymentIntentId, amount}
        Payment_Gateway-->>Payment_Service: Refund initiated
        Payment_Gateway-->>Payment_Service: Refund confirmation webhook
        Payment_Service->>Kafka: Publish REFUND_SUCCESS
        Order_Service->>Order_Service: Update Order status → REFUNDED
        Order_Service->>Kafka: Publish ORDER_EXPIRATION (release stock if applicable)
        Kafka-->>Buyer: Refund confirmation email
    else Admin Rejects
        Admin->>Order_Service: Reject Refund
        Order_Service->>Order_Service: Update Order status → back to previous
        Order_Service->>Kafka: Publish REFUND_REJECTED
        Kafka-->>Buyer: Refund rejection email
    end
```

### Step-by-Step Explanation

**Step 1: Buyer Requests Refund**

- Buyer submits refund request with reason
- Order status transitions to `PENDING_REFUND`
- Admin is notified via Kafka queue

**Step 2: Admin Review**

- Admin reviews the request: checks order details, buyer history, refund reason
- Can approve or reject

**Step 3: Refund Processing**

- On approval, Payment_Service calls the payment gateway's refund API
- Payment gateway processes the refund and sends webhook confirmation
- Order status updated to `REFUNDED`
- Inventory is released back to available stock (if applicable)

---

## 6. Seller Onboarding Flow

### Mermaid Diagram

```mermaid
sequenceDiagram
    participant User
    participant API_Gateway
    participant Auth_Service
    participant Seller_Service
    participant Admin_Portal
    participant Admin
    participant Notification_Service

    User->>API_Gateway: POST /auth/register (role=SELLER)
    Auth_Service->>Auth_Service: Create User (status=UNVERIFIED)
    Auth_Service->>Notification_Service: Send verification email
    Auth_Service-->>User: 201 Created (verify email first)
    User->>API_Gateway: POST /auth/verify-email {token}
    Auth_Service->>Auth_Service: Mark email verified
    Auth_Service-->>User: 200 OK

    User->>API_Gateway: POST /sellers/register<br/>{storeName, businessInfo, kycDocs}
    API_Gateway->>Seller_Service: Create Seller Record
    Seller_Service->>Seller_Service: Create Seller (kycStatus=PENDING)
    Seller_Service->>Kafka: Publish SELLER_REGISTRATION
    Kafka-->>Admin_Portal: New seller pending review
    Seller_Service-->>User: 201 Created (kyc pending)

    Admin->>Admin_Portal: Review KYC Documents
    Admin_Portal-->>Admin: Show business docs, identity verification
    Admin->>Admin_Portal: Approve Seller
    Admin_Portal->>Seller_Service: Update kycStatus = APPROVED
    Seller_Service->>Kafka: Publish SELLER_APPROVED
    Kafka-->>Notification_Service: Send approval email to seller
    Notification_Service-->>User: Welcome email (can now publish products)

    alt KYC Rejected
        Admin->>Admin_Portal: Reject Seller (with reason)
        Admin_Portal->>Seller_Service: Update kycStatus = REJECTED
        Seller_Service->>Kafka: Publish SELLER_REJECTED
        Kafka-->>Notification_Service: Send rejection email with reason
        Notification_Service-->>User: Rejection email with appeal process
    end
```

### Step-by-Step Explanation

**Step 1: Registration**

- User registers with role = SELLER
- User record created with UNVERIFIED status
- Verification email sent immediately

**Step 2: Email Verification**

- User clicks verification link
- User status updated to VERIFIED
- User can now proceed to seller registration

**Step 3: Seller Registration**

- User submits KYC documents (business registration, identity proof, bank account)
- Seller record created with `kycStatus = PENDING`
- Admin is notified of new seller application

**Step 4: KYC Review**

- Admin reviews submitted documents
- May approve, reject, or request additional documents

**Step 5: Approval**

- On approval, seller status = APPROVED
- Seller receives welcome email
- Seller can now create and publish products

---

_All sequence diagrams follow [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) architectural decisions._
