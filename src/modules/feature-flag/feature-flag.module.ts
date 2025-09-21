import { Module } from '@nestjs/common';
import { FeatureFlagService } from './feature-flag.service';
import { FeatureFlagController } from './feature-flag.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { FeatureFlag } from 'src/entities/feature-flag.entity';
import { AuthModule } from '../auth/auth.module';
import { AdminModule } from '../admin/admin.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [MikroOrmModule.forFeature([FeatureFlag]), CommonModule, AuthModule, AdminModule],
  controllers: [FeatureFlagController],
  providers: [FeatureFlagService],
  exports: [FeatureFlagService]
})
export class FeatureFlagModule {}
