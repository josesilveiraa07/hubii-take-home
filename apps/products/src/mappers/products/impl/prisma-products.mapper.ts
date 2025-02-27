import { Product as PrismaProduct } from '@prisma/client';
import { Product } from '../../../entities/product.entity';
import { ProductsMapper } from '../products.mapper';

export class PrismaProductsMapper implements ProductsMapper {
  toDto(row: PrismaProduct): Product {
    const product = new Product({
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      stockAmount: row.stockAmount,
    });

    return product;
  }
}
