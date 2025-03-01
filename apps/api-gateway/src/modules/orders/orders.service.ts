import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from 'apps/orders/src/dto/create-order.dto';
import { FindOrdersResponseDto } from 'apps/orders/src/dto/find-orders-response.dto';
import { Order } from 'apps/orders/src/entities/order.entity';
import { catchError, throwError } from 'rxjs';
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
        catchError((val: { response: Error }) =>
          throwError(() => val.response),
        ),
      );
  }

  findAll() {
    return this.ordersClient
      .send<FindOrdersResponseDto>('orders.findAll', {})
      .pipe(
        catchError((val: { response: Error }) =>
          throwError(() => val.response),
        ),
      );
  }

  findOneById(id: string) {
    return this.ordersClient
      .send<Order>('orders.findOne', id)
      .pipe(
        catchError((val: { response: Error }) =>
          throwError(() => val.response),
        ),
      );
  }
}
