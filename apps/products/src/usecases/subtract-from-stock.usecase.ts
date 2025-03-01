import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { SubtractFromStockDto } from '../dto/subtract-from-stock.dto';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class SubtractFromStockUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(data: SubtractFromStockDto) {
    const product = await this.productsRepository.findOneById(data.productId);

    if (!product) {
      throw new RpcException(new NotFoundException('Product not found'));
    }

    if (product.stockAmount < data.amount) {
      throw new RpcException(new BadRequestException('Not enough stock'));
    }

    return await this.productsRepository.subtractStock(data);
  }
}
