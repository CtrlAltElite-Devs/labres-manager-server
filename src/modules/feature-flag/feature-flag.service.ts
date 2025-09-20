import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FeatureFlag } from 'src/entities/feature-flag.entity';
import { AddFeatureFlagDto } from './dto/add-feature-flag.dto';
import { FeatureFlagRepository } from 'src/repositories/feature-flag.repository';
import { UnitOfWork } from '../common/unit-of-work';

@Injectable()
export class FeatureFlagService {
    private readonly logger = new Logger(FeatureFlagService.name);

    constructor(
        private readonly featureFlagRepository: FeatureFlagRepository,
        private readonly unitOfWork: UnitOfWork
    ){}

    async getFeatures(){
        return await this.featureFlagRepository.findAll();
    }

    async AddFeature(dto: AddFeatureFlagDto){
        const { featureName, featureDescription } = dto;

        const existing = await this.featureFlagRepository.findOne({featureName: featureName});
        if(existing !== null){
            throw new BadRequestException("feature already exists");
        }

        const newFeature = new FeatureFlag();
        newFeature.featureName = featureName;
        newFeature.description = featureDescription;
        
        this.featureFlagRepository.create(newFeature);
        await this.unitOfWork.Commit();
        return newFeature;
    }

    async ToggleFeature(featureId: string){
        const feature = await this.featureFlagRepository.findOne({
            id: featureId
        });

        if(feature === null){
            throw new NotFoundException("Feature not found");
        }

        feature.toggle();
        await this.unitOfWork.Commit();
        return feature;
    }

    async isFeatureOn(featureName: string){
        const feature = await this.featureFlagRepository.findOne({
            featureName: featureName
        });

        if(feature === null){
            throw new NotFoundException("Feature not found");
        }

        return feature.isOn;
    }
}
