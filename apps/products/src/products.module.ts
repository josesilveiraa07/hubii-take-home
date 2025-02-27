import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ProductsController } from './products.controller';
import { CreateProductUseCase, FindProductsUseCase } from './usecases';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [CreateProductUseCase, FindProductsUseCase],
})
export class ProductsModule {}
