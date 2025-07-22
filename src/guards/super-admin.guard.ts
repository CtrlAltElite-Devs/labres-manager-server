import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AuthenticatedRequest } from "./application-requests";
import { AdminRole } from "src/entities/admin.entity";

@Injectable()
export class SuperAdminGuard implements CanActivate{
    private readonly logger = new Logger(SuperAdminGuard.name);

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

        const { admin } = request;

        if(admin?.role !== AdminRole.SUPER_ADMIN){
            this.logger.log(`this action requires a super admin role, current role ${admin?.role}`)
            throw new UnauthorizedException("this action requires a super admin role")
        }

        this.logger.log(`Admin status passed ${admin.role}`)
        return true;
    }

}