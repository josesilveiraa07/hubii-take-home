import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';

export abstract class OrdersRepository {
  abstract create(data: CreateOrderDto): Promise<Order>;
  abstract findOneById(id: string): Promise<Order | null>;
}
