import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from 'express';
import { CookieHelpers } from 'src/helpers/cookie-helpers/cookie-helper';
import { AuthenticatedRequest } from '../common/application-requests';

@Catch(ThrottlerException)
export class ThrottlerFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<AuthenticatedRequest>();
    const response = ctx.getResponse<Response>();

    // Clear auth cookies
    CookieHelpers.RemoveTokens(response, {
      isAdmin: request.admin !== undefined
    });

    return response.status(429).json({
        statusCode: 429,
        message: "Too many requests — slow down.",
        error: exception.name
    });
  }
}
