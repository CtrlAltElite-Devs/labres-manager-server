import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApplyConfigurations, ApplyCorsConfigurations } from './configurations/bootstrap-configuration';
import "dotenv/config";
import { ApplyApiVersioning } from './configurations/api-versioning-configuration';
import { UseSwagger } from './configurations/swagger-configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.APP_ENV === "staging" || process.env.NODE_ENV === "development") {
    UseSwagger(app);
  }


  ApplyConfigurations(app);
  ApplyCorsConfigurations(app);
  ApplyApiVersioning(app);


  await app.listen(process.env.PORT ?? 5001);
}
bootstrap().catch(console.error);
