import { Module } from '@nestjs/common';
import { PrismaProductsMapper } from './products/impl/prisma-products.mapper';
import { ProductsMapper } from './products/products.mapper';

@Module({
  providers: [
    {
      provide: ProductsMapper,
      useClass: PrismaProductsMapper,
    },
  ],
  exports: [ProductsMapper],
})
export class MappersModule {}
