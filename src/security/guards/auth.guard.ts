import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../../security/common/application-requests';
import { AuthService } from 'src/modules/auth/auth.service';
import { AdminService } from 'src/modules/admin/admin.service';
import { CustomJwtService } from 'src/modules/common/custom-jwt-service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
    private readonly jwtService: CustomJwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;

    let token: string | undefined;

    // 1. Try to get Bearer token
    if (authorization?.startsWith("Bearer ")) {
      token = authorization.split(" ")[1];
      this.logger.log(`Bearer token provided: ${token}`);
    } else {
      this.logger.log("No Bearer token provided in headers");
    }

    // 2. If no Bearer token, try cookie
    if (!token) {
      token = request.cookies["token"] as string;
      if (token) {
        this.logger.log(`Cookie token provided: ${token}`);
      } else {
        this.logger.log("No token found in cookies");
      }
    }

    // 3. If still no token, reject
    if (!token) {
      this.logger.log("No token provided at all (neither Bearer nor cookie)");
      throw new UnauthorizedException("Authentication token missing");
    }

    try {
      const decodedPayload = await this.jwtService.VerifyToken(token);
      
      if (decodedPayload.isAdmin) {
        // find admin
        const admin = await this.adminService.GetAdminByIdForGuard(
          decodedPayload.adminId!,
        );

        if (admin === null) {
          this.logger.log('Admin was not found');
          throw new UnauthorizedException('Invalid token');
        }
        request.admin = admin;
      } else {
        // find user
        const user = await this.authService.GetUserByIdForGuard(decodedPayload.pid!);

        if (user === null) {
          this.logger.log('User was not found');
          throw new UnauthorizedException('Invalid token');
        }

        request.user = user;
      }

      return true;
    } catch {
      throw new UnauthorizedException('Malformed or Expired Access Token');
    }
  }
}
