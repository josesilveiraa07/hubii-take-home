/*
  Warnings:

  - You are about to drop the `OrderDeliveryOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderDeliveryOption" DROP CONSTRAINT "OrderDeliveryOption_order_id_fkey";

-- DropTable
DROP TABLE "OrderDeliveryOption";

-- CreateTable
CREATE TABLE "order_delivery_options" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "estimated_arrival" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_delivery_options_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_delivery_options" ADD CONSTRAINT "order_delivery_options_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
