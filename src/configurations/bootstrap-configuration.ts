import { INestApplication, ValidationPipe } from '@nestjs/common';

export const ACCESS_TOKEN = "accesstoken";



export function ApplyConfigurations(app: INestApplication<any>){
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
}

export function ApplyCorsConfigurations(app: INestApplication<any>){
  const isDevOrStaging = process.env.APP_ENV === "staging" || process.env.NODE_ENV === "development";
  console.log("isDevelopmentOrStaging: ", isDevOrStaging);
  const corsOrigins = !isDevOrStaging
    ? ['https://your-production-frontend.com']
    : true

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });
}




