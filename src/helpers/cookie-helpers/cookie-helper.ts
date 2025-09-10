import { Response } from "express";
import { IS_PROD_OR_STAGING } from "src/utils/environment";

export type AuthenticationTokens = {
    token: string;
    refreshToken: string;
}

export class CookieHelpers {
    static SetTokens(response: Response, tokens: AuthenticationTokens) {
        const { token, refreshToken } = tokens;

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: IS_PROD_OR_STAGING,                 // required for SameSite=None
            sameSite: IS_PROD_OR_STAGING ? 'none' : 'lax',
            path: '/api/v1/auth/refresh',
        });

        response.cookie('token', token, {
            httpOnly: true,
            secure: IS_PROD_OR_STAGING,
            sameSite: IS_PROD_OR_STAGING ? 'none' : 'lax',
        });
    }

    static RemoveTokens(response: Response) {
        response.clearCookie('refreshToken', {
            httpOnly: true,
            secure: IS_PROD_OR_STAGING,
            sameSite: IS_PROD_OR_STAGING ? 'none' : 'lax',
            path: '/api/v1/auth/refresh',
        });

        response.clearCookie('token', {
            httpOnly: true,
            secure: IS_PROD_OR_STAGING,
            sameSite: IS_PROD_OR_STAGING ? 'none' : 'lax',
            path: '/',
        });
    }
}
