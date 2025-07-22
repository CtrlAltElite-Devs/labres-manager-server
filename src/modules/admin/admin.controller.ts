import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ACCESS_TOKEN } from 'src/configurations/bootstrap-configuration';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminLoginDto } from 'src/modules/admin/dto/admin-login.dto';
import { AdminRegisterDto } from 'src/modules/admin/dto/admin-register.dto';
import { SuperAdminGuard } from 'src/guards/super-admin.guard';

@Controller('auth/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("protected")
  @ApiBearerAuth(ACCESS_TOKEN)
  @UseGuards(AuthGuard, AdminGuard)
  protected(){
    return "hello from protected"
  }

  @Post('login')
  async adminLogin(@Body() request: AdminLoginDto) {
    const response = await this.adminService.AdminLogin(request);
    return response;
  }
    
  @Post('register')
  @ApiBearerAuth(ACCESS_TOKEN)
  @UseGuards(AuthGuard, AdminGuard, SuperAdminGuard)
  async adminRegister(@Body() request: AdminRegisterDto) {
    const response = await this.adminService.AdminRegister(request);
    return response;
  }
}
