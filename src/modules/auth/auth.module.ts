import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities/user.entity';
import { Admin } from 'src/entities/admin.entity';
import { CommonModule } from '../common/common.module';
import { AdminModule } from '../admin/admin.module';
import { OTP } from 'src/entities/security/otp.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User, Admin, OTP]), CommonModule, AdminModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
