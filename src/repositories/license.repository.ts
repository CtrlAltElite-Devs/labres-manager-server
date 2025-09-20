import { EntityRepository } from "@mikro-orm/core";
import { License } from "src/entities/license.entity";

export default class LicenseRepository extends EntityRepository<License>{
    Add(license: License){
        return this.create(license);
    }
}