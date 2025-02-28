import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SubtractFromStockDto } from 'apps/products/src/dto/subtract-from-stock.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
  ) {}

  findOneById(id: string) {
    return this.productsClient.send('products.findOne', id);
  }

  subtractFromStock(data: SubtractFromStockDto) {
    return this.productsClient.send('products.subtractStock', data);
  }
}
