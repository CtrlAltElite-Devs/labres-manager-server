import { Body, Controller, Get, Post, Put, Query, Req, Res, UseFilters, UseInterceptors, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckPidDto } from './dto/check-pid.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { AuthenticatedRequest } from 'src/security/common/application-requests';
import { Response } from 'express';
import { RefreshTokenInterceptor } from 'src/security/interceptors/refresh-token.interceptor';
import { EnrichedRefreshTokenRequest } from 'src/security/common/refresh-token-request';
import { EnrichedRequest } from 'src/security/common/metadata-request';
import { RefreshTokenDto } from './dto/refresh-token/refresh-token.dto';
import { UseAuthenticationGuard, UseUserOnlyGuard } from 'src/security/decorators/index.decorators';
import { CookieHelpers } from 'src/helpers/cookie-helpers/cookie-helper';
import { MetaDataInterceptor } from 'src/security/interceptors/metadata-interceptor';
import { RefreshTokenExceptionFilter } from 'src/security/filters/refresh-token-exception.filter';
import { IdentifyRequestDto } from './dto/identify/identify.request.dto';
import { VerifyEmailDto } from './dto/verify-email/verify-email.dto';
import { SendVerificationEmailDto } from './dto/verify-email/send-verification-email.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}
    
    @Post("login")
    async login(@Body() request: LoginDto) {
        const response = await this.authService.Login(request);
        return response;
    }
    
    @Post("login")
    @UseInterceptors(MetaDataInterceptor)
    @Version("2")
    async loginV2(
        @Query('useCookie') useCookie: boolean,
        @Body() body: LoginDto, 
        @Req() request: EnrichedRequest,
        @Res({passthrough: true}) response: Response,
    ){
        const authResponse = await this.authService.LoginV2(body, request.metaData!);
        if(useCookie){
            CookieHelpers.SetTokens(response, {
                token: authResponse.token,
                refreshToken: authResponse.refreshToken
            });
            authResponse.refreshToken = "";
            authResponse.token = "";
        }
        return authResponse;
    }
    
    @Post("log-out")
    @UseAuthenticationGuard()
    async logOut(@Req() request: AuthenticatedRequest, @Res({passthrough: true}) response : Response){
        const { user } = request;
        const userId = user!.pid;
        await this.authService.LogOut(userId)
        CookieHelpers.RemoveTokens(response);
        return { message: "Logged out Succesfully"}
    }
    
    @Get('me')
    @UseUserOnlyGuard()
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(5)
    me(@Req() request: AuthenticatedRequest) {
        return request.user
    }
    
    @Post("refresh")
    @UseInterceptors(RefreshTokenInterceptor)
    @UseInterceptors(MetaDataInterceptor)
    @UseFilters(RefreshTokenExceptionFilter)
    async refresh(
        @Body() body : RefreshTokenDto, // used for swagger doc
        @Req() request: EnrichedRefreshTokenRequest,
        @Query('useCookie') useCookie: boolean,
        @Res({passthrough: true}) response: Response,
    ){
        const refreshTokenResponse = await this.authService.Refresh(request.refreshToken, request.metaData!);
        
        if(useCookie){
            CookieHelpers.SetTokens(response, {
                token: refreshTokenResponse.token,
                refreshToken: refreshTokenResponse.refreshToken
            });
            refreshTokenResponse.refreshToken = "";
            refreshTokenResponse.token = "";
        }
        
        return refreshTokenResponse
    }
    
    @Post('check-pid')
    async checkPid(@Body() request: CheckPidDto) {
        const { pid } = request;
        const response = await this.authService.CheckPid(pid);
        return response;
    }
    
    @Put('update-user')
    async updateUser(@Body() request: UpdatePasswordDto) {
        // todo add security measures
        const response = await this.authService.UpdatePassword(request);
        return response;
    }

    @Post("identify/step1")
    async identifyStep1(@Body() request: CheckPidDto) {
        const response = await this.authService.IdentifyStep1(request.pid);
        return response;
    }

    @Post("identify/step2")
    async identifyStep2(@Body() request: IdentifyRequestDto) {
        const response = await this.authService.IdentifyStep2(request);
        return response;
    }

    @Post("send-verification-email")
    async setVerificationEmail(@Body() request: SendVerificationEmailDto){
        return await this.authService.SendVerificationEmail(request);
    }

    @Post("verify-email")
    async verifyEmail(@Body() request: VerifyEmailDto) {
        return await this.authService.VerifyEmail(request);
    }

    @Put("set-password")
    async setPassword(@Body() request: UpdatePasswordDto){
        return await this.authService.UpdatePasswordV2(request);
    }

}
