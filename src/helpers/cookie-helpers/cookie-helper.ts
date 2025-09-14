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
            secure: IS_PROD_OR_STAGING,
            sameSite: IS_PROD_OR_STAGING ? 'none' : 'lax',
            path: '/api/v1/auth/refresh',
            domain: '.ctr3.org'
        });

        response.cookie('token', token, {
            httpOnly: true,
            secure: IS_PROD_OR_STAGING,
            sameSite: IS_PROD_OR_STAGING ? 'none' : 'lax',
            domain: '.ctr3.org'
        });
    }

    static RemoveTokens(response: Response) {
        try {
            response.clearCookie('refreshToken', {
                path: '/api/v1/auth/refresh',
                secure: IS_PROD_OR_STAGING,
                sameSite: IS_PROD_OR_STAGING ? 'none' : 'lax',
                domain: '.ctr3.org'
            });
    
            response.clearCookie('token', {
                path: '/',
                secure: IS_PROD_OR_STAGING,
                sameSite: IS_PROD_OR_STAGING ? 'none' : 'lax',
                domain: '.ctr3.org'
            });
        } catch (error) {
            console.error("Clear cookie error: ", error);
        }
    }
}
