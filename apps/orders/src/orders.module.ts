import { DatabaseModule } from '@app/database/database.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import deliveryConfigProvider from './common/config/delivery.config';
import { DeliveryCalculationModule } from './common/shared/modules/delivery-calculation.module';
import { ProductsModule } from './modules/products.module';
import { OrdersController } from './orders.controller';
import * as usecases from './usecases';

const usecaseProviders = Object.values(usecases);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./apps/orders/.env.${process.env.NODE_ENV || 'development'}`,
      load: [deliveryConfigProvider],
    }),
    DatabaseModule,
    ProductsModule,
    DeliveryCalculationModule,
  ],
  controllers: [OrdersController],
  providers: [...usecaseProviders],
})
export class OrdersModule {}
