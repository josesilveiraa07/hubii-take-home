import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderUseCase, FindOrderUseCase } from './usecases';

@Controller()
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly findOrderUseCase: FindOrderUseCase,
  ) {}

  @MessagePattern('orders.create')
  async create(data: CreateOrderDto) {
    return await this.createOrderUseCase.execute(data);
  }

  @MessagePattern('orders.findOne')
  async findOneById(id: string) {
    return await this.findOrderUseCase.execute(id);
  }
}
