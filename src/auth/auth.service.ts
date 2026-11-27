import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type UserRepository,
} from './domain/user.repository.js';
import { JwtService } from '@nestjs/jwt';

/** Business logic for authenticating users. */
@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Validates the credentials and issues a signed JWT whose `sub` is the user id.
   * @throws UnauthorizedException if the email is unknown or the password doesn't match.
   */
  async signIn(email: string, password: string) {
    const user = await this.users.findByEmail(email);

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwt.signAsync({ sub: user.id });

    return { accessToken };
  }
}
