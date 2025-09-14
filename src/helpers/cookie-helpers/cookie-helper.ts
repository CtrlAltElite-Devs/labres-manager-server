import { Response } from "express";
import { IS_PROD_OR_STAGING, IS_STRICTLY_DEV } from "src/utils/environment";
import { ApiVersion } from "src/utils/types";

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
            sameSite: getSameSiteStrategy(),
            path: getRefreshPath(),
            domain: getDomainStrategy()
        });

        response.cookie('token', token, {
            httpOnly: true,
            secure: IS_PROD_OR_STAGING,
            sameSite: getSameSiteStrategy(),
            domain: getDomainStrategy()
        });
    }

    static RemoveTokens(response: Response) {
        try {
            response.clearCookie('refreshToken', {
                path: getRefreshPath(),
                secure: IS_PROD_OR_STAGING,
                sameSite: getSameSiteStrategy(),
                domain: getDomainStrategy()
            });
    
            response.clearCookie('token', {
                path: '/',
                secure: IS_PROD_OR_STAGING,
                sameSite: IS_PROD_OR_STAGING ? 'none' : 'lax',
                domain: getDomainStrategy()
            });
        } catch (error) {
            console.error("Clear cookie error: ", error);
        }
    }
}

function getRefreshPath() : string {
    const VERSION : ApiVersion = "v1";
    return `/api/${VERSION}/auth/refresh`
}

function getDomainStrategy() : string | undefined{
    return IS_STRICTLY_DEV ? undefined : ".ctr3.org";
}

function getSameSiteStrategy() : boolean | "lax" | "none" | "strict" | undefined {
    return IS_PROD_OR_STAGING ? 'none' : 'lax';
}