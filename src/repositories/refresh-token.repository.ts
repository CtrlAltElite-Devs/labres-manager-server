import { EntityRepository } from "@mikro-orm/core";
import { RefreshToken } from "src/entities/security/refresh-token.entity";

export class RefreshTokenRepository extends EntityRepository<RefreshToken>{
    
}