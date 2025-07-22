import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Admin } from 'src/entities/admin.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Admin])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
