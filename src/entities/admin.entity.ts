import { Entity, Enum, Opt, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { v4 } from "uuid";

@Entity()
export class Admin {
    @PrimaryKey({type: "uuid"})
    id = v4();

    @Property()
    @Unique()
    email!: string;

    @Property()
    password!: string;   

    @Enum({items: () => AdminRole, nativeEnumName: "admin_role"})
    role!: AdminRole;

    @Property()
    createdAt: Date & Opt = new Date();
}

export enum AdminRole {
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin"
}