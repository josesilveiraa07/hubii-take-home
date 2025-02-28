import { OrderItem } from './order-item.entity';

export class Order {
  id: string;
  items?: OrderItem[];
  createdAt: Date;
  updatedAt: Date;

  constructor(props: Order) {
    Object.assign(this, props);
  }
}
