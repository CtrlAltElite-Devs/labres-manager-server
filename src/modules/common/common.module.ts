import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { RefreshToken } from "src/entities/security/refresh-token.entity";
import { CustomJwtService } from "./custom-jwt-service";
import { RefreshTokenService } from "./refresh-token-service";
import { UnitOfWork } from "./unit-of-work";


@Module({
    imports: [MikroOrmModule.forFeature([RefreshToken])],
    providers: [CustomJwtService, RefreshTokenService, UnitOfWork],
    exports: [CustomJwtService, RefreshTokenService, UnitOfWork]
})
export class CommonModule{}