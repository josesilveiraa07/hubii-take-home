import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { SubtractFromStockDto } from './dto/subtract-from-stock.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  CreateProductUseCase,
  DeleteProductUseCase,
  FindProductsUseCase,
  FindProductUseCase,
  SubtractFromStockUseCase,
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
    private readonly subtractFromStockUseCase: SubtractFromStockUseCase,
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

  @MessagePattern('products.subtractStock')
  async subtractStock(data: SubtractFromStockDto) {
    return await this.subtractFromStockUseCase.execute(data);
  }
}
