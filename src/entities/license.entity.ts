import { Entity, EntityRepositoryType, Opt, PrimaryKey, Property } from "@mikro-orm/core";
import LicenseRepository from "src/repositories/license.repository";
import { v4 } from "uuid";

@Entity({repository: () => LicenseRepository})
export class License {
    [EntityRepositoryType] ? : LicenseRepository

    @PrimaryKey({type: "uuid"})
    licenseId = v4();

    @Property({unique: true})
    licenseKey: string;

    @Property()
    createdAt: Date & Opt = new Date()

    @Property({nullable: true})
    fingerPrint: string;

    @Property({default: false })
    isRevoked: boolean

    Revoke(){
        this.isRevoked = true;
    }

    Reactivate(){
        this.isRevoked = false;
    }

    static Create(licenseKey: string) : License{
        const newLicense = new License();
        newLicense.licenseKey = licenseKey;
        return newLicense;
    }
}