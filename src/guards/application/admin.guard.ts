import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from './application-requests';

@Injectable()
export class AdminGuard implements CanActivate {
    private readonly logger = new Logger(AdminGuard.name);

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

        if (!request.admin) {
            this.logger.log("This action requires an admin role")
            throw new UnauthorizedException('This action requires an admin role');
        }

        return true;
    }
}
