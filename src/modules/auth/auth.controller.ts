import { Body, Controller, Get, Post, Put, Query, Req, Res, UseGuards, UseInterceptors, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckPidDto } from './dto/check-pid.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { AuthenticatedRequest } from 'src/guards/application/application-requests';
import { AuthGuard } from 'src/guards/application/auth.guard';
import { ACCESS_TOKEN } from 'src/configurations/common-configuration';
import { Request, Response } from 'express';
import { RefreshTokenGuard } from 'src/guards/cookies/refresh-token-guard';
import { RefreshTokenRequest } from 'src/guards/cookies/refresh-token-request';
import { MetaDataInterceptor } from 'src/interceptors/metadata-interceptor';
import { EnrichedRequest } from 'src/interceptors/interceptors.common';
import { RefreshTokenDto } from './dto/refresh-token/refresh-token.dto';
// import { UAParser } from 'ua-parser-js';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() request: LoginDto) {
    const response = await this.authService.Login(request);
    return response;
  }

  @Post("login")
  @UseInterceptors(MetaDataInterceptor)
  @Version("2")
  async loginV2(
    @Body() body: LoginDto, 
    @Res({passthrough: true}) response: Response,
    @Query('useCookie') useCookie: boolean,
    @Req() request: EnrichedRequest
  ){
    const authResponse = await this.authService.LoginV2(body, request.metaData!);
    if(useCookie){
      response.cookie('refreshToken', authResponse.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/api/v1/auth/refresh'
      });

      response.cookie('token', authResponse.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });

      authResponse.refreshToken = "";
      authResponse.token = "";
    }
    return authResponse;
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(5)
  @ApiBearerAuth(ACCESS_TOKEN)
  me(@Req() request: AuthenticatedRequest) {
    return request.user
  }

  @Post("refresh")
  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(MetaDataInterceptor)
  async refresh(
    @Body() body : RefreshTokenDto,
    @Req() request: RefreshTokenRequest & EnrichedRequest,
    @Query('useCookie') useCookie: boolean,
    @Res({passthrough: true}) response: Response,
  ){
    const refreshTokenResponse = await this.authService.Refresh(request.refreshToken, request.metaData!);

    if(useCookie){
      response.cookie('refreshToken', refreshTokenResponse.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/api/v1/auth/refresh'
      });

      response.cookie('token', refreshTokenResponse.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
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
    const response = await this.authService.UpdatePassword(request);
    return response;
  }

  @Get("metadata")
  @UseInterceptors(MetaDataInterceptor)
  metadata(@Req() req: EnrichedRequest){
    return req.metaData;
  }
}
