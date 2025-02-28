import { OrderItem } from '../../entities/order-item.entity';

export abstract class OrderItemsMapper {
  abstract toDto(row: unknown): OrderItem;
}
