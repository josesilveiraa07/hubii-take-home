import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { OrdersRepository } from '../repositories/orders.repository';

@Injectable()
export class FindOrderUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute(orderId: string) {
    const order = await this.ordersRepository.findOneById(orderId);

    if (!order) {
      throw new RpcException('Order not found');
    }

    return order;
  }
}
