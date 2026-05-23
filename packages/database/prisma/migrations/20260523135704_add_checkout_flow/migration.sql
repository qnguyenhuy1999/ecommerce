-- CreateEnum
CREATE TYPE "CheckoutStep" AS ENUM ('ADDRESS', 'SHIPPING', 'PAYMENT', 'REVIEW', 'CONFIRMED', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DistributionEvent" AS ENUM ('INVENTORY_RESERVED', 'INVENTORY_DEDUCTED', 'ORDER_CREATED', 'SELLER_ORDERS_SPLIT', 'PAYMENT_INITIATED', 'NOTIFICATION_SENT', 'INVENTORY_RELEASED', 'FAILED');

-- CreateEnum
CREATE TYPE "DistributionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "user_addresses" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "recipient_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address_line" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "country_code" VARCHAR(2) NOT NULL DEFAULT 'SG',
    "label" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkout_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "step" "CheckoutStep" NOT NULL DEFAULT 'ADDRESS',
    "address_id" UUID,
    "shipping_selections" JSONB,
    "payment_method" JSONB,
    "coupon_code" TEXT,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "shipping_fee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "order_id" UUID,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checkout_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkout_distribution_logs" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "order_id" UUID,
    "event" "DistributionEvent" NOT NULL,
    "status" "DistributionStatus" NOT NULL,
    "payload" JSONB,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checkout_distribution_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_addresses_user_id_idx" ON "user_addresses"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "checkout_sessions_idempotency_key_key" ON "checkout_sessions"("idempotency_key");

-- CreateIndex
CREATE INDEX "checkout_sessions_user_id_idx" ON "checkout_sessions"("user_id");

-- CreateIndex
CREATE INDEX "checkout_sessions_idempotency_key_idx" ON "checkout_sessions"("idempotency_key");

-- CreateIndex
CREATE INDEX "checkout_sessions_expires_at_idx" ON "checkout_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "checkout_distribution_logs_session_id_idx" ON "checkout_distribution_logs"("session_id");

-- CreateIndex
CREATE INDEX "checkout_distribution_logs_order_id_idx" ON "checkout_distribution_logs"("order_id");

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout_sessions" ADD CONSTRAINT "checkout_sessions_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "user_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkout_distribution_logs" ADD CONSTRAINT "checkout_distribution_logs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "checkout_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
