import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { UUID } from 'crypto';
import { randomUUID } from 'crypto';
import { Order, OrderStatus } from './domain/order.js';
import type { OrderRepository } from './domain/order.repository.js';
import { ORDER_REPOSITORY } from './domain/order.repository.js';
import { CreateOrderDto } from './dto/create-order.dto.js';

/** Business logic for creating and retrieving orders. */
@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  /** Creates a new order for the user with `PENDING` status. */
  async create(userId: UUID, createOrderDto: CreateOrderDto): Promise<Order> {
    const currentDate = new Date();
    const orderId = randomUUID();

    const newOrder: Order = {
      id: orderId,
      userId,
      createdAt: currentDate,
      updatedAt: currentDate,
      amount: createOrderDto.amount,
      status: OrderStatus.PENDING,
    };

    await this.orders.set(orderId, newOrder);

    return newOrder;
  }

  /**
   * Finds an order by id, scoped to the given user.
   * @throws NotFoundException if the order doesn't exist or belongs to another user.
   */
  async findOne(userId: UUID, orderId: UUID): Promise<Order> {
    const order = await this.orders.get(orderId);

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  /**
   * Cancels a pending order belonging to the given user.
   * Cancelling an order that is already cancelled is a no-op.
   * @throws NotFoundException if the order doesn't exist or belongs to another user.
   * @throws ConflictException if the order was already paid.
   */
  async cancel(userId: UUID, orderId: UUID): Promise<Order> {
    const orderToBeCancelled = await this.findOne(userId, orderId);

    if (orderToBeCancelled.status === OrderStatus.PAID) {
      throw new ConflictException(
        "The order was already paid, can't be cancelled",
      );
    }

    if (orderToBeCancelled.status === OrderStatus.PENDING) {
      orderToBeCancelled.status = OrderStatus.CANCELLED;
      orderToBeCancelled.updatedAt = new Date();
    }

    await this.orders.set(orderId, orderToBeCancelled);

    return orderToBeCancelled;
  }
}
