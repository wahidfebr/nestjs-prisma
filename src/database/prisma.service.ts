import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const baseUrl = process.env.DATABASE_URL;
    const appName = `nestjs-prisma-${process.env.NODE_ENV || 'dev'}-${process.env.HOSTNAME || 'unknown'}`;
    const url = new URL(baseUrl!);
    url.searchParams.set('application_name', appName);

    super({
      datasources: {
        db: {
          url: url.toString(),
        },
      },
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'minimal',
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
