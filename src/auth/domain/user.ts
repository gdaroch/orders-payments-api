import type { UUID } from 'crypto';

export class User {
  id: UUID;
  email: string;
  password: string;
}
