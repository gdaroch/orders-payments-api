import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import type { Mock } from 'vitest';
import { AuthService } from './auth.service.js';
import type { User } from './domain/user.js';
import { USER_REPOSITORY } from './domain/user.repository.js';

describe('AuthService', () => {
  const email = 'user@email.com';
  const password = 'password123';
  const expectedToken = 'fake-token';

  let service: AuthService;
  let jwt: { signAsync: Mock };
  let users: { findByEmail: Mock };
  let user: User;

  beforeEach(async () => {
    user = { id: randomUUID(), email, password };

    jwt = { signAsync: vi.fn().mockResolvedValue(expectedToken) };
    users = { findByEmail: vi.fn().mockResolvedValue(user) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: USER_REPOSITORY, useValue: users },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should login correctly if everything is correct', async () => {
    const result = await service.signIn(email, password);

    expect(users.findByEmail).toHaveBeenCalledOnce();
    expect(users.findByEmail).toHaveBeenCalledWith(email);

    expect(jwt.signAsync).toHaveBeenCalledOnce();
    expect(jwt.signAsync).toHaveBeenCalledWith({ sub: user.id });

    expect(result).toEqual({ accessToken: expectedToken });
  });

  it('should login correctly if the email contains capital letters', async () => {
    const result = await service.signIn('User@Email.com', password);

    expect(users.findByEmail).toHaveBeenCalledOnce();
    expect(users.findByEmail).toHaveBeenCalledWith(email);

    expect(jwt.signAsync).toHaveBeenCalledOnce();
    expect(jwt.signAsync).toHaveBeenCalledWith({ sub: user.id });

    expect(result).toEqual({ accessToken: expectedToken });
  });

  it('should throw an error if the password is incorrect', async () => {
    const invalidPassword = 'password1234';

    await expect(service.signIn(email, invalidPassword)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(users.findByEmail).toHaveBeenCalledOnce();
    expect(users.findByEmail).toHaveBeenCalledWith(email);

    expect(jwt.signAsync).not.toHaveBeenCalled();
  });

  it('should throw an error if the email does not exist', async () => {
    users.findByEmail.mockResolvedValue(undefined);

    await expect(service.signIn(email, password)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(users.findByEmail).toHaveBeenCalledOnce();
    expect(users.findByEmail).toHaveBeenCalledWith(email);

    expect(jwt.signAsync).not.toHaveBeenCalled();
  });
});
