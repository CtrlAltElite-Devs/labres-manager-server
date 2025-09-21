import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { RefreshToken } from "src/entities/security/refresh-token.entity";
import { RequestMetadata } from "src/security/common/metadata-request";
import { CustomJwtService } from "./custom-jwt-service";
import { JwtHelper, JwtUserPayloadDto } from "src/utils/jwt-payload.dto";
import { RefreshTokenRepository } from "src/repositories/refresh-token.repository";

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: CustomJwtService,
  ) {}

  async Store(userId: string, refreshToken: string, metaData: RequestMetadata) {
    const tokenHashed = refreshToken; // ⚠️ in prod, hash before storing

    const newToken = new RefreshToken();
    newToken.userId = userId;
    newToken.browserName = metaData.browserName;
    newToken.os = metaData.os;
    newToken.ipAddress = metaData.ipAddress;
    newToken.tokenHashed = tokenHashed;
    newToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const inserted = await this.refreshTokenRepository.upsert(newToken, {
      onConflictFields: ["userId", "browserName", "ipAddress", "os"],
      onConflictAction: "merge",
      onConflictExcludeFields: ["id", "createdAt"],
    });

    this.logger.log(
      `Stored refresh token for user ${userId} (ip=${metaData.ipAddress}, browser=${metaData.browserName}, os=${metaData.os})`,
    );

    return inserted;
  }

  async RemoveAndReturnNewTokens(
    refreshToken: string,
    metaData: RequestMetadata,
  ) {
    let decoded: JwtUserPayloadDto;
    try {
      decoded = await this.jwtService.DecodeAndVerifyRefreshToken(refreshToken);
      this.logger.log(
        `Decoded refresh token for user=${decoded.isAdmin ? decoded.adminId : decoded.pid}, isAdmin=${decoded.isAdmin}`,
      );
    } catch {
      this.logger.warn(`Malformed or expired refresh token`);
      throw new UnauthorizedException();
    }

    const userId = decoded.isAdmin ? decoded.adminId : decoded.pid;
    const tokenRecord = await this.refreshTokenRepository.findOne({
      userId,
      ipAddress: metaData.ipAddress,
      browserName: metaData.browserName,
      os: metaData.os,
    });

    if (!tokenRecord) {
      this.logger.warn(
        `No matching refresh token record found for user ${userId} (ip=${metaData.ipAddress}, browser=${metaData.browserName}, os=${metaData.os})`,
      );
      throw new UnauthorizedException();
    }
    this.logger.debug(
      `Found token record for user ${userId}, expiresAt=${tokenRecord.expiresAt.toISOString()}`,
    );

    // 2. Verify token hash (⚠️ in prod: compare hash instead of direct string match)
    const isSame = refreshToken === tokenRecord.tokenHashed;
    if (!isSame) {
      this.logger.warn(`Refresh token mismatch for user ${userId}`);
      throw new UnauthorizedException();
    }

    // 3. Expiry check
    if (tokenRecord.expiresAt.getTime() <= Date.now()) {
      this.logger.warn(`Expired refresh token for user ${userId}`);
      await this.refreshTokenRepository.nativeDelete(tokenRecord);
      throw new UnauthorizedException();
    }

    // 4. Rotate: delete old and generate new
    const deleted = await this.refreshTokenRepository.nativeDelete(tokenRecord);
    this.logger.log(`Deleted ${deleted} old refresh token(s) for user ${userId}`);

    const payload = JwtHelper.Extract(decoded);
    const { token: newToken, refreshToken: newRefreshToken } =
      await this.jwtService.CreateSignedTokens(payload);

    this.logger.log(`Issued new tokens for user ${userId}`);
    this.logger.debug(
      `New refresh token (preview): ${newRefreshToken.slice(0, 8)}...`,
    );

    return {
      userId,
      newToken,
      newRefreshToken,
    };
  }

  async RemoveRefreshToken(userId: string) {
    const deleted = await this.refreshTokenRepository.nativeDelete({
      userId,
    });
    this.logger.log(`Deleted ${deleted} refresh tokens for user ${userId}`);
  }
}
