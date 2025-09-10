import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { CookieHelpers } from 'src/helpers/cookie-helpers/cookie-helper';

@Catch(UnauthorizedException)
export class RefreshTokenExceptionFilter implements ExceptionFilter<UnauthorizedException> {
  private readonly logger = new Logger(RefreshTokenExceptionFilter.name);

  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Clear auth cookies
    CookieHelpers.RemoveTokens(response);

    // Log for debugging
    this.logger.warn(`Failed to Refresh token removing cookies`);

    // Return standardized JSON error
    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: exception.message,
      error: exception.name, // "UnauthorizedException"
    });
  }
}
