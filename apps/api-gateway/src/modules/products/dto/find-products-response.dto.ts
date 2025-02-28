import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'apps/products/src/entities/product.entity';

export class FindProductsResponseDto {
  @ApiProperty({ type: [Product] })
  results: Product[];
  count: number;
}
