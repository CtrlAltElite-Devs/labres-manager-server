import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckPidDto } from './dto/check-pid.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ACCESS_TOKEN } from 'src/configurations/bootstrap-configuration';
import { AuthenticatedRequest } from 'src/guards/application-requests';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() request: LoginDto) {
    const response = await this.authService.Login(request);
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
