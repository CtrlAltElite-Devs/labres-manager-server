import { Module } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { License } from 'src/entities/license.entity';

@Module({
  imports: [MikroOrmModule.forFeature([License])],
  controllers: [LicenseController],
  providers: [LicenseService],
  exports: [LicenseService]
})
export class LicenseModule {}
