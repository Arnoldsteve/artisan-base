-- CreateTable
CREATE TABLE "payment_indices" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "checkoutRequestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_indices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_indices_checkoutRequestId_key" ON "payment_indices"("checkoutRequestId");

-- CreateIndex
CREATE INDEX "payment_indices_tenantId_idx" ON "payment_indices"("tenantId");

-- AddForeignKey
ALTER TABLE "payment_indices" ADD CONSTRAINT "payment_indices_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
