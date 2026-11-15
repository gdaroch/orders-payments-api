import { Test, TestingModule } from '@nestjs/testing';
import { ORDER_REPOSITORY } from './domain/order.repository.js';
import { InMemoryOrdersRepository } from './infrastructure/in-memory-orders.repository.js';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';

describe('OrdersController', () => {
  let controller: OrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        { provide: ORDER_REPOSITORY, useClass: InMemoryOrdersRepository },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
