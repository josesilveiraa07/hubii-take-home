import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from 'apps/orders/src/dto/create-order.dto';
import { Order } from 'apps/orders/src/entities/order.entity';
import { catchError, of } from 'rxjs';
import { CreateOrderResponseDto } from './dto/create-order-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
  ) {}

  create(data: CreateOrderDto) {
    return this.ordersClient
      .send<CreateOrderResponseDto>('orders.create', data)
      .pipe(
        catchError((val: { message: string }) => of({ error: val.message })),
      );
  }

  findOneById(id: string) {
    return this.ordersClient
      .send<Order>('orders.findOne', id)
      .pipe(
        catchError((val: { message: string }) => of({ error: val.message })),
      );
  }
}
