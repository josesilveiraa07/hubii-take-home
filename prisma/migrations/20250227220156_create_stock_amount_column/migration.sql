/*
  Warnings:

  - Added the required column `stock_amount` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "stock_amount" INTEGER NOT NULL;
