import { Module } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { License } from 'src/entities/license.entity';
import { AuthModule } from '../auth/auth.module';
import { AdminService } from '../admin/admin.service';
import { Admin } from 'src/entities/admin.entity';
import { RefreshTokenService } from '../common/refresh-token-service';
import { RefreshToken } from 'src/entities/security/refresh-token.entity';

@Module({
  imports: [AuthModule, MikroOrmModule.forFeature([License, Admin, RefreshToken])],
  controllers: [LicenseController],
  providers: [LicenseService, AdminService, RefreshTokenService],
  exports: [LicenseService]
})
export class LicenseModule {}
