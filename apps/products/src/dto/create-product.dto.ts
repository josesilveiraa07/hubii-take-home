import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsPositive()
  stockAmount: number;

  @IsNumber()
  @Min(1)
  height: number;

  @IsNumber()
  @Min(1)
  width: number;

  @IsNumber()
  @Min(1)
  length: number;

  @IsNumber()
  @Min(1)
  weight: number;
}
