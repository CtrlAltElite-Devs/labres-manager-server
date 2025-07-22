/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import jwt,{ JwtPayload, SignOptions } from "jsonwebtoken"
import "dotenv/config";

export function provideToken(payload: JwtPayload): string {
    const expiration = process.env.JWT_EXPIRATION!;
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET!,
        {expiresIn: expiration || "1d"} as SignOptions
    )

    return token;
}

