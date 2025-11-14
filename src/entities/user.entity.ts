import { Entity, EntityRepositoryType, Opt, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { UserRepository } from "../repositories/user.repository";
import { ValidatedTestResultV2 } from '../modules/results/validators/result.validator';
import { parseDobString } from '../utils/parse-dob-string';


@Entity({ repository: () => UserRepository })
export class User {
  [EntityRepositoryType]?: UserRepository

  @PrimaryKey()
  pid: string;

  @Property({ nullable: true })
  password?: string;

  @Property({ nullable: true })
  dob?: Date

  @Property({ nullable: true })
  lastName?: string;

  @Property({ nullable: true })
  @Unique()
  email?: string;

  @Property({ default: false })
  emailVerified: boolean;

  @Property()
  createdAt: Date & Opt = new Date()

  needsOnboarding(): boolean {
    const isMissingEmail = !this.email;
    const isUnverified = !this.emailVerified;
    const isMissingPassword = !this.password;

    return isMissingEmail || isUnverified || isMissingPassword;
  }

  static Create(pid: string): User {
    const newUser = new User();
    newUser.pid = pid;
    return newUser;
  }

  static CreateV2(data: ValidatedTestResultV2): User {
    const newUser = new User();
    newUser.pid = data.pid;
    newUser.dob = parseDobString(data.dob);
    newUser.lastName = data.lastName;
    return newUser;
  }
}
