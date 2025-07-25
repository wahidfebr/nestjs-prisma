import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { env } from '../env';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const baseUrl = env.DATABASE_URL;
    const appName = `${env.APP_NAME}-${env.APP_ENV}-${env.HOSTNAME}`;
    const url = new URL(baseUrl);
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
