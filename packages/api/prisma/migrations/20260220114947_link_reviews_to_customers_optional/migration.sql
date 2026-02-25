-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "customerId" TEXT;

-- CreateIndex
CREATE INDEX "reviews_tenantId_customerId_idx" ON "reviews"("tenantId", "customerId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
