import { User } from '../../generated/prisma';

export type AuthenticatedUser = Omit<User, 'password'>;

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser;
  }
}
