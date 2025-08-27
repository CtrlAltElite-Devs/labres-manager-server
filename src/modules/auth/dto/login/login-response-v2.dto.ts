import { User } from "src/entities/user.entity";

export class LoginResponseV2Dto {
    token: string;
    refreshToken: string;
    user: UserDtoV2

    static Map(user: User, token: string, refreshToken: string) : LoginResponseV2Dto{
        return {
            token,
            refreshToken,
            user: {
                pid: user.pid,
                dob: user.dob,
                createdAt: user.createdAt
            }
        }
    }
}

export class UserDtoV2 {
    pid: string;
    dob?: Date;
    createdAt: Date;
}