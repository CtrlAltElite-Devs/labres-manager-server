import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ApplyConfigurations from './configurations/bootstrap-configuration';
import ApplyApiVersioning from './configurations/api-versioning-configuration';
import ApplyCorsConfigurations from "./configurations/cors-configuration";
import UseSwagger from './configurations/swagger-configuration';
import InitializeDatabase from "./configurations/database-initializiation";
import { IS_DEV_OR_STAGING } from "./utils/environment";
import usePostBootstrap from "./configurations/post-bootstrap";
import { ApplyLensConfigurations } from './configurations/lens-configuration';

async function bootstrap() { 
  const app = await NestFactory.create(AppModule);

  await InitializeDatabase(app);

  if (IS_DEV_OR_STAGING) {
    UseSwagger(app);
  }
  
  ApplyConfigurations(app);
  ApplyCorsConfigurations(app);
  ApplyApiVersioning(app);
  
  app.enableShutdownHooks();

  await ApplyLensConfigurations(app);

  await app.listen(process.env.PORT ?? 5001);
}

bootstrap()
.then(usePostBootstrap)
.catch(console.error);
