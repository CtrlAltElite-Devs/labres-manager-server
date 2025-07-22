import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ResultsModule } from './results/results.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from "./mikro-orm.config";

@Module({
  imports: [AuthModule, ResultsModule,
    MikroOrmModule.forRootAsync({
      useFactory: () => config
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
