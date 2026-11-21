import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { OrderErrorFilter } from './orders/http/order-errors.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new OrderErrorFilter());
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
