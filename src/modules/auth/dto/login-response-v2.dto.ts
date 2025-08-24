export class LoginResponseV2Dto {
    token: string;
    user: UserDtoV2
}

export class UserDtoV2 {
    pid: string;
    dob?: Date;
    createdAt: Date;
}