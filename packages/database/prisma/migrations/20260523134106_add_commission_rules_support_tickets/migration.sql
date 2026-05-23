-- CreateEnum
CREATE TYPE "CommissionRuleScope" AS ENUM ('GLOBAL', 'CATEGORY', 'VENDOR');

-- CreateEnum
CREATE TYPE "SupportTicketStatus" AS ENUM ('NEW', 'OPEN', 'PENDING', 'SOLVED');

-- CreateEnum
CREATE TYPE "SupportSubmitterRole" AS ENUM ('BUYER', 'SELLER');

-- DropForeignKey
ALTER TABLE "return_evidence" DROP CONSTRAINT "return_evidence_uploaded_by_fkey";

-- AlterTable
ALTER TABLE "return_evidence" ALTER COLUMN "uploaded_by" DROP NOT NULL;

-- CreateTable
CREATE TABLE "commission_rules" (
    "id" UUID NOT NULL,
    "scope" "CommissionRuleScope" NOT NULL,
    "label" TEXT NOT NULL,
    "target_id" UUID,
    "commission_pct" DECIMAL(5,2) NOT NULL,
    "payment_fee_pct" DECIMAL(5,2) NOT NULL,
    "effective_from" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commission_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "submitter_id" UUID NOT NULL,
    "submitter_role" "SupportSubmitterRole" NOT NULL,
    "submitter_name" TEXT NOT NULL,
    "status" "SupportTicketStatus" NOT NULL DEFAULT 'NEW',
    "assigned_admin_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_messages" (
    "id" UUID NOT NULL,
    "ticket_id" UUID NOT NULL,
    "sender" TEXT NOT NULL,
    "sender_name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "commission_rules_scope_idx" ON "commission_rules"("scope");

-- CreateIndex
CREATE INDEX "support_tickets_status_idx" ON "support_tickets"("status");

-- CreateIndex
CREATE INDEX "support_tickets_submitter_id_idx" ON "support_tickets"("submitter_id");

-- CreateIndex
CREATE INDEX "support_tickets_assigned_admin_id_idx" ON "support_tickets"("assigned_admin_id");

-- CreateIndex
CREATE INDEX "support_messages_ticket_id_idx" ON "support_messages"("ticket_id");

-- AddForeignKey
ALTER TABLE "return_evidence" ADD CONSTRAINT "return_evidence_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
