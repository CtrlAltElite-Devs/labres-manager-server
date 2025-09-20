import { Module } from '@nestjs/common';
import { FeatureFlagService } from './feature-flag.service';
import { FeatureFlagController } from './feature-flag.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { FeatureFlag } from 'src/entities/feature-flag.entity';
import { AuthModule } from '../auth/auth.module';
import { AdminModule } from '../admin/admin.module';
import { UnitOfWork } from '../common/unit-of-work';

@Module({
  imports: [AuthModule, AdminModule, MikroOrmModule.forFeature([FeatureFlag])],
  controllers: [FeatureFlagController],
  providers: [FeatureFlagService, UnitOfWork],
  exports: [FeatureFlagService]
})
export class FeatureFlagModule {}
