import { Body, Controller, Patch, Post, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminLoginDto } from 'src/modules/admin/dto/admin-login.dto';
import { AdminRegisterDto } from 'src/modules/admin/dto/admin-register.dto';
import { SuperAdminOnly } from 'src/guards/application/application-guard.decorators';
import { ACCESS_TOKEN } from 'src/configurations/common-configuration';
import { AdminUpdatePasswordDto } from './dto/admin-update-password.dto';
import { AuthenticatedRequest } from 'src/guards/application/application-requests';

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

  @Patch('update-password')
  @ApiBearerAuth(ACCESS_TOKEN)
  @SuperAdminOnly()
  async updateAdminPassword(@Req() request: AuthenticatedRequest,@Body() body: AdminUpdatePasswordDto){
    await this.adminService.UpdateAdminPassword(request.admin!.id, body);
  }
}
