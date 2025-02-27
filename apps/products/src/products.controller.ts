import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductUseCase, FindProductsUseCase } from './usecases';

@Controller()
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly findProductsUseCase: FindProductsUseCase,
  ) {}

  @MessagePattern('products.create')
  async create(data: CreateProductDto) {
    return await this.createProductUseCase.execute(data);
  }

  @MessagePattern('products.findAll')
  async findAll() {
    return await this.findProductsUseCase.execute();
  }
}
