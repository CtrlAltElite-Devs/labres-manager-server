import { INestApplication, VersioningType } from "@nestjs/common";

export default function ApplyApiVersioning(app: INestApplication<any>){
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1'
    });
}