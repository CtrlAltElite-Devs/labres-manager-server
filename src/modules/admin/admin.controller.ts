import { Body, Controller, Get, Patch, Post, Query, Req, Res, UseFilters, UseInterceptors } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from 'src/modules/admin/dto/admin-login.dto';
import { AdminRegisterDto } from 'src/modules/admin/dto/admin-register.dto';
import { UseAdminOnlyGuard, UseSuperAdminOnlyGuard } from 'src/security/decorators/index.decorators';
import { AdminUpdatePasswordDto } from './dto/admin-update-password.dto';
import { AuthenticatedRequest } from 'src/security/common/application-requests';
import { MetaDataInterceptor } from 'src/security/interceptors/metadata-interceptor';
import { EnrichedRequest } from 'src/security/common/metadata-request';
import { Response } from 'express';
import { CookieHelpers } from 'src/helpers/cookie-helpers/cookie-helper';
import { RefreshTokenInterceptor } from 'src/security/interceptors/refresh-token.interceptor';
import { RefreshTokenExceptionFilter } from 'src/security/filters/refresh-token-exception.filter';
import { EnrichedRefreshTokenRequest } from 'src/security/common/refresh-token-request';
import { RefreshTokenDto } from '../auth/dto/refresh-token/refresh-token.dto';

@Controller('auth/admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}
    
    @Post("login")
    @UseInterceptors(MetaDataInterceptor)
    async adminLogin(
        @Query("useCookie") useCookie: boolean,
        @Body() body : AdminLoginDto,
        @Req() request: EnrichedRequest,
        @Res({passthrough: true}) response: Response
    ){
        const adminLoginResponse = await this.adminService.AdminLogin(body, request.metaData!);
        if(useCookie){
            CookieHelpers.SetTokens(response, {
                token: adminLoginResponse.token,
                refreshToken: adminLoginResponse.refreshToken
            }, { isAdmin: true });
            adminLoginResponse.refreshToken = "";
            adminLoginResponse.token = "";
        }
        
        return adminLoginResponse;
    }
    
    @Post("log-out")
    @UseAdminOnlyGuard()
    async AdminLogOut(@Req() request: AuthenticatedRequest, @Res({passthrough: true}) response: Response){
        const { admin }  = request;
        const adminId = admin!.id;
        await this.adminService.AdminLogOut(adminId);
        CookieHelpers.RemoveTokens(response, { isAdmin: true });
        return { message: "Admin Logged out Succesfully"}
    }
    
    @Post("refresh")
    @UseInterceptors(RefreshTokenInterceptor)
    @UseInterceptors(MetaDataInterceptor)
    @UseFilters(RefreshTokenExceptionFilter)
    async adminRefresh(
        @Body() body : RefreshTokenDto, // used for swagger doc
        @Req() request: EnrichedRefreshTokenRequest,
        @Query('useCookie') useCookie: boolean,
        @Res({passthrough: true}) response: Response,
    ){
        const refreshTokenResponse = await this.adminService.Refresh(request.refreshToken, request.metaData!);
        
        if(useCookie){
            CookieHelpers.SetTokens(response, {
                token: refreshTokenResponse.token,
                refreshToken: refreshTokenResponse.refreshToken
            }, {isAdmin: true});
            refreshTokenResponse.refreshToken = "";
            refreshTokenResponse.token = "";
        }
        
        return refreshTokenResponse
    }
    
    @Post('register')
    @UseSuperAdminOnlyGuard()
    async adminRegister(@Body() request: AdminRegisterDto) {
        const response = await this.adminService.AdminRegister(request);
        return response;
    }
    
    @Patch('update-password')
    @UseSuperAdminOnlyGuard()
    async updateAdminPassword(@Req() request: AuthenticatedRequest,@Body() body: AdminUpdatePasswordDto){
        await this.adminService.UpdateAdminPassword(request.admin!.id, body);
    }
    
    @Get('me')
    @UseAdminOnlyGuard()
    me(@Req() request: AuthenticatedRequest){
        return request.admin;
    }
}
