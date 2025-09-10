import { Response } from "express";
import { IS_DEV_OR_STAGING } from "src/utils/environment";

export type AuthenticationTokens = {
    token: string;
    refreshToken: string;
}

export class CookieHelpers {
    static SetTokens(response: Response, tokens: AuthenticationTokens) {
        const { token, refreshToken } = tokens;

        const isProd = !IS_DEV_OR_STAGING;

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProd,                 // required for SameSite=None
            sameSite: isProd ? 'none' : 'lax',
            path: '/api/v1/auth/refresh',
        });

        response.cookie('token', token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
        });
    }

    static RemoveTokens(response: Response) {
        const isProd = !IS_DEV_OR_STAGING;

        response.clearCookie('refreshToken', {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            path: '/api/v1/auth/refresh',
        });

        response.clearCookie('token', {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            path: '/',
        });
    }
}
