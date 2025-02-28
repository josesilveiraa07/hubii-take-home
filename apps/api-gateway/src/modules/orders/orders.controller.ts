import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDto } from 'apps/orders/src/dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() data: CreateOrderDto) {
    return this.ordersService.create(data);
  }
}
