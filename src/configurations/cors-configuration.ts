import { INestApplication } from "@nestjs/common";

export default function ApplyCorsConfigurations(app: INestApplication<any>){
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