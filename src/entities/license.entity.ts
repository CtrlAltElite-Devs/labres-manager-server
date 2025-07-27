import { Entity, Opt, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";

@Entity()
export class License {
    @PrimaryKey({type: "uuid"})
    licenseId = v4();

    @Property()
    licenseKey: string;

    @Property()
    createdAt: Date & Opt = new Date()

    @Property({nullable: true})
    fingerPrint: string;

    @Property({default: false })
    isRevoked: boolean
}