import { INestApplication, ValidationPipe } from '@nestjs/common';

export default function ApplyConfigurations(app: INestApplication<any>){
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
}






