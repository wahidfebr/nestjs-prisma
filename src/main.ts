import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { Logger, VersioningType } from '@nestjs/common';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CustomLogger } from './custom.logger';

export const requestLogger = new Logger('RequestLogger');

async function bootstrap() {
  const logger = new Logger('BootstrapLogger');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new CustomLogger(),
  });

  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.use(helmet());

  app.enableShutdownHooks();
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });

  app.use((req: Request, _: Response, next: () => void) => {
    req.startTime = Date.now();
    req.requestId = randomUUID();
    requestLogger.log(
      `[${req.requestId}] request masuk pada api ${req.originalUrl}`,
    );
    next();
  });

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  process.on('unhandledRejection', (reason, promise) => {
    logger.fatal('Unhandled Rejection with reason:', reason);
    logger.fatal(promise);
  });

  process.on('uncaughtException', (error) => {
    logger.fatal('Uncaught Exception:', error.stack);
  });

  const APP_PORT = process.env.APP_PORT ?? 3000;
  await app.listen(APP_PORT, () => {
    logger.verbose(`nestjs running at http://localhost:${APP_PORT}`);
  });
}
void bootstrap();
