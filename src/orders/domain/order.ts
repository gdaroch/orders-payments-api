import { UUID } from 'crypto';

export enum OrderStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  PAID = 'PAID',
}

export class Order {
  id: UUID;
  userId: UUID;
  amount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
