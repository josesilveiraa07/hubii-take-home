import { Global, Module } from '@nestjs/common';
import { MappersModule } from '../mappers/mappers.module';
import { PrismaProductsRepository } from '../repositories/impl/prisma-products.repository';
import { ProductsRepository } from '../repositories/products.repository';
import { PrismaDatabaseProvider } from './providers/prisma-database.provider';

@Global()
@Module({
  imports: [MappersModule],
  providers: [
    PrismaDatabaseProvider,
    { provide: ProductsRepository, useClass: PrismaProductsRepository },
  ],
  exports: [PrismaDatabaseProvider, ProductsRepository],
})
export class DatabaseModule {}
