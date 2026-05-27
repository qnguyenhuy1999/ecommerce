# AI rules — Database

Database cave has sharp rocks. Step careful.

## Applies to

```txt
packages/database
apps/api-storefront
apps/api-seller
apps/api-admin
apps/worker
```

## Goal

Keep schema safe, queries fast, and writes consistent.

## Prisma

Prisma lives in:

```txt
packages/database
```

After schema changes:

```bash
pnpm db:generate
pnpm db:migrate
```

Do not manually edit generated Prisma client.

## Migration rule

Prefer new migration.

Do not edit old migrations unless task explicitly says and database is not shared/production.

Schema change should match product requirement.

Do not add unused columns "just in case".

## Transactions

Use transaction when multiple writes must succeed together.

Good:

```ts
await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: orderData })

  await tx.orderItem.createMany({
    data: items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
    })),
  })

  return order
})
```

Use transactions for:

- order creation + order items
- payment update + order update
- stock decrement + order creation
- refund update + inventory/payment record
- seller payout + ledger movement

No partial broken state.

## Query rule

Avoid N+1 queries.

Prefer:

- `include` only when needed
- `select` for narrow payloads
- pagination for lists
- indexed filters/sorts
- batch queries where possible

Bad:

```ts
for (const item of items) {
  await prisma.product.findUnique({ where: { id: item.productId } })
}
```

Better:

```ts
await prisma.product.findMany({
  where: { id: { in: productIds } },
})
```

## Pagination

All large lists need pagination.

Common marketplace lists:

- products
- orders
- sellers
- users
- reviews
- audit logs
- transactions
- notifications

Stable sorting required.

Use `createdAt + id` or another deterministic tie-breaker when needed.

## Indexes

Add indexes for common filters/sorts.

Examples:

- `sellerId`
- `status`
- `createdAt`
- `categoryId`
- `orderId`
- `userId`
- compound indexes for frequent queries

Do not add random indexes. Index helps read, hurts write.

## Soft delete

Follow existing repo pattern.

If model uses soft delete, queries must exclude deleted rows unless explicitly needed.

## Money

Do not use floating point for money.

Use integer minor units or Decimal based on existing repo pattern.

Be consistent.

## Final checks

Relevant checks:

```bash
pnpm db:generate
pnpm db:migrate
pnpm type-check
pnpm test
```

No fake green.
