import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from './order-item.entity';

export class OrderDeliveryOptions {
  id: string;
  companyName: string;
  estimatedArrival: string;
  price: number;
}

export class Order {
  id: string;

  @ApiProperty({ type: [OrderItem] })
  items?: OrderItem[];
  deliveryOptions?: OrderDeliveryOptions[];

  originZipcode: string;
  destinationZipcode: string;

  createdAt: Date;
  updatedAt: Date;

  constructor(props: Order) {
    Object.assign(this, props);
  }
}
