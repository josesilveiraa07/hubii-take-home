import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import deliveryConfigProvider from './common/config/delivery.config';
import { DeliveryCalculationModule } from './common/shared/modules/delivery-calculation.module';
import { DatabaseModule } from './database/database.module';
import { ProductsModule } from './modules/products.module';
import { OrdersController } from './orders.controller';
import * as usecases from './usecases';

const usecaseProviders = Object.values(usecases);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${__dirname}/../../../.env.${process.env.NODE_ENV || 'development'}`,
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
