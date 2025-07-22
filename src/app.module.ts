import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ResultsModule } from './results/results.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from "./mikro-orm.config";
import { HealthController } from './health/health.controller';

@Module({
  imports: [AuthModule, ResultsModule,
    MikroOrmModule.forRootAsync({
      useFactory: () => config
    })
  ],
  controllers: [HealthController]
})
export class AppModule {}
