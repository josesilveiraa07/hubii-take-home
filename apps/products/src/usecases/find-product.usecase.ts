import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class FindProductUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(id: string) {
    const result = await this.productsRepository.findOneById(id);

    if (!result) {
      throw new RpcException('Product not found');
    }

    return result;
  }
}
