import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities/user.entity';
import { TestResult } from 'src/entities/test-result.entity';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { Admin } from 'src/entities/admin.entity';
import { AdminModule } from '../admin/admin.module';
import { AdminService } from '../admin/admin.service';
import { LicenseService } from '../license/license.service';
import { License } from 'src/entities/license.entity';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';
import { FeatureFlagService } from '../feature-flag/feature-flag.service';
import { FeatureFlag } from 'src/entities/feature-flag.entity';

@Module({
  imports: [AuthModule, AdminModule, FeatureFlagModule, MikroOrmModule.forFeature([User, TestResult, Admin, License, FeatureFlag])],
  controllers: [ResultsController],
  providers: [ResultsService, AuthService, AdminService, LicenseService, FeatureFlagService],
})
export class ResultsModule {}
