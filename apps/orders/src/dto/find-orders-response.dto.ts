import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../entities/order.entity';

export class FindOrdersResponseDto {
  @ApiProperty({ type: [Order] })
  results: Order[];

  count: number;
}
