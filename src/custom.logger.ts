import { ConsoleLogger } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  protected getTimestamp(): string {
    return new Date().toISOString();
  }
}
