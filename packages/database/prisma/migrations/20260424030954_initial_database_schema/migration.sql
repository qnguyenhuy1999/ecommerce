-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('USER', 'SELLER', 'ADMIN');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('UNVERIFIED', 'ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "kyc_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "product_status" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'DELETED');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'REFUNDED', 'PENDING_REFUND');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "reservation_status" AS ENUM ('ACTIVE', 'EXPIRED', 'CONFIRMED');

-- CreateEnum
CREATE TYPE "ledger_type" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('ORDER_PAID', 'ORDER_SHIPPED', 'ORDER_COMPLETED', 'ORDER_CANCELLED', 'REFUND_APPROVED', 'REFUND_REJECTED', 'SELLER_APPROVED', 'SELLER_REJECTED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'NEW_ORDER');

-- CreateEnum
CREATE TYPE "outbox_status" AS ENUM ('PENDING', 'PUBLISHED', 'FAILED');

-- CreateEnum
CREATE TYPE "idempotency_status" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "user_role" NOT NULL DEFAULT 'USER',
    "status" "user_status" NOT NULL DEFAULT 'UNVERIFIED',
    "email_verified" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sellers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "store_name" TEXT NOT NULL,
    "store_description" TEXT,
    "kyc_status" "kyc_status" NOT NULL DEFAULT 'PENDING',
    "kyc_documents" JSONB,
    "commission_rate" DOUBLE PRECISION NOT NULL DEFAULT 0.10,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_ratings" INTEGER NOT NULL DEFAULT 0,
    "business_registration_number" TEXT,
    "bank_account_number" TEXT,
    "bank_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sellers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "status" "product_status" NOT NULL DEFAULT 'DRAFT',
    "category_id" TEXT,
    "images" TEXT[],
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "price_override" DOUBLE PRECISION,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "reserved_stock" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_reservations" (
    "id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "status" "reservation_status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "order_number" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "status" "order_status" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "subtotal" DOUBLE PRECISION NOT NULL,
    "shipping_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "shipping_address" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_orders" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "status" "order_status" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "shipping_tracking" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "sub_order_id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "price_snapshot" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_reference" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'SGD',
    "status" "payment_status" NOT NULL DEFAULT 'PENDING',
    "idempotency_key" TEXT NOT NULL,
    "webhook_received_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commissions" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "notification_type" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_ledger" (
    "id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "type" "ledger_type" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reference_type" TEXT,
    "reference_id" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seller_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "replaced_by" TEXT,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_events" (
    "id" TEXT NOT NULL,
    "aggregate_type" TEXT NOT NULL,
    "aggregate_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "outbox_status" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "last_error" TEXT,
    "available_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outbox_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "idempotency_keys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "user_id" TEXT,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "request_hash" TEXT NOT NULL,
    "status" "idempotency_status" NOT NULL DEFAULT 'IN_PROGRESS',
    "status_code" INTEGER,
    "response_body" JSONB,
    "locked_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_user_id_key" ON "sellers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_store_name_key" ON "sellers"("store_name");

-- CreateIndex
CREATE INDEX "sellers_user_id_idx" ON "sellers"("user_id");

-- CreateIndex
CREATE INDEX "sellers_kyc_status_idx" ON "sellers"("kyc_status");

-- CreateIndex
CREATE INDEX "sellers_store_name_idx" ON "sellers"("store_name");

-- CreateIndex
CREATE INDEX "sellers_rating_idx" ON "sellers"("rating");

-- CreateIndex
CREATE INDEX "products_seller_id_idx" ON "products"("seller_id");

-- CreateIndex
CREATE INDEX "products_status_idx" ON "products"("status");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "products_name_idx" ON "products"("name");

-- CreateIndex
CREATE INDEX "products_price_idx" ON "products"("price");

-- CreateIndex
CREATE INDEX "products_deleted_at_idx" ON "products"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "products_seller_id_sku_key" ON "products"("seller_id", "sku");

-- CreateIndex
CREATE INDEX "product_variants_product_id_idx" ON "product_variants"("product_id");

-- CreateIndex
CREATE INDEX "product_variants_sku_idx" ON "product_variants"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_product_id_sku_key" ON "product_variants"("product_id", "sku");

-- CreateIndex
CREATE INDEX "inventory_reservations_variant_id_idx" ON "inventory_reservations"("variant_id");

-- CreateIndex
CREATE INDEX "inventory_reservations_order_id_idx" ON "inventory_reservations"("order_id");

-- CreateIndex
CREATE INDEX "inventory_reservations_status_idx" ON "inventory_reservations"("status");

-- CreateIndex
CREATE INDEX "inventory_reservations_expires_at_idx" ON "inventory_reservations"("expires_at");

-- CreateIndex
CREATE INDEX "inventory_reservations_status_expires_at_idx" ON "inventory_reservations"("status", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_key" ON "carts"("user_id");

-- CreateIndex
CREATE INDEX "carts_user_id_idx" ON "carts"("user_id");

-- CreateIndex
CREATE INDEX "cart_items_cart_id_idx" ON "cart_items"("cart_id");

-- CreateIndex
CREATE INDEX "cart_items_variant_id_idx" ON "cart_items"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_id_variant_id_key" ON "cart_items"("cart_id", "variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX "orders_buyer_id_idx" ON "orders"("buyer_id");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_order_number_idx" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX "orders_created_at_idx" ON "orders"("created_at");

-- CreateIndex
CREATE INDEX "orders_deleted_at_idx" ON "orders"("deleted_at");

-- CreateIndex
CREATE INDEX "sub_orders_order_id_idx" ON "sub_orders"("order_id");

-- CreateIndex
CREATE INDEX "sub_orders_seller_id_idx" ON "sub_orders"("seller_id");

-- CreateIndex
CREATE INDEX "sub_orders_status_idx" ON "sub_orders"("status");

-- CreateIndex
CREATE UNIQUE INDEX "sub_orders_order_id_seller_id_key" ON "sub_orders"("order_id", "seller_id");

-- CreateIndex
CREATE INDEX "order_items_sub_order_id_idx" ON "order_items"("sub_order_id");

-- CreateIndex
CREATE INDEX "order_items_variant_id_idx" ON "order_items"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_order_id_key" ON "payments"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_idempotency_key_key" ON "payments"("idempotency_key");

-- CreateIndex
CREATE INDEX "payments_order_id_idx" ON "payments"("order_id");

-- CreateIndex
CREATE INDEX "payments_provider_idx" ON "payments"("provider");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_idempotency_key_idx" ON "payments"("idempotency_key");

-- CreateIndex
CREATE INDEX "payments_provider_reference_idx" ON "payments"("provider_reference");

-- CreateIndex
CREATE INDEX "commissions_order_id_idx" ON "commissions"("order_id");

-- CreateIndex
CREATE INDEX "commissions_seller_id_idx" ON "commissions"("seller_id");

-- CreateIndex
CREATE INDEX "commissions_created_at_idx" ON "commissions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "commissions_order_id_seller_id_key" ON "commissions"("order_id", "seller_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_created_at_idx" ON "notifications"("user_id", "is_read", "created_at");

-- CreateIndex
CREATE INDEX "seller_ledger_seller_id_idx" ON "seller_ledger"("seller_id");

-- CreateIndex
CREATE INDEX "seller_ledger_type_idx" ON "seller_ledger"("type");

-- CreateIndex
CREATE INDEX "seller_ledger_reference_type_reference_id_idx" ON "seller_ledger"("reference_type", "reference_id");

-- CreateIndex
CREATE INDEX "seller_ledger_created_at_idx" ON "seller_ledger"("created_at");

-- CreateIndex
CREATE INDEX "seller_ledger_seller_id_created_at_idx" ON "seller_ledger"("seller_id", "created_at");

-- CreateIndex
CREATE INDEX "reviews_seller_id_idx" ON "reviews"("seller_id");

-- CreateIndex
CREATE INDEX "reviews_product_id_idx" ON "reviews"("product_id");

-- CreateIndex
CREATE INDEX "reviews_user_id_idx" ON "reviews"("user_id");

-- CreateIndex
CREATE INDEX "reviews_rating_idx" ON "reviews"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_order_id_product_id_user_id_key" ON "reviews"("order_id", "product_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_family_idx" ON "refresh_tokens"("family");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "outbox_events_status_available_at_idx" ON "outbox_events"("status", "available_at");

-- CreateIndex
CREATE INDEX "outbox_events_aggregate_type_aggregate_id_idx" ON "outbox_events"("aggregate_type", "aggregate_id");

-- CreateIndex
CREATE INDEX "outbox_events_created_at_idx" ON "outbox_events"("created_at");

-- CreateIndex
CREATE INDEX "idempotency_keys_expires_at_idx" ON "idempotency_keys"("expires_at");

-- CreateIndex
CREATE INDEX "idempotency_keys_status_idx" ON "idempotency_keys"("status");

-- CreateIndex
CREATE UNIQUE INDEX "idempotency_keys_key_user_id_method_path_key" ON "idempotency_keys"("key", "user_id", "method", "path");

-- AddForeignKey
ALTER TABLE "sellers" ADD CONSTRAINT "sellers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_reservations" ADD CONSTRAINT "inventory_reservations_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_orders" ADD CONSTRAINT "sub_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_orders" ADD CONSTRAINT "sub_orders_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_sub_order_id_fkey" FOREIGN KEY ("sub_order_id") REFERENCES "sub_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_ledger" ADD CONSTRAINT "seller_ledger_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
