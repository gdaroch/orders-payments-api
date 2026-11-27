import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtModule } from '@nestjs/jwt';
import { USER_REPOSITORY } from './domain/user.repository.js';
import { InMemoryUsersRepository } from './infrastructure/in-memory-users.repository.js';

@Module({
  imports: [
    JwtModule.register({
      secret: 'dev-secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: USER_REPOSITORY, useClass: InMemoryUsersRepository },
  ],
})
export class AuthModule {}
