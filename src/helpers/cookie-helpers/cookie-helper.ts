import { Response } from "express";

export type AuthenticationTokens = {
    token: string;
    refreshToken: string;
}

export class CookieHelpers {
    static SetTokens(response: Response, tokens: AuthenticationTokens){
        const { token, refreshToken } = tokens;
        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/api/v1/auth/refresh'
        });

        response.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
        });
    }

    static RemoveTokens(response: Response){
        response.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            path: '/', 
        });
        response.clearCookie('token', {
            httpOnly: true,
            secure: true,
            path: '/',
        });
    }
}