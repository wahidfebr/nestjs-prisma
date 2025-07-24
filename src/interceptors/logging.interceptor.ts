import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { requestLogger } from '../main';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        const statusCode = res.statusCode;
        const responseTime = Date.now() - req.startTime;
        requestLogger.log(
          `[${req.requestId}] ${statusCode} finish pada api ${req.originalUrl} ${responseTime}ms`,
        );
      }),
    );
  }
}
