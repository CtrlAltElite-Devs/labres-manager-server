import { EntityRepository } from "@mikro-orm/postgresql";
import { License } from "src/entities/license.entity";
import { LicenseQueryResourceParameters } from "src/modules/license/query-parameters/license-query-parameters";

export default class LicenseRepository extends EntityRepository<License> {
  async FindByLicenseKeyAsync(licenseKey: string) {
    return await this.findOne({ licenseKey });
  }

  async FindByIdAsync(licenseId: string) {
    return await this.findOne({ licenseId });
  }

  async GetAllLicenses(params: LicenseQueryResourceParameters) {
    const licenseQuery = this.createQueryBuilder()
      .orderBy({ createdAt: "DESC" });

    licenseQuery.andWhere(params.GetFilters());

    return await licenseQuery.getResult();
  }

  async FindByFingerPrintAsync(fingerPrint: string) {
    return await this.findOne({ fingerPrint });
  }
}
