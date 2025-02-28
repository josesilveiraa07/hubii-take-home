import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderUseCase } from './usecases';

@Controller()
export class OrdersController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  @MessagePattern('orders.create')
  async create(data: CreateOrderDto) {
    return await this.createOrderUseCase.execute(data);
  }
}
