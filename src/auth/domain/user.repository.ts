import type { User } from './user.js';

/** Contract for loading users. */
export interface UserRepository {
  findByEmail(email: string): Promise<User | undefined>;
}

/** Injection token for {@link UserRepository}. */
export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
