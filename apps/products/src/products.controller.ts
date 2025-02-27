import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  CreateProductUseCase,
  DeleteProductUseCase,
  FindProductsUseCase,
  FindProductUseCase,
} from './usecases';
import { UpdateProductUseCase } from './usecases/update-product.usecase';

@Controller()
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly findProductsUseCase: FindProductsUseCase,
    private readonly findProductUseCase: FindProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @MessagePattern('products.create')
  async create(data: CreateProductDto) {
    return await this.createProductUseCase.execute(data);
  }

  @MessagePattern('products.findAll')
  async findAll() {
    return await this.findProductsUseCase.execute();
  }

  @MessagePattern('products.findOne')
  async findOneById(id: string) {
    return await this.findProductUseCase.execute(id);
  }

  @MessagePattern('products.update')
  async update(data: UpdateProductDto) {
    return await this.updateProductUseCase.execute(data);
  }

  @MessagePattern('products.delete')
  async delete(id: string) {
    return await this.deleteProductUseCase.execute(id);
  }
}
