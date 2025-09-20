import { Entity, EntityRepositoryType, Enum, Opt, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { AdminRepository } from "src/repositories/admin.repository";
import { v4 } from "uuid";

// todo make everything gamit ani para naa tay repository layer
@Entity({ repository: () => AdminRepository })
export class Admin {
    [EntityRepositoryType]? : AdminRepository

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
