import { PrismaDatabaseProvider } from '@app/database/providers/prisma-database.provider';
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../../dto/create-product.dto';
import { SubtractFromStockDto } from '../../dto/subtract-from-stock.dto';
import { UpdateProductDto } from '../../dto/update-product.dto';
import { Product } from '../../entities/product.entity';
import { ProductsRepository } from '../products.repository';

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private readonly prisma: PrismaDatabaseProvider) {}

  async create(data: CreateProductDto): Promise<Product> {
    return await this.prisma.product.create({
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
  }

  async findAll(): Promise<Product[]> {
    return await this.prisma.product.findMany();
  }

  async findOneById(id: string): Promise<Product | null> {
    return await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, data: UpdateProductDto): Promise<Product | null> {
    return await this.prisma.product.update({
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

  async incrementOrDecrementStock(
    id: string,
    quantity: number,
  ): Promise<Product> {
    return await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        stockAmount: {
          increment: quantity,
        },
      },
    });
  }

  async count(): Promise<number> {
    return await this.prisma.product.count();
  }
}
