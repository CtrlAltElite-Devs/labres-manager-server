import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { FeatureFlagGuard } from './feature-flag.guard';

export const FEATURE_FLAG_KEY = 'featureFlag';

export const FeatureFlag = (flag: string) => SetMetadata(FEATURE_FLAG_KEY, flag);

export function UseFeatureFlag(featureName: string){
    return applyDecorators(
        FeatureFlag(featureName), UseGuards(FeatureFlagGuard)
    )
}