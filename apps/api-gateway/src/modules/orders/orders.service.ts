import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from 'apps/orders/src/dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
  ) {}

  create(data: CreateOrderDto) {
    return this.ordersClient.send('orders.create', data);
  }

  findOneById(id: string) {
    return this.ordersClient.send('orders.findOne', id);
  }
}
