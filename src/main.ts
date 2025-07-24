import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApplyConfigurations, ApplyCorsConfigurations, UseSwagger } from './configurations/bootstrap-configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  UseSwagger(app);
  ApplyConfigurations(app);
  ApplyCorsConfigurations(app);
  await app.listen(process.env.PORT ?? 5001);
}
bootstrap().catch(console.error);
