import { 
  CanActivate, 
  ExecutionContext, 
  Injectable, 
  Logger, 
  UnauthorizedException 
} from '@nestjs/common';
import { AuthenticatedRequest } from '../../security/common/application-requests';

const USER_ONLY_ERROR_MESSAGE = 'This action is restricted to users only';

/**
 * Guard to ensure that only regular users (not admins) can access protected routes
 * @throws {UnauthorizedException} If the request is from an admin or unauthenticated user
 */
@Injectable()
export class UserOnlyGuard implements CanActivate {
  private readonly logger = new Logger(UserOnlyGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const { user, admin } = request;
    const handler = context.getHandler().name;
    const controller = context.getClass().name;
    const { method, url } = request;

    // Log entry
    this.logger.debug(
      `Access attempt on ${method} ${url} (${controller} -> ${handler}) | ` +
      `userId=${user?.pid ?? 'none'}, adminId=${admin?.id ?? 'none'}`
    );

    // Admin trying to access user-only route
    if (admin !== undefined) {
      this.logger.warn(
        `❌ Denied: Admin ${admin.id} attempted to access user-only route ${method} ${url}`
      );
      throw new UnauthorizedException(USER_ONLY_ERROR_MESSAGE);
    }

    // Unauthenticated request
    if (!user) {
      this.logger.warn(
        `❌ Denied: Unauthenticated request attempted to access ${method} ${url}`
      );
      throw new UnauthorizedException(USER_ONLY_ERROR_MESSAGE);
    }

    // Success
    this.logger.log(
      `✅ Access granted to User ${user.pid} on ${method} ${url}`
    );

    return true;
  }
}
