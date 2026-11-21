import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ORDER_REPOSITORY } from './domain/order.repository.js';
import { OrderErrorFilter } from './http/order-errors.filter.js';
import { InMemoryOrdersRepository } from './infrastructure/in-memory-orders.repository.js';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    { provide: ORDER_REPOSITORY, useClass: InMemoryOrdersRepository },
    { provide: APP_FILTER, useClass: OrderErrorFilter },
  ],
})
export class OrdersModule {}
