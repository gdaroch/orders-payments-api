import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { Order, OrderStatus } from './domain/order.js';
import { randomUUID } from 'crypto';
import type { UUID } from 'crypto';

/** Business logic for creating and retrieving orders. */
@Injectable()
export class OrdersService {
  // TODO: placeholder, this will be stored in SQL
  private orders: Order[] = [
    {
      id: 'bbb89a35-d03b-44b1-a418-139d40c328c1',
      userId: 'f950b873-be82-4a4d-a55d-ac4ff3d16ab1',
      amount: 10,
      status: OrderStatus.PAID,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  /** Creates a new order for the user with `PENDING` status. */
  create(userId: UUID, createOrderDto: CreateOrderDto): Order {
    const currentDate = new Date();

    const newOrder: Order = {
      id: randomUUID(),
      userId,
      createdAt: currentDate,
      updatedAt: currentDate,
      amount: createOrderDto.amount,
      status: OrderStatus.PENDING,
    };

    this.orders.push(newOrder);

    return newOrder;
  }

  /**
   * Finds an order by id, scoped to the given user.
   * @throws NotFoundException if the order doesn't exist or belongs to another user.
   */
  findOne(userId: UUID, id: UUID): Order {
    const order = this.orders.find(
      (order) => order.id === id && order.userId === userId,
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
