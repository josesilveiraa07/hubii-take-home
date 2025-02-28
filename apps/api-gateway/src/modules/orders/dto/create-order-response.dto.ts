import { ApiProperty } from '@nestjs/swagger';
import { Order } from 'apps/orders/src/entities/order.entity';

export class CreateOrderResponseDto {
  @ApiProperty({ type: Order })
  order: Order;

  @ApiProperty({
    example: {
      SEDEX: { deliveryTime: '5 dias úteis', price: 15 },
      PAC: { deliveryTime: '1 dia útil', price: 10 },
    },
  })
  deliveryDetails: Record<string, { deliveryTime: string; price: number }>;
}
