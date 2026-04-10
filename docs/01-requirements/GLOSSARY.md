# Glossary

**Version:** 1.0.0 | **Date:** 2026-04-07

This glossary defines all terms used across the platform documentation. Terminology is standardized to ensure consistency.

---

## Terms

### A

| Term               | Definition                                                                                                                                                                             | Synonyms | Source    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------- |
| **Argon2**         | A password-hashing algorithm selected as the winner of the Password Hashing Competition in 2015. It is memory-hard and resistant to GPU/ASIC attacks. Used for hashing user passwords. | Argon2id | OWASP     |
| **Authentication** | The process of verifying the identity of a user or system. In this platform, achieved via JWT tokens and Argon2-hashed passwords.                                                      | Auth     | BRD FR-01 |
| **Authorization**  | The process of determining what actions an authenticated user is permitted to perform. Implemented via RBAC (USER, SELLER, ADMIN) in this platform.                                    | AuthZ    | BRD FR-01 |

### B

| Term      | Definition                                                                                                                                                                      | Synonyms                       | Source        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------- |
| **Buyer** | An end-user of the platform who purchases products from sellers. A buyer is a user with role `USER`. Also referred to as "Customer" in BRD.                                     | Customer, End User             | BRD Section 8 |
| **BRD**   | Business Requirements Document. The foundational document describing business objectives, functional and non-functional requirements, and acceptance criteria for the platform. | Business Requirements Document | Internal      |

### C

| Term                | Definition                                                                                                                                                                                                      | Synonyms                  | Source                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | -------------------------------------- |
| **Cart**            | A temporary holding area for products a buyer intends to purchase. The cart is user-scoped and persists across sessions for logged-in users.                                                                    | Shopping Cart             | BRD FR-05                              |
| **CDN**             | Content Delivery Network. A geographically distributed network of proxy servers that serve content (images, static assets) to users with high availability and performance.                                     | Content Delivery Network  | BRD Section 5                          |
| **Circuit Breaker** | A design pattern used to detect failures and prevent cascading failures across distributed systems. When a downstream service fails repeatedly, the circuit "opens" and fast-fails requests instead of waiting. | CB                        | ecommerce_multi_vendor_architecture.md |
| **Commission**      | A percentage of the order value that the platform retains from each sale. Configurable per seller and stored in the settlement ledger.                                                                          | Platform Fee, Service Fee | BRD FR-08                              |
| **Customer**        | See **Buyer**. The term "Customer" is used in BRD Section 8 persona descriptions. In all other documentation, use "Buyer".                                                                                      | Buyer                     | BRD Section 8                          |

### G

| Term    | Definition                                                                                                                                                             | Synonyms                 | Source        |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------- |
| **GMV** | Gross Merchandise Value. The total value of merchandise sold through the platform over a given period, before any deductions. Key business metric for platform growth. | Gross Merchandise Volume | BRD Section 2 |

### I

| Term                      | Definition                                                                                                                                                                                                   | Synonyms                | Source         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- | -------------- |
| **Idempotency Key**       | A unique key included in API requests (especially payment requests) to ensure that the same operation is not executed multiple times even if the request is retried. Prevents duplicate payments and orders. | Idempotency Token       | BRD Section 12 |
| **Inventory**             | The stock of products available for sale. Includes total stock and reserved stock (allocated to pending orders). Managed at the ProductVariant level.                                                        | Stock                   | BRD FR-04      |
| **Inventory Reservation** | A temporary hold on a specific quantity of inventory when a buyer proceeds to checkout. The reservation expires after a configurable timeout if payment is not confirmed.                                    | Stock Reservation, Hold | BRD FR-04      |

### J

| Term    | Definition                                                                                                                                                  | Synonyms       | Source    |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | --------- |
| **JWT** | JSON Web Token. A compact, URL-safe token format for securely transmitting information between parties. Used for stateless authentication in this platform. | JSON Web Token | BRD FR-01 |

### K

| Term    | Definition                                                                                                                                                                                                                                        | Synonyms           | Source    |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | --------- |
| **KYC** | Know Your Customer. The process of verifying the identity of sellers during onboarding. Includes business registration documents, identity proof, and bank account verification. Admin approval is required before a seller can publish products. | Know Your Customer | BRD FR-02 |

### L

| Term       | Definition                                                                                                                                                                                         | Synonyms         | Source                                 |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | -------------------------------------- |
| **Ledger** | A financial record-keeping system where every transaction (credit or debit) is recorded as an immutable entry. The seller's balance is always derived from ledger entries, never updated directly. | Financial Ledger | ecommerce_multi_vendor_architecture.md |

### M

| Term                 | Definition                                                                                                                                                                                                                                          | Synonyms         | Source                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | --------------------------------------------- |
| **Modular Monolith** | An architectural style where the application is built as a single deployable unit, but internally organized into well-defined, independent modules with clear boundaries. This is the Phase 1 architecture. It can evolve into microservices later. | Modular Monolith | ecommerce_multi_vendor_architecture.md        |
| **Microservices**    | An architectural style where the application is decomposed into small, independently deployable services, each owning its own data. This is the Phase 3 target architecture.                                                                        | MSA              | 1M_User_Marketplace_Architecture_Blueprint.md |

### O

| Term                   | Definition                                                                                                                                                                                                                | Synonyms        | Source                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------------------------------------- |
| **Order**              | A parent order created when a buyer completes checkout. It contains multiple sub-orders, one per seller. Represents the buyer's purchase intent.                                                                          | Parent Order    | ecommerce_multi_vendor_architecture.md |
| **Optimistic Locking** | A concurrency control strategy where a record is read with a version number, and updates are only applied if the version matches. If not, the update is rejected, preventing lost updates. Used for inventory management. | Optimistic Lock | BRD FR-04                              |
| **OWASP**              | Open Web Application Security Project. A nonprofit foundation that works to improve the security of software. The OWASP Top 10 lists the most critical web application security risks.                                    | OWASP Top 10    | BRD Section 12                         |

### P

| Term                | Definition                                                                                                                                                                                                                                                                                          | Synonyms                     | Source                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------------- |
| **Parent Order**    | See **Order**. The term "Parent Order" refers to the top-level order entity that groups sub-orders from different sellers.                                                                                                                                                                          | Order                        | ecommerce_multi_vendor_architecture.md |
| **PCI-DSS**         | Payment Card Industry Data Security Standard. A set of security standards designed to ensure that all companies that accept, process, store, or transmit credit card information maintain a secure environment. In this platform, most compliance is handled by the payment gateway (e.g., Stripe). | PCI DSS                      | BRD Section 14                         |
| **PDPA**            | Personal Data Protection Act. Singapore's data protection law governing the collection, use, and disclosure of personal data. Applicable to APAC operations.                                                                                                                                        | Personal Data Protection Act | BRD Section 14                         |
| **Payment**         | A financial transaction record linking an order to its payment status. Contains the payment gateway reference, amount, status, and idempotency key.                                                                                                                                                 | Transaction                  | BRD FR-06                              |
| **Product**         | A seller's offering listed on the platform. Contains name, description, price, SKU, images, and variants. A product belongs to exactly one seller.                                                                                                                                                  | Listing, Item                | BRD FR-03                              |
| **PENDING_PAYMENT** | An order state indicating that checkout has been completed but payment has not yet been confirmed.                                                                                                                                                                                                  | Pending                      | BRD FR-07                              |

### R

| Term         | Definition                                                                                                                                   | Synonyms                 | Source          |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | --------------- |
| **RPO**      | Recovery Point Objective. The maximum acceptable amount of data loss measured in time. For this platform: less than 15 minutes of data loss. | Recovery Point Objective | BRD Section 7.2 |
| **RTO**      | Recovery Time Objective. The maximum acceptable time to restore a system after a failure. For this platform: less than 2 hours.              | Recovery Time Objective  | BRD Section 7.2 |
| **REFUNDED** | An order state indicating that a refund has been processed and the payment has been returned to the buyer.                                   | Refunded                 | BRD FR-07       |

### S

| Term          | Definition                                                                                                                                                                                                 | Synonyms                   | Source                                 |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | -------------------------------------- |
| **Seller**    | A marketplace participant who registers, gets approved (KYC), and lists products for sale on the platform. A seller is a user with role `SELLER`. Previously referred to as "Vendor" in architecture docs. | Vendor, Shop Owner         | BRD FR-02                              |
| **SKU**       | Stock Keeping Unit. A unique identifier assigned by the seller to each product or variant for inventory tracking. SKU must be unique per seller.                                                           | Stock Keeping Unit         | BRD FR-03                              |
| **Sub-Order** | A child order associated with a specific seller within a parent order. Each sub-order is fulfilled independently by its seller.                                                                            | Seller Order, Vendor Order | ecommerce_multi_vendor_architecture.md |

### V

| Term        | Definition                                                                                                                                                       | Synonyms                     | Source    |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | --------- |
| **Variant** | A specific version of a product distinguished by attributes (e.g., size: S/M/L, color: red/blue). Each variant has its own SKU, price override, and stock level. | Product Variant, SKU Variant | BRD FR-03 |

---

## Order Status Flow

```
PENDING_PAYMENT → PAID → PROCESSING → SHIPPED → COMPLETED
       ↓            ↓         ↓          ↓
  CANCELLED    CANCELLED  CANCELLED  REFUNDED
```

| Status              | Description                                  |
| ------------------- | -------------------------------------------- |
| **PENDING_PAYMENT** | Order created, awaiting payment confirmation |
| **PAID**            | Payment confirmed                            |
| **PROCESSING**      | Seller is preparing the order                |
| **SHIPPED**         | Order has been shipped                       |
| **COMPLETED**       | Order delivered and confirmed                |
| **CANCELLED**       | Order cancelled before completion            |
| **REFUNDED**        | Payment refunded to buyer                    |

---

## Role Definitions

| Role       | Description          | Permissions                                                                             |
| ---------- | -------------------- | --------------------------------------------------------------------------------------- |
| **USER**   | End customer / buyer | Browse, cart, checkout, order history, reviews                                          |
| **SELLER** | Marketplace seller   | All USER permissions + product management, seller dashboard, order fulfillment          |
| **ADMIN**  | Platform operator    | All permissions + seller approval, dispute resolution, commission management, analytics |

---

_Referenced by all platform documentation. For new terms, add alphabetically with Definition, Synonyms, and Source._
