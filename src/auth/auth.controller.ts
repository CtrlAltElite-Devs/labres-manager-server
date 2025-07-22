import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckPidDto } from './dto/check-pid.dto';
import { LoginDto } from './dto/login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ACCESS_TOKEN } from 'src/bootstrap-configuration';
import { AuthenticatedRequest } from 'src/guards/application-requests';
import { AdminGuard } from 'src/guards/admin.guard';
import { SuperAdminGuard } from 'src/guards/super-admin.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() request: LoginDto) {
    const response = await this.authService.Login(request);
    return response;
  }

  @Get("protected-admin")
  @ApiBearerAuth(ACCESS_TOKEN)
  @UseGuards(AuthGuard, AdminGuard)
  protected(){
    return "hello from protected"
  }

  @Post('admin/login')
  async adminLogin(@Body() request: AdminLoginDto) {
    const response = await this.authService.AdminLogin(request);
    return response;
  }

  @Post('admin/register')
  @ApiBearerAuth(ACCESS_TOKEN)
  @UseGuards(AuthGuard, AdminGuard, SuperAdminGuard)
  async adminRegister(@Body() request: AdminRegisterDto) {
    const response = await this.authService.AdminRegister(request);
    return response;
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth(ACCESS_TOKEN)
  me(@Req() request: AuthenticatedRequest) {
    return request.user
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
}
