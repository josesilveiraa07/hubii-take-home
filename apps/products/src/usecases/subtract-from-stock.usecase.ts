import { Injectable } from '@nestjs/common';
import { SubtractFromStockDto } from '../dto/subtract-from-stock.dto';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class SubtractFromStockUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(data: SubtractFromStockDto) {
    return await this.productsRepository.subtractStock(data);
  }
}
