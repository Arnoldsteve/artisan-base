-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('ORDER', 'SUBSCRIPTION');

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_orderId_fkey";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "type" "PaymentType" NOT NULL DEFAULT 'ORDER',
ALTER COLUMN "orderId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "payments_type_idx" ON "payments"("type");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
