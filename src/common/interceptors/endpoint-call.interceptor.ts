import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class EndpointCallInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Endpoint Call');

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<unknown> {
    const { method, path } = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTimer = Date.now();

    response.on('finish', () =>
      this.logger.log(
        `${method} ${path} ${response.statusCode} ${Date.now() - startTimer}ms`,
      ),
    );

    return next.handle();
  }
}
