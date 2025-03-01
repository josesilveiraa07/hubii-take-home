import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../repositories/orders.repository';

@Injectable()
export class FindOrdersUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute() {
    const [results, count] = await Promise.all([
      this.ordersRepository.findAll(),
      this.ordersRepository.count(),
    ]);

    return { results, count };
  }
}
