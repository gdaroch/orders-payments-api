import type { UUID } from 'crypto';
import { Order } from './order.js';

/** Contract for saving and loading orders. */
export interface OrderRepository {
  findById(orderId: UUID): Promise<Order | undefined>;
  save(order: Order): Promise<void>;
}

/** Injection token for {@link OrderRepository}. */
export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');
