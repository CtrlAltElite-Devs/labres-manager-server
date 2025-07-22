import { Entity, Opt, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()   
export class User {
    @PrimaryKey()
    pid: string;

    @Property({nullable: true})
    password?:string;

    @Property({nullable: true})
    dob?: Date

    @Property()
    createdAt: Date & Opt = new Date()
}