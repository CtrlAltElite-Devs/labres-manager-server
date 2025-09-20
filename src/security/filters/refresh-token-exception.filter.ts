import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { CookieHelpers } from 'src/helpers/cookie-helpers/cookie-helper';
import { AuthenticatedRequest } from '../common/application-requests';

@Catch(UnauthorizedException)
export class RefreshTokenExceptionFilter implements ExceptionFilter<UnauthorizedException> {
  private readonly logger = new Logger(RefreshTokenExceptionFilter.name);

  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<AuthenticatedRequest>();
    const response = ctx.getResponse<Response>();

    // Clear auth cookies
    CookieHelpers.RemoveTokens(response, {
      isAdmin: request.admin !== undefined
    });

    // Log for debugging
    this.logger.warn(`Failed to Refresh token removing cookies\n IsAdmin: ${request.admin !== undefined}`);

    // Return standardized JSON error
    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: exception.message,
      error: exception.name, // "UnauthorizedException"
    });
  }
}
