import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedRequest } from './application-requests';

@Injectable()
export class UserOnlyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

        const { user } = request;
        if(!user){
            throw new UnauthorizedException("this action is for users only")
        }

        return true;
    }

}