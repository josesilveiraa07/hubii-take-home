import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductsService } from './products.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCTS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@rabbitmq:5672'],
          queue: 'products_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
