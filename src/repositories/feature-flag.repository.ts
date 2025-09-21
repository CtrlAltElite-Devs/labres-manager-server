import { EntityRepository } from "@mikro-orm/core";
import { FeatureFlag } from "src/entities/feature-flag.entity";

export class FeatureFlagRepository extends EntityRepository<FeatureFlag>{

}