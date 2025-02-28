import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class DeleteProductUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(id: string) {
    const product = await this.productsRepository.findOneById(id);

    if (!product) {
      throw new RpcException(new NotFoundException('Product not found'));
    }

    await this.productsRepository.delete(id);
  }
}
