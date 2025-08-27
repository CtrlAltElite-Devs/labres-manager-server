import { Request } from "express";

export interface RefreshTokenRequest extends Request {
    refreshToken: string;
}