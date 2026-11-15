import { Test, TestingModule } from '@nestjs/testing';
import { ORDER_REPOSITORY } from './domain/order.repository.js';
import { InMemoryOrdersRepository } from './infrastructure/in-memory-orders.repository.js';
import { OrdersService } from './orders.service.js';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: ORDER_REPOSITORY, useClass: InMemoryOrdersRepository },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
