import { Module } from '@nestjs/common';
import { PrismaOrderItemsMapper } from './order-items/impl/prisma-order-items.mapper';
import { OrderItemsMapper } from './order-items/order-items.mapper';

@Module({
  providers: [
    {
      provide: OrderItemsMapper,
      useClass: PrismaOrderItemsMapper,
    },
  ],
  exports: [OrderItemsMapper],
})
export class MappersModule {}
