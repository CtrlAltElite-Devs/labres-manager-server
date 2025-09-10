import { Request } from "express";
import { EnrichedRequest } from "src/security/common/metadata-request";

export interface RefreshTokenRequest extends Request {
    refreshToken: string;
}

export interface EnrichedRefreshTokenRequest extends RefreshTokenRequest, EnrichedRequest{}