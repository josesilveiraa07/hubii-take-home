import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

class OrderDeliveryOption {
  companyName: string;
  price: number;
  estimatedArrival: string;
}

export class CreateOrderDto {
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  @IsNotEmpty()
  originZipcode: string;

  @IsString()
  @IsNotEmpty()
  destinationZipcode: string;

  @ApiHideProperty()
  deliveryOptions: OrderDeliveryOption[];
}
