import { Entity, EntityRepositoryType, Opt, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { RefreshTokenRepository } from "src/repositories/refresh-token.repository";
import { v4 } from "uuid";


@Entity({repository: () => RefreshTokenRepository})
@Unique({ properties: ['userId', 'browserName', 'ipAddress', 'os'] })
export class RefreshToken {
    [EntityRepositoryType]? : RefreshTokenRepository

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
}
