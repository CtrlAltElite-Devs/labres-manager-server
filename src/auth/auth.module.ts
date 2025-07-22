import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities/user.entity';
import { Admin } from 'src/entities/admin.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User, Admin])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
