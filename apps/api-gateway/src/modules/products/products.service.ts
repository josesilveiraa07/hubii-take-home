import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto } from 'apps/products/src/dto/create-product.dto';
import { UpdateProductDto } from 'apps/products/src/dto/update-product.dto';
import { Product } from 'apps/products/src/entities/product.entity';
import { catchError, of } from 'rxjs';
import { FindProductsResponseDto } from './dto/find-products-response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
  ) {}

  create(data: CreateProductDto) {
    return this.productsClient
      .send<Product>('products.create', data)
      .pipe(
        catchError((val: { message: string }) => of({ error: val.message })),
      );
  }

  findAll() {
    return this.productsClient
      .send<FindProductsResponseDto>('products.findAll', {})
      .pipe(
        catchError((val: { message: string }) => of({ error: val.message })),
      );
  }

  findOneById(id: string) {
    return this.productsClient
      .send<Product>('products.findOne', id)
      .pipe(
        catchError((val: { message: string }) => of({ error: val.message })),
      );
  }

  update(id: string, data: UpdateProductDto) {
    return this.productsClient
      .send<Product>('products.update', {
        ...data,
        id,
      })
      .pipe(
        catchError((val: { message: string }) => of({ error: val.message })),
      );
  }

  delete(id: string) {
    return this.productsClient
      .send<void>('products.delete', id)
      .pipe(
        catchError((val: { message: string }) => of({ error: val.message })),
      );
  }

  addToStock(id: string, quantity: number) {
    return this.productsClient
      .send<void>('products.addStock', {
        id,
        quantity,
      })
      .pipe(
        catchError((val: { message: string }) => of({ error: val.message })),
      );
  }

  removeFromStock(id: string, quantity: number) {
    return this.productsClient
      .send<void>('products.removeStock', {
        id,
        quantity,
      })
      .pipe(
        catchError((val: { message: string }) => of({ error: val.message })),
      );
  }
}
