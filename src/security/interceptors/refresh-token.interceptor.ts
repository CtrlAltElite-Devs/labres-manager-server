import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RefreshTokenDto } from 'src/modules/auth/dto/refresh-token/refresh-token.dto';
import { RefreshTokenRequest } from 'src/security/common/refresh-token-request';

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RefreshTokenInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request: RefreshTokenRequest = context.switchToHttp().getRequest();
    const { method, url, query, cookies } = request;

    const body = request.body as RefreshTokenDto;
    const useCookie = query['useCookie'] === 'true';

    // Guard clauses with logging
    if (!useCookie && (!body || body.refreshToken === undefined)) {
      this.logger.warn(
        `[${method}] ${url} - Missing body.refreshToken while useCookie=false`,
      );
      throw new BadRequestException(
        'Request body is required if useCookie parameter is false',
      );
    }

    if (useCookie && body?.refreshToken !== undefined) {
      this.logger.warn(
        `[${method}] ${url} - Both useCookie=true and body.refreshToken provided`,
      );
      throw new BadRequestException(
        'useCookie parameter cannot go with a Request body',
      );
    }

    if (body?.refreshToken) {
      const preview = body.refreshToken.slice(0, 8) + '...';
      this.logger.log(
        `[${method}] ${url} - Refresh token provided in body: ${preview}`,
      );
      request.refreshToken = body.refreshToken;
    } else {
      const refreshTokenFromCookies = cookies['refreshToken'] as string;
      if (!refreshTokenFromCookies) {
        this.logger.warn(
          `[${method}] ${url} - No refresh token in cookies or body`,
        );
        throw new UnauthorizedException('Refresh Token Expired');
      }

      const preview = refreshTokenFromCookies.slice(0, 8) + '...';
      this.logger.log(
        `[${method}] ${url} - Refresh token provided in cookie: ${preview}`,
      );
      request.refreshToken = refreshTokenFromCookies;
    }

    return next.handle();
  }
}
