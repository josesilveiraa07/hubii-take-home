import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto } from 'apps/products/src/dto/create-product.dto';
import { UpdateProductDto } from 'apps/products/src/dto/update-product.dto';

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

  findOneById(id: string) {
    return this.productsClient.send('products.findOne', id);
  }

  update(id: string, data: UpdateProductDto) {
    return this.productsClient.send('products.update', { ...data, id });
  }

  delete(id: string) {
    return this.productsClient.send('products.delete', id);
  }

  addToStock(id: string, quantity: number) {
    return this.productsClient.send('products.addStock', { id, quantity });
  }

  removeFromStock(id: string, quantity: number) {
    return this.productsClient.send('products.removeStock', { id, quantity });
  }
}
