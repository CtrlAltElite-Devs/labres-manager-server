import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities/user.entity';
import { TestResult } from 'src/entities/test-result.entity';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';
import { CommonModule } from '../common/common.module';
import { LicenseModule } from '../license/license.module';

@Module({
imports: [
    MikroOrmModule.forFeature([User, TestResult]),
    CommonModule,
    AuthModule, 
    AdminModule, 
    LicenseModule,
    FeatureFlagModule],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
