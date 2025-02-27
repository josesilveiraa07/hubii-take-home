import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class FindProductsUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute() {
    const [results, count] = await Promise.all([
      this.productsRepository.findAll(),
      this.productsRepository.count(),
    ]);

    return { results, count };
  }
}
