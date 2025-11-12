import { Entity, EntityRepositoryType, Opt, PrimaryKey, Property } from "@mikro-orm/core";
import { UserRepository } from "src/repositories/user.repository";

@Entity({repository: () => UserRepository})   
export class User {
    [EntityRepositoryType]? : UserRepository

    @PrimaryKey()
    pid: string;

    @Property({nullable: true})
    password?:string;

    @Property({nullable: true})
    dob?: Date

    @Property()
    createdAt: Date & Opt = new Date()

    static Create(pid: string) : User {
        const newUser = new User();
        newUser.pid = pid;
        return newUser;
    }
}