import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FeatureFlag } from 'src/entities/feature-flag.entity';
import { AddFeatureFlagDto } from './dto/add-feature-flag.dto';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class FeatureFlagService {
    private readonly logger = new Logger(FeatureFlagService.name);

    constructor(
        @InjectRepository(FeatureFlag)
        private readonly featureFlagRepository: EntityRepository<FeatureFlag>,

        private readonly em: EntityManager
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
        
        await this.featureFlagRepository.insert(newFeature);
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
        await this.em.flush();
        return feature;
    }
}
