import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { USER_REPOSITORY } from './domain/user.repository.js';
import { InMemoryUsersRepository } from './infrastructure/in-memory-users.repository.js';
import { Mock } from 'vitest';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let jwt: { signAsync: Mock };

  beforeEach(async () => {
    jwt = { signAsync: vi.fn().mockResolvedValue('fake-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: USER_REPOSITORY, useClass: InMemoryUsersRepository },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
