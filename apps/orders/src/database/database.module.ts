import { Global, Module } from '@nestjs/common';
import { MappersModule } from '../mappers/mappers.module';
import { PrismaOrdersRepository } from '../repositories/impl/prisma-orders.repository';
import { OrdersRepository } from '../repositories/orders.repository';
import { PrismaDatabaseProvider } from './providers/prisma-database.provider';

@Global()
@Module({
  imports: [MappersModule],
  providers: [
    PrismaDatabaseProvider,
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
  ],
  exports: [PrismaDatabaseProvider, OrdersRepository],
})
export class DatabaseModule {}
