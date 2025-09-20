import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities/user.entity';
import { AdminService } from '../admin/admin.service';
import { Admin } from 'src/entities/admin.entity';
import { CustomJwtService } from '../common/custom-jwt-service';
import { RefreshTokenService } from '../common/refresh-token-service';
import { RefreshToken } from 'src/entities/security/refresh-token.entity';
import { UnitOfWork } from '../common/unit-of-work';

@Module({
  imports: [MikroOrmModule.forFeature([User, Admin, RefreshToken])],
  controllers: [AuthController],
  providers: [AuthService, AdminService, CustomJwtService, RefreshTokenService, UnitOfWork],
  exports: [AuthService, CustomJwtService]
})
export class AuthModule {}
