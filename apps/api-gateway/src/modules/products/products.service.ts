import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto } from 'apps/products/src/dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
  ) {}

  create(data: CreateProductDto) {
    return this.productsClient.send('products.create', data);
  }

  findAll() {
    return this.productsClient.send('products.findAll', {});
  }
}
