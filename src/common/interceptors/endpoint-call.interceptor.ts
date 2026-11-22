import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { finalize, Observable } from 'rxjs';

@Injectable()
export class EndpointCallInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Endpoint Call');

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<unknown> {
    const { method, path } = context.switchToHttp().getRequest<Request>();
    const startTimer = Date.now();

    return next.handle().pipe(
      finalize(() => {
        const response = context.switchToHttp().getResponse<Response>();

        response.on('finish', () =>
          this.logger.log(
            `${method} ${path} ${response.statusCode} ${Date.now() - startTimer}ms`,
          ),
        );
      }),
    );
  }
}
