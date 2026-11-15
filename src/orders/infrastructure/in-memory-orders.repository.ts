import { Injectable } from '@nestjs/common';
import type { UUID } from 'crypto';
import { Order, OrderStatus } from '../domain/order.js';
import { OrderRepository } from '../domain/order.repository.js';

const exampleOrder = {
  id: 'bbb89a35-d03b-44b1-a418-139d40c328c1' as UUID,
  userId: 'f950b873-be82-4a4d-a55d-ac4ff3d16ab1' as UUID,
  amount: 10,
  status: OrderStatus.PAID,
  createdAt: new Date(),
  updatedAt: new Date(),
};

/** Stores orders in memory, starting with one example order. Data is lost on restart. */
@Injectable()
export class InMemoryOrdersRepository implements OrderRepository {
  private orders: Map<UUID, Order> = new Map();

  constructor() {
    this.orders.set(exampleOrder.id, exampleOrder);
  }

  /** Returns the order with the given id, or `undefined` if not found. */
  async findById(orderId: UUID): Promise<Order | undefined> {
    return this.orders.get(orderId);
  }

  /** Saves the order, replacing any existing order with the same id. */
  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }
}
