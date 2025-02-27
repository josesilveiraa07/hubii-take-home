import { Product } from '../../entities/product.entity';

export abstract class ProductsMapper {
  abstract toDto(row: unknown): Product;
}
