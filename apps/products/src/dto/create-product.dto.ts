import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
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
  height: number;

  @IsNumber()
  width: number;

  @IsNumber()
  length: number;

  @IsNumber()
  weight: number;
}
