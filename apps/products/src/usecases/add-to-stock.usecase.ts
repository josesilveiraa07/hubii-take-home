import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class AddToStockUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(id: string, input: number) {
    if (input < 1) {
      throw new RpcException(
        new BadRequestException('Invalid input, must be greater than 0'),
      );
    }

    const product = await this.productsRepository.findOneById(id);

    if (!product) {
      throw new RpcException(new NotFoundException('Product not found'));
    }

    return await this.productsRepository.incrementOrDecrementStock(id, input);
  }
}
