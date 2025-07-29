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
  app.enableCors({
      origin:  ["http://localhost:5173", "http://192.168.43.200:5173", "https://grv0jxjl-5001.asse.devtunnels.ms", "https://5mvm44vp-3000.asse.devtunnels.ms"],
      credentials: true
  });
}


