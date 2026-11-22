import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EndpointCallInterceptor } from './common/interceptors/endpoint-call.interceptor.js';
import { OrdersModule } from './orders/orders.module.js';

@Module({
  imports: [OrdersModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: EndpointCallInterceptor },
  ],
})
export class AppModule {}
