export enum OrderStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  PAID = 'PAID',
}

export class OrderDto {
  id: string;
  userId: string;
  amount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
