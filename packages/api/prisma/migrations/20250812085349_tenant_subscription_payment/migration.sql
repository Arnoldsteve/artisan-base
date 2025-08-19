/*
  Warnings:

  - You are about to drop the column `stripeSubscriptionId` on the `tenant_subscriptions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerPlanId]` on the table `subscription_plans` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `tenants` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "tenant_subscriptions_stripeSubscriptionId_key";

-- AlterTable
ALTER TABLE "subscription_plans" ADD COLUMN     "providerPlanId" TEXT;

-- AlterTable
ALTER TABLE "tenant_subscriptions" DROP COLUMN "stripeSubscriptionId";

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateTable
CREATE TABLE "subscription_payments" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerTransactionId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "subscription_payments_tenantId_idx" ON "subscription_payments"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_payments_provider_providerTransactionId_key" ON "subscription_payments"("provider", "providerTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_providerPlanId_key" ON "subscription_plans"("providerPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_stripeCustomerId_key" ON "tenants"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "tenant_subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
