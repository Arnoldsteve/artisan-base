/*
  Warnings:

  - You are about to drop the column `providerSubscriptionId` on the `TenantSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentId]` on the table `TenantSubscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_orderId_fkey";

-- DropIndex
DROP INDEX "TenantSubscription_providerSubscriptionId_key";

-- AlterTable
ALTER TABLE "TenantSubscription" DROP COLUMN "providerSubscriptionId",
ADD COLUMN     "paymentId" TEXT;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "orderId";

-- CreateIndex
CREATE UNIQUE INDEX "TenantSubscription_paymentId_key" ON "TenantSubscription"("paymentId");

-- AddForeignKey
ALTER TABLE "TenantSubscription" ADD CONSTRAINT "TenantSubscription_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
