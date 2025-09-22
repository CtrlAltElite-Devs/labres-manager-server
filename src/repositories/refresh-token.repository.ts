import { EntityRepository } from "@mikro-orm/core";
import { RefreshToken } from "src/entities/security/refresh-token.entity";
import { RequestMetadata } from "src/security/common/metadata-request";

export class RefreshTokenRepository extends EntityRepository<RefreshToken>{
    async CreateOrUpdate(token: RefreshToken){
        return await this.upsert(token, {
            onConflictFields: ["userId", "browserName", "ipAddress", "os"],
            onConflictAction: "merge",
            onConflictExcludeFields: ["id", "createdAt"],
        });
    }

    async FindUsingMetadata(userId: string, metaData: RequestMetadata){
        return await this.findOne({
            userId,
            ipAddress: metaData.ipAddress,
            browserName: metaData.browserName,
            os: metaData.os,
        });
    }
}