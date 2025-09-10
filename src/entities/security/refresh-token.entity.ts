import { Entity, Opt, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { v4 } from "uuid";


@Entity()
@Unique({ properties: ['userId', 'browserName', 'ipAddress', 'os'] })
export class RefreshToken {
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
