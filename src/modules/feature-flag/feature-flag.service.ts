import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FeatureFlag } from 'src/entities/feature-flag.entity';
import { AddFeatureFlagDto } from './dto/add-feature-flag.dto';
import { FeatureFlagRepository } from 'src/repositories/feature-flag.repository';
import { UnitOfWork } from '../common/unit-of-work';
import { FeatureQueryResourceParameters } from './query-parameters/feature-query-parameters';

@Injectable()
export class FeatureFlagService {
    private readonly logger = new Logger(FeatureFlagService.name);

    constructor(
        private readonly featureFlagRepository: FeatureFlagRepository,
        private readonly unitOfWork: UnitOfWork
    ) { }

    async getFeatures(params: FeatureQueryResourceParameters) {
        return await this.featureFlagRepository.GetAllFeaturesAsync(params);
    }

    async AddFeature(dto: AddFeatureFlagDto) {
        const { featureName, featureDescription } = dto;

        const existing = await this.featureFlagRepository.findOne({ featureName: featureName });
        if (existing !== null) {
            throw new BadRequestException("feature already exists");
        }

        const newFeature = new FeatureFlag();
        newFeature.featureName = featureName;
        newFeature.description = featureDescription;

        this.featureFlagRepository.create(newFeature);
        await this.unitOfWork.Commit();
        this.logger.log(`${newFeature.featureName} was added`);
        return newFeature;
    }

    async ToggleFeature(featureId: string) {
        const feature = await this.featureFlagRepository.findOne({
            id: featureId
        });

        if (feature === null) {
            throw new NotFoundException("Feature not found");
        }

        feature.toggle();
        await this.unitOfWork.Commit();
        this.logger.log(`feature: ${featureId} was updated to ${feature.isOn}`)
        return feature;
    }

    async isFeatureOn(featureName: string) {
        const feature = await this.featureFlagRepository.findOne({
            featureName: featureName
        });

        if (feature === null) {
            throw new NotFoundException("Feature not found");
        }

        return feature.isOn;
    }
}
