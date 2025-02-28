import { Global, Module } from '@nestjs/common';
import { PrismaOrdersRepository } from 'apps/orders/src/repositories/impl/prisma-orders.repository';
import { OrdersRepository } from 'apps/orders/src/repositories/orders.repository';
import { PrismaProductsRepository } from 'apps/products/src/repositories/impl/prisma-products.repository';
import { ProductsRepository } from 'apps/products/src/repositories/products.repository';
import { PrismaDatabaseProvider } from './providers/prisma-database.provider';

@Global()
@Module({
  providers: [
    PrismaDatabaseProvider,
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: ProductsRepository,
      useClass: PrismaProductsRepository,
    },
  ],
  exports: [PrismaDatabaseProvider, OrdersRepository, ProductsRepository],
})
export class DatabaseModule {}
