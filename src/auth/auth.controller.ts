import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignInDto } from './dto/sign-in.dto.js';

/** HTTP endpoints for authentication. */
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  /** POST /auth/login - exchanges credentials for an access token. */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto) {
    return this.auth.signIn(dto.email, dto.password);
  }
}
