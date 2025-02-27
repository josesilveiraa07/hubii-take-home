import { Injectable } from '@nestjs/common';
import { PrismaDatabaseProvider } from '../../database/providers/prisma-database.provider';
import { CreateProductDto } from '../../dto/create-product.dto';
import { Product } from '../../entities/product.entity';
import { ProductsMapper } from '../../mappers/products/products.mapper';
import { ProductsRepository } from '../products.repository';

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(
    private readonly prisma: PrismaDatabaseProvider,
    private readonly mapper: ProductsMapper,
  ) {}

  async create(data: CreateProductDto): Promise<Product> {
    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stockAmount: data.stockAmount,
      },
    });

    return this.mapper.toDto(product);
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();

    return products.map((product) => this.mapper.toDto(product));
  }

  async count(): Promise<number> {
    return await this.prisma.product.count();
  }
}
