import { User } from "src/entities/user.entity";

export class LoginResponseDto {
    user: User;
    token: string;
}