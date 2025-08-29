import { BadRequestException, CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { RefreshTokenDto } from "src/modules/auth/dto/refresh-token/refresh-token.dto";
import { RefreshTokenRequest } from "src/security/common/refresh-token-request";

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor{
    private readonly logger = new Logger(RefreshTokenInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request : RefreshTokenRequest = context.switchToHttp().getRequest();

        const body = request.body as RefreshTokenDto;
        const useCookie = request.query['useCookie'] === 'true';

        if(!useCookie && (body === undefined || body.refreshToken === undefined)){
            throw new BadRequestException("Request body is required if useCookie parameter is false");
        }

        if(useCookie && body.refreshToken !== undefined){
            throw new BadRequestException("useCookie parameter cannot go with a Request body");
        }

        const bodyDefined = body !== undefined;

        if(bodyDefined && (body.refreshToken !== undefined)){
            this.logger.log(`Body has refresh token: ${body.refreshToken}`)
            request.refreshToken = body.refreshToken!;
        } else {
            const refreshTokenFromCookies = request.cookies["refreshToken"] as string;
            this.logger.log(`Cookie refresh token: ${refreshTokenFromCookies}`)
            if(refreshTokenFromCookies === ""){
                throw new UnauthorizedException("Refresh Token Expired");
            }
            this.logger.log(`Cookie has refresh token: ${refreshTokenFromCookies}`)
            request.refreshToken = refreshTokenFromCookies;
        }

        return next.handle();
    }
}