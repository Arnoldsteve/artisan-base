/*
  Warnings:

  - Made the column `planId` on table `TenantSubscription` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TenantSubscription" DROP CONSTRAINT "TenantSubscription_planId_fkey";

-- AlterTable
ALTER TABLE "TenantSubscription" ALTER COLUMN "planId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TenantSubscription" ADD CONSTRAINT "TenantSubscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
