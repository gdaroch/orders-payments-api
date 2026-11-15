import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { ORDER_REPOSITORY } from './domain/order.repository.js';
import { InMemoryOrdersRepository } from './infrastructure/in-memory-orders.repository.js';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    { provide: ORDER_REPOSITORY, useClass: InMemoryOrdersRepository },
  ],
})
export class OrdersModule {}
