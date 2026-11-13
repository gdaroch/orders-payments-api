import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrdersService } from './orders.service.js';
import type { UUID } from 'crypto';

/** HTTP endpoints for orders. */
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  /** GET /orders/:id - returns an order of the current user. */
  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) orderId: UUID) {
    // TODO: placeholder, this will be obtained from JWT
    const userId = 'f950b873-be82-4a4d-a55d-ac4ff3d16ab1';
    return this.ordersService.findOne(userId, orderId);
  }

  /** POST /orders - creates an order for the current user. */
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    // TODO: placeholder, this will be obtained from JWT
    const userId = 'f950b873-be82-4a4d-a55d-ac4ff3d16ab1';
    return this.ordersService.create(userId, createOrderDto);
  }
}
