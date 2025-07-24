import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '../../generated/prisma';

@Injectable()
export class UserService {
  private prisma = new PrismaClient();

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(
    email: string,
    password: string,
    name?: string,
  ): Promise<User> {
    return this.prisma.user.create({
      data: { email, password, name },
    });
  }
}
