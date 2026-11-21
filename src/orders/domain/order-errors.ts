import type { UUID } from 'crypto';

export class OrderNotFoundError extends Error {
  constructor(orderId: UUID) {
    super(`Order ID:${orderId} not found`);
  }
}

export class OrderAlreadyPaidError extends Error {
  constructor(orderId: UUID) {
    super(`The order ID:${orderId} was already paid, can't be cancelled`);
  }
}
