import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { requestLogger } from '../main';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    const req = ctx.getRequest<Request>();
    const responseTime = Date.now() - req.startTime;

    requestLogger.error(
      `[${req.requestId}] ${statusCode} finish pada api ${req.originalUrl} ${responseTime}ms`,
    );

    res.status(statusCode).send(exception.getResponse());
  }
}
