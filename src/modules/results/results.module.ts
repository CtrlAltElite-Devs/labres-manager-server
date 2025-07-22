import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities/user.entity';
import { TestResult } from 'src/entities/test-result.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User, TestResult])],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
