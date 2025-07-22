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

@Module({
  imports: [AuthModule, AdminModule, MikroOrmModule.forFeature([User, TestResult, Admin])],
  controllers: [ResultsController],
  providers: [ResultsService, AuthService, AdminService],
})
export class ResultsModule {}
