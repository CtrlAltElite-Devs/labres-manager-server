import { Admin } from "src/entities/admin.entity";
import { AdminDto } from "./admin.dto";

export class AdminLoginResponseDto {
    admin: AdminDto;
    token: string;
    refreshToken: string;

    static Map(adminPayload: Admin, token: string, refreshToken: string): AdminLoginResponseDto{
        return {
            admin: {
                id: adminPayload.id,
                email : adminPayload.email,
                role: adminPayload.role
            },
            token: token,
            refreshToken: refreshToken
        }
    }
}