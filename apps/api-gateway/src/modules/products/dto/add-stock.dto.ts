import { IsInt, IsPositive } from 'class-validator';

export class AddStockDto {
  @IsInt()
  @IsPositive()
  amount: number;
}
