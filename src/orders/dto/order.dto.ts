import { IsNumber, IsUUID, IsDate, IsEnum, IsOptional } from 'class-validator';

export enum STATUS {
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  PAID = 'paid',
}

export class OrderDto {
  @IsUUID()
  id: string;

  @IsUUID()
  userId: string;

  @IsNumber()
  amount: number;

  @IsEnum(STATUS)
  status: STATUS;

  @IsDate()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
