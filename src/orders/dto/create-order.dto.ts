import { Min, IsInt } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @Min(1)
  amount: number;
}
