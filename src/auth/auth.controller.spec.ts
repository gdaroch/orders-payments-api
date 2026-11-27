import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { USER_REPOSITORY } from './domain/user.repository.js';
import { InMemoryUsersRepository } from './infrastructure/in-memory-users.repository.js';
import { JwtService } from '@nestjs/jwt';
import { Mock } from 'vitest';

describe('AuthController', () => {
  let controller: AuthController;
  let jwt: { signAsync: Mock };

  beforeEach(async () => {
    jwt = { signAsync: vi.fn().mockResolvedValue('fake-token') };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: USER_REPOSITORY, useClass: InMemoryUsersRepository },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
