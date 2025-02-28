-- CreateTable
CREATE TABLE "OrderDeliveryOption" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "estimated_arrival" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderDeliveryOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderDeliveryOption" ADD CONSTRAINT "OrderDeliveryOption_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
