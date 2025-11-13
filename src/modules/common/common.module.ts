import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { RefreshToken } from "src/entities/security/refresh-token.entity";
import { CustomJwtService } from "./custom-jwt-service";
import { RefreshTokenService } from "./refresh-token-service";
import { UnitOfWork } from "./unit-of-work";
import { CacheService } from "./cache-service";
import { OTP } from "src/entities/security/otp.entity";
import { EmailService } from "./email-service";


@Module({
    imports: [MikroOrmModule.forFeature([RefreshToken, OTP])],
    providers: [CustomJwtService, RefreshTokenService, UnitOfWork, CacheService, EmailService],
    exports: [CustomJwtService, RefreshTokenService, UnitOfWork, CacheService, EmailService]
})
export class CommonModule{}