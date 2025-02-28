import { CreateProductDto } from '../dto/create-product.dto';
import { SubtractFromStockDto } from '../dto/subtract-from-stock.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

export abstract class ProductsRepository {
  abstract create(data: CreateProductDto): Promise<Product>;
  abstract findAll(): Promise<Product[]>;
  abstract findOneById(id: string): Promise<Product | null>;
  abstract update(id: string, data: UpdateProductDto): Promise<Product | null>;
  abstract delete(id: string): Promise<void>;
  abstract subtractStock(data: SubtractFromStockDto): Promise<Product>;
  abstract count(): Promise<number>;
}
