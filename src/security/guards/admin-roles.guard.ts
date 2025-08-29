import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole } from 'src/entities/admin.entity';
import { AuthenticatedRequest } from '../common/application-requests';
import { ROLES_KEY } from '../decorators/admin-roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;
    const { admin } = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return requiredRoles.some(role => admin?.role.includes(role));
  }
}
