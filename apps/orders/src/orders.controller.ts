import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderUseCase, FindOrderUseCase } from './usecases';
import { FindOrdersUseCase } from './usecases/find-orders.usecase';

@Controller()
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly findOrdersUseCase: FindOrdersUseCase,
    private readonly findOrderUseCase: FindOrderUseCase,
  ) {}

  @MessagePattern('orders.create')
  async create(data: CreateOrderDto) {
    return await this.createOrderUseCase.execute(data);
  }

  @MessagePattern('orders.findAll')
  async findAll() {
    return await this.findOrdersUseCase.execute();
  }

  @MessagePattern('orders.findOne')
  async findOneById(id: string) {
    return await this.findOrderUseCase.execute(id);
  }
}
