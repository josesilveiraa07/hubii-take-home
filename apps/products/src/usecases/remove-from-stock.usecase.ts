import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class RemoveFromStockUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(id: string, input: number) {
    if (input < 1) {
      throw new RpcException('Invalid input, must be greater than 0');
    }

    const product = await this.productsRepository.findOneById(id);

    if (!product) {
      throw new RpcException('Product not found');
    }

    if (product.stockAmount < input) {
      throw new RpcException('Not enough stock');
    }

    return await this.productsRepository.incrementOrDecrementStock(id, -input);
  }
}
