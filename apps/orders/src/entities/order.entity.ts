import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from './order-item.entity';

export class Order {
  id: string;

  @ApiProperty({ type: [OrderItem] })
  items?: OrderItem[];

  createdAt: Date;
  updatedAt: Date;

  constructor(props: Order) {
    Object.assign(this, props);
  }
}
