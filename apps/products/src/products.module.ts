import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ProductsController } from './products.controller';
import * as usecases from './usecases';

const usecaseProviders = Object.values(usecases);

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [...usecaseProviders],
})
export class ProductsModule {}
