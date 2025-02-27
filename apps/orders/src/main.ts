import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { OrdersModule } from './orders.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrdersModule,
    { transport: Transport.TCP, options: { port: 3001 } },
  );

  await app.listen();
}

bootstrap().catch(console.error);
