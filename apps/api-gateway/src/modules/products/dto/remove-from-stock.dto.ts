import { IsInt, IsPositive } from 'class-validator';

export class RemoveFromStockDto {
  @IsInt()
  @IsPositive()
  amount: number;
}
