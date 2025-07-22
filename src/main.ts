import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UseSwagger } from './bootstrap-configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  UseSwagger(app);
  app.setGlobalPrefix("api");
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(console.error);
