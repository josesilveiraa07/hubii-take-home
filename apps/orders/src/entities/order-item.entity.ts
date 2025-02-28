import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Product } from 'apps/products/src/entities/product.entity';
import { Order } from './order.entity';

export class OrderItem {
  id: string;
  productId: string;

  @ApiProperty({ type: Product })
  product?: Product;

  quantity: number;
  createdAt: Date;
  updatedAt: Date;

  @ApiHideProperty()
  orders?: Order[];

  constructor(props: OrderItem) {
    Object.assign(this, props);
  }
}
