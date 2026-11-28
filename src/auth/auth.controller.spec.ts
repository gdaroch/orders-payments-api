import { Test, TestingModule } from '@nestjs/testing';
import type { Mock } from 'vitest';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import type { SignInDto } from './dto/sign-in.dto.js';

describe('AuthController', () => {
  const email = 'user@email.com';
  const password = 'password123';
  const signInDto: SignInDto = { email, password };
  const expectedToken = 'fake-token';

  let controller: AuthController;
  let service: { signIn: Mock };

  beforeEach(async () => {
    service = {
      signIn: vi.fn().mockResolvedValue({ accessToken: expectedToken }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: service }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should return the expected token if everything is correct', async () => {
    const result = await controller.signIn(signInDto);

    expect(service.signIn).toHaveBeenCalledOnce();
    expect(service.signIn).toHaveBeenCalledWith(email, password);

    expect(result).toEqual({ accessToken: expectedToken });
  });
});
