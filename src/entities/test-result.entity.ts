import { Entity, EntityRepositoryType, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";
import { User } from "./user.entity";
import { License } from "./license.entity";
import { TestResultRepository } from "../repositories/results.repository"
import { ValidatedTestResultV2 } from '../modules/results/validators/result.validator';

@Entity({ repository: () => TestResultRepository })
export class TestResult {
  [EntityRepositoryType]?: TestResultRepository

  @PrimaryKey({ columnType: "uuid" })
  id = v4();

  @ManyToOne(() => User, {
    fieldName: 'userPid',
  })
  user: User;

  @ManyToOne(() => License, {
    fieldName: "machine_license_id"
  })
  machine: License

  @Property()
  testName: string;

  @Property()
  binaryPdf: Buffer;

  @Property()
  size: number;

  @Property({ columnType: "timestamp" })
  testDate: Date;

  static Create(
    user: User, 
    data: ValidatedTestResultV2, 
    file: Express.Multer.File,
    license: License,
  ) : TestResult{ 
    const test = new TestResult();
    test.user = user;
    test.testDate = data.testDate;
    test.testName = data.testName;
    test.size = data.size;
    test.machine = license;
    test.binaryPdf = file.buffer;
    return test;
  }
}


export type TestResultWithoutPdf = Omit<TestResult, 'binaryPdf'>;
