import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Admin } from 'src/entities/admin.entity';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenService } from '../common/refresh-token-service';
import { RefreshToken } from 'src/entities/security/refresh-token.entity';
import { UnitOfWork } from '../common/unit-of-work';

@Module({
  imports: [AuthModule, MikroOrmModule.forFeature([Admin, RefreshToken])],
  controllers: [AdminController],
  providers: [AdminService, RefreshTokenService, UnitOfWork],
  exports: [AdminService]
})
export class AdminModule {}
