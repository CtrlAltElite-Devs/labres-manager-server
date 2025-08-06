import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const ACCESS_TOKEN = "accesstoken";

export function UseSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('Labres API')
    .setDescription('This is the Official Labres Api')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      ACCESS_TOKEN
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi', app, documentFactory, {
    jsonDocumentUrl: 'openapi/json',
  });
}

export function ApplyConfigurations(app: INestApplication<any>){
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
}

export function ApplyCorsConfigurations(app: INestApplication<any>){
  const isStaging = process.env.APP_ENV === 'staging';
  console.log("isStaging: ", isStaging);
  const corsOrigins = !isStaging
    ? ['https://your-production-frontend.com']
    : true

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });
}


