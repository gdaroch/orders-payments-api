import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  OrderAlreadyPaidError,
  OrderNotFoundError,
} from '../domain/order-errors.js';

@Catch(OrderNotFoundError, OrderAlreadyPaidError)
export class OrderErrorFilter implements ExceptionFilter {
  catch(
    error: OrderNotFoundError | OrderAlreadyPaidError,
    host: ArgumentsHost,
  ) {
    const response = host.switchToHttp().getResponse<Response>();
    let statusCode: HttpStatus;
    let errorTitle: string;

    switch (true) {
      case error instanceof OrderNotFoundError:
        statusCode = HttpStatus.NOT_FOUND;
        errorTitle = 'Not Found';
        break;

      case error instanceof OrderAlreadyPaidError:
        statusCode = HttpStatus.CONFLICT;
        errorTitle = 'Conflict';
        break;

      default: {
        const unreachable: never = error;
        return unreachable;
      }
    }

    response.status(statusCode).json({
      statusCode,
      error: errorTitle,
      message: error.message,
    });
  }
}
