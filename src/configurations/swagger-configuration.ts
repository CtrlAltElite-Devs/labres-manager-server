import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ACCESS_TOKEN, SWAGGER_ENDPOINT } from "./common-configuration";

export default function UseSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('Labres API')
    .setDescription('This is the Official Labres Api')
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
  SwaggerModule.setup(SWAGGER_ENDPOINT, app, documentFactory, {
    jsonDocumentUrl: `${SWAGGER_ENDPOINT}/json`,
  });
}