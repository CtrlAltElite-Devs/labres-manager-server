import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedRequest } from '../../security/common/application-requests';

const USER_ONLY_ERROR_MESSAGE = 'This action is restricted to users only';

/**
 * Guard to ensure that only regular users (not admins) can access protected routes
 * @throws {UnauthorizedException} If the request is from an admin or unauthenticated user
 */
@Injectable()
export class UserOnlyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request: AuthenticatedRequest = context.switchToHttp().getRequest();
        
        const { user, admin } = request;

        // Check if admin is trying to access user-only route
        if (admin !== undefined) {
            throw new UnauthorizedException(USER_ONLY_ERROR_MESSAGE);
        }

        // Check if user is authenticated
        if (!user) {
            throw new UnauthorizedException(USER_ONLY_ERROR_MESSAGE);
        }

        return true;
    }
}