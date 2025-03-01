import { DatabaseModule } from '@app/database/database.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsController } from './products.controller';
import * as usecases from './usecases';

const usecaseProviders = Object.values(usecases);

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./apps/products/.env.${process.env.NODE_ENV || 'development'}`,
    }),
  ],
  controllers: [ProductsController],
  providers: [...usecaseProviders],
})
export class ProductsModule {}
