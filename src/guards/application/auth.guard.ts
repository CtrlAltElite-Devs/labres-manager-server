import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from './application-requests';
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

    if (!authorization?.startsWith('Bearer')) {
      this.logger.log('No Bearer token provided');
      throw new UnauthorizedException();
    }

    let token = authorization?.split(' ')[1];
    this.logger.log(`Bearer token: ${token}`);

    if(!token){
      token = request.cookies["token"] as string
      this.logger.log(`cookie token: ${token}`);
    }

    if (!token) {
      this.logger.log('No token provided');
      throw new UnauthorizedException();
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
