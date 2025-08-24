import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { FeatureFlagService } from './feature-flag.service';
import { SuperAdminOnly } from 'src/guards/application/application-guard.decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AddFeatureFlagDto } from './dto/add-feature-flag.dto';
import { ToggleFeatureFlagDto } from './dto/toggle-feature-flag.dto';
import { ACCESS_TOKEN } from 'src/configurations/common-configuration';

@Controller('feature-flag')
@ApiBearerAuth(ACCESS_TOKEN)
@SuperAdminOnly()
export class FeatureFlagController {
  constructor(private readonly featureFlagService: FeatureFlagService) {}

  @Get()
  async getFeatures(){
    const response = await this.featureFlagService.getFeatures();
    return response;
  }

  @Post()
  async addFeatureFlag(@Body() body: AddFeatureFlagDto){
    const response = await this.featureFlagService.AddFeature(body);
    return response;
  }

  @Patch("toggle-feature")
  async toggleFeature(@Body() body: ToggleFeatureFlagDto){
    const response = await this.featureFlagService.ToggleFeature(body.featureId);
    return response;
  }
}
