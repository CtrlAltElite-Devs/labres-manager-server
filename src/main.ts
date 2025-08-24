import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ApplyConfigurations from './configurations/bootstrap-configuration';
import ApplyApiVersioning from './configurations/api-versioning-configuration';
import ApplyCorsConfigurations from "./configurations/cors-configuration";
import UseSwagger from './configurations/swagger-configuration';
import InitializeDatabase from "./configurations/database-initializiation";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.APP_ENV === "staging" || process.env.NODE_ENV === "development") {
    UseSwagger(app);
  }
  
  ApplyConfigurations(app);
  ApplyCorsConfigurations(app);
  ApplyApiVersioning(app);
  
  await InitializeDatabase(app);

  await app.listen(process.env.PORT ?? 5001);
}
bootstrap().catch(console.error);
