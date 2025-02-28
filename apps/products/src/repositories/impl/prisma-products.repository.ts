import { Injectable } from '@nestjs/common';
import { PrismaDatabaseProvider } from '../../database/providers/prisma-database.provider';
import { CreateProductDto } from '../../dto/create-product.dto';
import { SubtractFromStockDto } from '../../dto/subtract-from-stock.dto';
import { UpdateProductDto } from '../../dto/update-product.dto';
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
        height: data.height,
        length: data.length,
        weight: data.weight,
        width: data.width,
      },
    });

    return this.mapper.toDto(product);
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();

    return products.map((product) => this.mapper.toDto(product));
  }

  async findOneById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    return product ? this.mapper.toDto(product) : null;
  }

  async update(id: string, data: UpdateProductDto): Promise<Product | null> {
    const product = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stockAmount: data.stockAmount,
      },
    });

    return product ? this.mapper.toDto(product) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }

  async subtractStock(data: SubtractFromStockDto): Promise<Product> {
    return await this.prisma.product.update({
      where: {
        id: data.productId,
      },
      data: {
        stockAmount: {
          increment: -data.amount,
        },
      },
    });
  }

  async count(): Promise<number> {
    return await this.prisma.product.count();
  }
}
