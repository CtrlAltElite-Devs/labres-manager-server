import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { FeatureFlagService } from './feature-flag.service';
import { UseSuperAdminOnlyGuard } from 'src/security/decorators/index.decorators';
import { AddFeatureFlagDto } from './dto/add-feature-flag.dto';
import { ToggleFeatureFlagDto } from './dto/toggle-feature-flag.dto';
import { FeatureQueryResourceParameters } from './query-parameters/feature-query-parameters';

@Controller('feature-flag')
@UseSuperAdminOnlyGuard()
export class FeatureFlagController {
    constructor(private readonly featureFlagService: FeatureFlagService) { }

    @Get()
    async getFeatures(
        @Query() params: FeatureQueryResourceParameters
    ) {
        const response = await this.featureFlagService.getFeatures(params);
        return response;
    }

    @Post()
    async addFeatureFlag(@Body() body: AddFeatureFlagDto) {
        const response = await this.featureFlagService.AddFeature(body);
        return response;
    }

    @Patch("toggle-feature")
    async toggleFeature(@Body() body: ToggleFeatureFlagDto) {
        const response = await this.featureFlagService.ToggleFeature(body.featureId);
        return response;
    }
}
