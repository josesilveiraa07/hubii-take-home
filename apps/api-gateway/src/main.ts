import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiGatewayModule } from './api-gateway.module';
import { ExceptionFilter } from './shared/exception-filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    .useGlobalFilters(new ExceptionFilter());

  const configService: ConfigService = app.get(ConfigService);

  if (configService.get<string>('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Hubii Take Home')
      .setDescription(
        'Documentação da API de pedidos do projeto take home da Hubii',
      )
      .setVersion('1.0')
      .addTag('orders', 'Pedidos')
      .addTag('products', 'Produtos')
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, documentFactory);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(console.error);
