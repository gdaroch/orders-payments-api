import { Injectable } from '@nestjs/common';
import type { UUID } from 'crypto';
import { UserRepository } from '../domain/user.repository.js';
import type { User } from '../domain/users.js';

const exampleUser: User = {
  id: 'f950b873-be82-4a4d-a55d-ac4ff3d16ab1' as UUID,
  email: 'user@email.com',
  password: 'password123',
};

/** Stores users in memory, starting with one example user. Data is lost on restart. */
@Injectable()
export class InMemoryUsersRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  constructor() {
    this.users.set(exampleUser.email, exampleUser);
  }

  /** Returns the user with the given email, or `undefined` if not found. */
  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.get(email);
  }
}
