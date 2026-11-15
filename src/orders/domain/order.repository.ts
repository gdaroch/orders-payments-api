import { UUID } from 'crypto';
import { Order } from './order.js';

/** Contract for saving and loading orders. */
export interface OrderRepository {
  get(orderId: UUID): Promise<Order | undefined>;
  set(orderId: UUID, order: Order): Promise<void>;
}

/** Injection token for {@link OrderRepository}. */
export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');
