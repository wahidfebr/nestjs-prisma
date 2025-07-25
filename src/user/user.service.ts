import { Injectable } from '@nestjs/common';
import { User } from '../../generated/prisma';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async createUser(data: Pick<User, 'email' | 'password'>): Promise<User> {
    return this.prismaService.user.create({
      data: data,
    });
  }
}
