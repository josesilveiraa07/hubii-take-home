import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class UpdateProductUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(input: UpdateProductDto) {
    const result = await this.productsRepository.update(input.id, input);

    if (!result) {
      throw new RpcException('Product not found');
    }

    return result;
  }
}
