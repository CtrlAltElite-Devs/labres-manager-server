import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Logger } from "@nestjs/common";
import { FeatureFlag } from "src/entities/feature-flag.entity";

export class FeatureFlagSeeder extends Seeder {
    private readonly logger = new Logger(FeatureFlagSeeder.name);
    async run(em: EntityManager) {
        this.logger.log("Seeding Feature Flags");
        const features = defaultFeatures.map(df => {
            const feature = new FeatureFlag();
            feature.featureName = df.name;
            feature.description = df.description;
            return feature;
        })

        for(const feature of features){
            const exists = await em.findOne(FeatureFlag, {featureName: feature.featureName});
            if(exists !== null) continue;
            await em.upsert(FeatureFlag, feature, {
                onConflictFields : ['featureName'],
                onConflictAction: "ignore"
            })
        }
    }
}

type DefaultFeature = {
    name: string,
    description: string
}

const defaultFeatures : DefaultFeature[]= [
    {name: "delete-all", description: "a delete all function to remove the user's test results, very destructive"}
]


