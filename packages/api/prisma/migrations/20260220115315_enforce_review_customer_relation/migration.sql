/*
  Warnings:

  - Made the column `customerId` on table `reviews` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "customerId" SET NOT NULL;
