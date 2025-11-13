import { Entity, EntityRepositoryType, Opt, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { RefreshTokenRepository } from "../../repositories/refresh-token.repository";
import { RequestMetadata } from "src/security/common/metadata-request";
import { v4 } from "uuid";


@Entity({ repository: () => RefreshTokenRepository })
@Unique({ properties: ['userId', 'browserName', 'ipAddress', 'os'] })
export class RefreshToken {
  [EntityRepositoryType]?: RefreshTokenRepository

  @PrimaryKey({ type: "uuid" })
  id = v4();

  @Property()
  userId: string;

  @Property()
  tokenHashed: string;

  @Property()
  os: string;

  @Property()
  browserName: string;

  @Property()
  ipAddress: string;

  @Property()
  createdAt: Date & Opt = new Date();

  @Property()
  expiresAt: Date;

  IsExpired(): boolean {
    return this.expiresAt.getTime() <= Date.now()
  }

  static Create(userId: string, metaData: RequestMetadata, token: string) {
    const newToken = new RefreshToken();
    newToken.userId = userId;
    newToken.browserName = metaData.browserName;
    newToken.os = metaData.os;
    newToken.ipAddress = metaData.ipAddress;
    newToken.tokenHashed = token;
    newToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return newToken;
  }
}
