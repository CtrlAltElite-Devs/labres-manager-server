import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtUserPayloadDto } from "src/utils/jwt-payload.dto";

export type SignedAuthenticationPayload = {
    token: string;
    refreshToken: string;
}

@Injectable()
export class CustomJwtService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ){}

    async CreateSignedTokens(payload: JwtUserPayloadDto) : Promise<SignedAuthenticationPayload> {
        const token = await this.jwtService.signAsync(payload);
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.config.get<string>("JWT_REFRESH_SECRET"),
            expiresIn: '2d'
        });

        return {
            token, refreshToken
        }
    }

    async VerifyAndDecodeAccessToken(token: string) {
        return await this.jwtService.verifyAsync<JwtUserPayloadDto>(token, {
            secret: this.config.get<string>('JWT_SECRET')
        });
    }
    
    async VerifyAndDecodeRefreshToken(refreshToken: string){
        return await this.jwtService.verifyAsync<JwtUserPayloadDto>(refreshToken, {
            secret: this.config.get<string>("JWT_REFRESH_SECRET")
        })
    }
}