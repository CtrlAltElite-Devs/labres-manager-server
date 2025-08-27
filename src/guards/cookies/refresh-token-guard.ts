import { BadRequestException, CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { RefreshTokenDto } from "src/modules/auth/dto/refresh-token/refresh-token.dto";
import { RefreshTokenRequest } from "./refresh-token-request";

@Injectable()
export class RefreshTokenGuard implements CanActivate{
    private readonly logger = new Logger(RefreshTokenGuard.name);

    canActivate(context: ExecutionContext): boolean  {
        const request : RefreshTokenRequest = context.switchToHttp().getRequest();

        const body = request.body as RefreshTokenDto;
        const useCookie = request.query['useCookie'] === 'true';

        if(!useCookie && (body === undefined || body.refreshToken === undefined)){
            throw new BadRequestException("Request body is required if useCookie parameter is false");
        }

        if(useCookie && body.refreshToken !== undefined){
            throw new BadRequestException("useCookie parameter cannot go with a Request body");
        }

        const hasRefreshTokenFromBody = body !== undefined;

        if(hasRefreshTokenFromBody && (body.refreshToken !== undefined)){
            this.logger.log(`Body has refresh token: ${body.refreshToken}`)
            request.refreshToken = body.refreshToken!;
        } else {
            const refreshTokenFromCookies = request.cookies["refreshToken"] as string;
            this.logger.log(`Cookie refresh token: ${refreshTokenFromCookies}`)
            if(refreshTokenFromCookies === ""){
                throw new UnauthorizedException("Refresh Token Expired");
            }
            request.refreshToken = refreshTokenFromCookies;
        }

        return true;
    }

}