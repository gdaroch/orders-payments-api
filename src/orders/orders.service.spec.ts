import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import type { Mock } from 'vitest';
import { Order, OrderStatus } from './domain/order.js';
import { ORDER_REPOSITORY } from './domain/order.repository.js';
import { OrdersService } from './orders.service.js';
import { isUUID } from 'class-validator';

function getOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: randomUUID(),
    userId: randomUUID(),
    amount: 1,
    status: OrderStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('OrdersService', () => {
  let service: OrdersService;
  let orders: { findById: Mock; save: Mock };

  beforeEach(async () => {
    orders = { findById: vi.fn(), save: vi.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: ORDER_REPOSITORY, useValue: orders },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should create a new order', async () => {
    const userId = randomUUID();
    const amount = 1;

    const result = await service.create(userId, { amount });

    expect(orders.save).toHaveBeenCalledOnce();
    expect(orders.save).toHaveBeenCalledWith(result);

    expect(result.userId).toBe(userId);
    expect(result.status).toBe(OrderStatus.PENDING);
    expect(result.updatedAt).toEqual(result.createdAt);
    expect(result.amount).toBe(amount);
  });

  it('should cancel the order when the status is PENDING', async () => {
    const originalUpdatedAt = new Date('1998-11-21');
    const originalOrder = getOrder({
      status: OrderStatus.PENDING,
      updatedAt: originalUpdatedAt,
    });
    orders.findById.mockResolvedValue(originalOrder);

    const result = await service.cancel(originalOrder.userId, originalOrder.id);

    expect(orders.save).toHaveBeenCalledOnce();
    expect(orders.save).toHaveBeenCalledWith(result);

    expect(result.updatedAt).not.toEqual(originalUpdatedAt);
    expect(result.status).toBe(OrderStatus.CANCELLED);
  });

  it('should throw an error when cancel is called and status is PAID', async () => {
    const originalOrder = getOrder({
      status: OrderStatus.PAID,
    });
    orders.findById.mockResolvedValue(originalOrder);

    await expect(
      service.cancel(originalOrder.userId, originalOrder.id),
    ).rejects.toThrow(ConflictException);

    expect(orders.save).not.toHaveBeenCalled();
  });

  it('should not do any modification when cancel is called and the status is already CANCELLED', async () => {
    const originalUpdatedAt = new Date('1998-11-21');
    const originalOrder = getOrder({
      status: OrderStatus.CANCELLED,
      updatedAt: originalUpdatedAt,
    });

    orders.findById.mockResolvedValue(originalOrder);

    const result = await service.cancel(originalOrder.userId, originalOrder.id);

    expect(orders.save).not.toHaveBeenCalled();

    expect(result.updatedAt).toEqual(originalUpdatedAt);
    expect(result.status).toBe(OrderStatus.CANCELLED);
  });

  it('should return the order when findOne is called and the order belongs to the user', async () => {
    const originalOrder = getOrder({
      status: OrderStatus.PAID,
    });
    orders.findById.mockResolvedValue(originalOrder);

    const result = await service.findOne(
      originalOrder.userId,
      originalOrder.id,
    );

    expect(result).toEqual(originalOrder);
  });

  it('should throw an error when findOne is called but the order is not found', async () => {
    orders.findById.mockResolvedValue(undefined);

    await expect(service.findOne(randomUUID(), randomUUID())).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw an error when findOne is called but the userId does not match with the orderId', async () => {
    const originalOrder = getOrder({
      status: OrderStatus.CANCELLED,
    });
    orders.findById.mockResolvedValue(originalOrder);

    await expect(
      service.findOne(randomUUID(), originalOrder.id),
    ).rejects.toThrow(NotFoundException);
  });
});
