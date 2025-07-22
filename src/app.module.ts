import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AdminModule } from './modules/admin/admin.module';
import { ResultsModule } from './modules/results/results.module';
import { HealthController } from './modules/health/health.controller';
import config from "./mikro-orm.config";

@Module({
  imports: [AuthModule, ResultsModule, AdminModule,
    MikroOrmModule.forRootAsync({
      useFactory: () => config
    }),
  ],
  controllers: [HealthController]
})
export class AppModule {}
