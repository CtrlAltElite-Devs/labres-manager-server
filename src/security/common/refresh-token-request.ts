import { Request } from "express";
import { EnrichedRequest } from "src/interceptors/interceptors.common";

export interface RefreshTokenRequest extends Request {
    refreshToken: string;
}

export interface EnrichedRefreshTokenRequest extends RefreshTokenRequest, EnrichedRequest{}