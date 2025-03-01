-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "origin_zipcode" TEXT NOT NULL,
    "destination_zipcode" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrderToOrderItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrderToOrderItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrderToOrderItem_B_index" ON "_OrderToOrderItem"("B");

-- AddForeignKey
ALTER TABLE "order_delivery_options" ADD CONSTRAINT "order_delivery_options_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToOrderItem" ADD CONSTRAINT "_OrderToOrderItem_A_fkey" FOREIGN KEY ("A") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToOrderItem" ADD CONSTRAINT "_OrderToOrderItem_B_fkey" FOREIGN KEY ("B") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
