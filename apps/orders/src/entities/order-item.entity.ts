import { Product } from 'apps/products/src/entities/product.entity';
import { Order } from './order.entity';

export class OrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  orders?: Order;

  constructor(props: OrderItem) {
    Object.assign(this, props);
  }
}
