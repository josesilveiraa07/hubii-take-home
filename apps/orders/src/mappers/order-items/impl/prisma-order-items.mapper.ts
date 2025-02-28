import { Injectable } from '@nestjs/common';
import { OrderItem as PrismaOrderItem } from '@prisma/client';
import { OrderItem } from 'apps/orders/src/entities/order-item.entity';
import { OrderItemsMapper } from '../order-items.mapper';

@Injectable()
export class PrismaOrderItemsMapper implements OrderItemsMapper {
  toDto(row: PrismaOrderItem): OrderItem {
    const orderItem = new OrderItem({
      id: row.id,
      productId: row.productId,
      quantity: row.quantity,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });

    return orderItem;
  }
}
