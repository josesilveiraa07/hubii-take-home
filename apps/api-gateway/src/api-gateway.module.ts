import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${__dirname}/../../.env.${process.env.NODE_ENV || 'development'}`,
    }),
    ProductsModule,
    OrdersModule,
  ],
})
export class ApiGatewayModule {}
