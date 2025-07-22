import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ACCESS_TOKEN } from 'src/configurations/bootstrap-configuration';
import { AdminLoginDto } from 'src/modules/admin/dto/admin-login.dto';
import { AdminRegisterDto } from 'src/modules/admin/dto/admin-register.dto';
import { AdminOnly, SuperAdminOnly } from 'src/guards/application/application-guard.decorators';

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
  @SuperAdminOnly()
  async adminRegister(@Body() request: AdminRegisterDto) {
    const response = await this.adminService.AdminRegister(request);
    return response;
  }

  @Get("protected")
  @ApiBearerAuth(ACCESS_TOKEN)
  @AdminOnly()
  protected(){
    return "hello from protected"
  }

}
