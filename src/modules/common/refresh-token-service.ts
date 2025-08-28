import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { RefreshToken } from "src/entities/security/refresh-token.entity";
import { RequestMetadata } from "src/interceptors/interceptors.common";
import { CustomJwtService } from "./custom-jwt-service";
import { JwtHelper, JwtUserPayloadDto } from "src/utils/jwt-payload.dto";

@Injectable()
export class RefreshTokenService {
    private readonly logger = new Logger(RefreshTokenService.name);

    constructor(
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepository: EntityRepository<RefreshToken>,
        private readonly jwtService: CustomJwtService,
    ){}

    async Store(userId: string, refreshToken: string, metaData: RequestMetadata) {
        this.logger.log(`to hash token: ${refreshToken}`)
        // const tokenHashed = await bcrypt.hash(refreshToken, 10);
        const tokenHashed = refreshToken;


        const newToken = new RefreshToken();
        newToken.userId = userId;
        newToken.browserName = metaData.browserName;
        newToken.os = metaData.os;
        newToken.ipAddress = metaData.ipAddress;
        newToken.tokenHashed = tokenHashed;
        newToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const inserted = await this.refreshTokenRepository.upsert(newToken,{
            onConflictFields:  ['userId', 'browserName', 'ipAddress', 'os'],
            onConflictAction: "merge", 
            onConflictExcludeFields: ['id', 'createdAt']
        });

        this.logger.log(`Inserted Refresh token: ${JSON.stringify(inserted, null, 3)}`);
    }

    async RemoveAndReturnNewTokens(refreshToken: string, metaData: RequestMetadata) {
        
        let decoded: JwtUserPayloadDto;
        try{
            decoded = await this.jwtService.DecodeAndVerifyRefreshToken(refreshToken);
            this.logger.log(`Decoded payload: ${JSON.stringify(decoded, null, 3)}`);
        } catch {
            this.logger.log(`Malformed or Expired Refresh token`);
            throw new UnauthorizedException()
        }

        const tokenRecord = await this.refreshTokenRepository.findOne({
            userId: decoded.isAdmin? decoded.adminId : decoded.pid,
            ipAddress: metaData.ipAddress,
            browserName: metaData.browserName,
            os: metaData.os
        });
        this.logger.log(`Found token record: ${JSON.stringify(tokenRecord, null, 3)}`);
        

        if (tokenRecord === null) {
            this.logger.log("Refresh Token not found");
            throw new UnauthorizedException();
        }

        // 2. Verify token hash
        // const isSame = await bcrypt.compare(refreshToken, tokenRecord.tokenHashed);
        const isSame = refreshToken === tokenRecord.tokenHashed;
        this.logger.log(`Refresh token same: ${isSame} refresth token: ${refreshToken}`);
        if (!isSame) {
            this.logger.log("Refresh Token not the same");
            throw new UnauthorizedException()
        };

        // expired
        if (tokenRecord.expiresAt.getTime() <= Date.now()) {
            this.logger.log("Refresh Token Db Record Expired");
            throw new UnauthorizedException()
        }
        const deleted = await this.refreshTokenRepository.nativeDelete(tokenRecord);
        this.logger.log(`Deleted ${deleted} Refresh tokens`);
        const payload = JwtHelper.Extract(decoded);
        this.logger.log(`New Payload: ${JSON.stringify(payload, null, 3)}`);
        const { token: newToken, refreshToken: newRefreshToken } = await this.jwtService.CreateSignedTokens(payload);
        this.logger.log(`generated tokens: ${newRefreshToken}`)
        
        return { 
            userId: decoded.isAdmin? decoded.adminId : decoded.pid, 
            newToken, 
            newRefreshToken 
        };
    }

    async RemoveRefreshToken(userId: string){
        const deleted = await this.refreshTokenRepository.nativeDelete({
            userId
        })
        this.logger.log(`Deleted ${deleted} Refresh tokens`);
    }
}

