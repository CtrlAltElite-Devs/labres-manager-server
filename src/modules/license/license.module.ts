import { Module } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { License } from 'src/entities/license.entity';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [MikroOrmModule.forFeature([License]), CommonModule, AuthModule, AdminModule],
  controllers: [LicenseController],
  providers: [LicenseService],
  exports: [LicenseService]
})
export class LicenseModule {}
