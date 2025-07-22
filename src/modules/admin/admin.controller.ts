import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ACCESS_TOKEN } from 'src/configurations/bootstrap-configuration';
import { AdminLoginDto } from 'src/modules/admin/dto/admin-login.dto';
import { AdminRegisterDto } from 'src/modules/admin/dto/admin-register.dto';
import { AdminGuard } from 'src/guards/application/admin.guard';
import { AuthGuard } from 'src/guards/application/auth.guard';
import { SuperAdminGuard } from 'src/guards/application/super-admin.guard';

@Controller('auth/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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

  // sample protected endpoint
  @Get("protected")
  @ApiBearerAuth(ACCESS_TOKEN)
  @UseGuards(AuthGuard, AdminGuard)
  protected(){
    return "hello from protected"
  }

}
