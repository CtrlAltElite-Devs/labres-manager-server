import { EntityRepository } from "@mikro-orm/postgresql";
import { FeatureFlag } from "src/entities/feature-flag.entity";
import { FeatureQueryResourceParameters } from "src/modules/feature-flag/query-parameters/feature-query-parameters";

export class FeatureFlagRepository extends EntityRepository<FeatureFlag> {
    async GetAllFeaturesAsync(params: FeatureQueryResourceParameters) {
        const featureQuery = this.createQueryBuilder()
            .orderBy({ createdAt: "DESC" });

        featureQuery.andWhere(params.GetFilters());

        return await featureQuery.getResult();
    }
}
