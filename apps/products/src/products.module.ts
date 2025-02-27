import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ProductsController } from './products.controller';
import {
  CreateProductUseCase,
  FindProductsUseCase,
  FindProductUseCase,
} from './usecases';
import { UpdateProductUseCase } from './usecases/update-product.usecase';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    FindProductsUseCase,
    FindProductUseCase,
    UpdateProductUseCase,
  ],
})
export class ProductsModule {}
