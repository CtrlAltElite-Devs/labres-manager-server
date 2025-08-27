import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AdminModule } from './modules/admin/admin.module';
import { ResultsModule } from './modules/results/results.module';
import { HealthController } from './modules/health/health.controller';
import config from "../mikro-orm.config";
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { LicenseModule } from './modules/license/license.module';
import { FeatureFlagModule } from './modules/feature-flag/feature-flag.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule, ResultsModule, AdminModule, LicenseModule, FeatureFlagModule,
    MikroOrmModule.forRootAsync({useFactory: () => config}),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '300s'}
    }),
    ConfigModule.forRoot({isGlobal: true}),
    CacheModule.register({isGlobal: true})
  ],
  controllers: [HealthController]
})
export class AppModule {}
