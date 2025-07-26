import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";
import { User } from "./user.entity";
import { License } from "./license.entity";

@Entity()
export class TestResult {
    @PrimaryKey({columnType: "uuid"})
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

    @Property({columnType: "timestamp"})
    testDate: Date;
}


export type TestResultWithoutPdf = Omit<TestResult, 'binaryPdf'>;
