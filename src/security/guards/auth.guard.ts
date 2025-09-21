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
    private readonly jwtService: CustomJwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const { method, url } = request;
    const authorization = request.headers.authorization;

    let token: string | undefined;

    this.logger.log(`Incoming request: [${method}] ${url}`);

    // 1. Try to get Bearer token
    if (authorization?.startsWith('Bearer ')) {
      token = authorization.split(' ')[1];
      this.logger.debug(`Bearer token provided: ${token.substring(0, 15)}...`);
    } else {
      this.logger.debug('No Bearer token provided in headers');
    }

    // 2. If no Bearer token, try cookie
    if (!token) {
      token = request.cookies['token'] as string;
      if (token) {
        this.logger.debug(`Cookie token provided: ${token.substring(0, 15)}...`);
      } else {
        this.logger.debug('No token found in cookies');
      }
    }

    // 3. If still no token, reject
    if (!token) {
      this.logger.warn(
        `Unauthorized request to [${method}] ${url} - no token provided`,
      );
      throw new UnauthorizedException('Authentication token missing');
    }

    try {
      const decodedPayload = await this.jwtService.VerifyToken(token);
      this.logger.debug(
        `Decoded token payload: ${JSON.stringify(decodedPayload)}`,
      );

      if (decodedPayload.isAdmin) {
        // find admin
        const admin = await this.adminService.GetAdminByIdForGuard(
          decodedPayload.adminId!,
        );

        if (!admin) {
          this.logger.warn(
            `Invalid admin token: adminId=${decodedPayload.adminId}`,
          );
          throw new UnauthorizedException('Invalid token');
        }

        this.logger.log(
          `Authenticated admin (id=${admin.id}, email=${admin.email})`,
        );
        request.admin = admin;
      } else {
        // find user
        const user = await this.authService.GetUserByIdForGuard(
          decodedPayload.pid!,
        );

        if (!user) {
          this.logger.warn(
            `Invalid user token: userId=${decodedPayload.pid}`,
          );
          throw new UnauthorizedException('Invalid token');
        }

        this.logger.log(
          `Authenticated user (id=${user.pid})`,
        );
        request.user = user;
      }

      this.logger.log(`Access granted to [${method}] ${url}`);
      return true;
    } catch (err) {
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Authentication failed for [${method}] ${url}: ${err.message}`,
      );
      throw new UnauthorizedException('Malformed or Expired Access Token');
    }
  }
}
