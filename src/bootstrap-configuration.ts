import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function UseSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('Labres API')
    .setDescription('This is the Official Labres Api description')
    .setVersion('1.0')
    .addTag('labres')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi', app, documentFactory, {
    jsonDocumentUrl: 'openapi/json',
  });
}
