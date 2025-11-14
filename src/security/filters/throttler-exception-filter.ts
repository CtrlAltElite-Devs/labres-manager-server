import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';

@Catch(ThrottlerException)
export class ThrottlerFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return response.status(429).json({
        statusCode: 429,
        message: "Too many requests — slow down.",
        error: exception.name
    });
  }
}
