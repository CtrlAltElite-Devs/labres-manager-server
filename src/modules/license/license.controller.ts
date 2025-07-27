import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { LicenseService } from './license.service';
import { VerifyLicenseDto } from './dto/verify-license.dto';
import { AuthenticatedMachineRequest, machineHeaderOptions } from 'src/guards/license/machine-request';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { MachineGuard } from 'src/guards/license/machine.guard';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { ACCESS_TOKEN } from 'src/configurations/bootstrap-configuration';
import { SuperAdminOnly } from 'src/guards/application/application-guard.decorators';
import { CreateLicenseDto } from './dto/create-license.dto';

@Controller('license')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  //todo add throttling
  @Post("verify")
  async verifyLicense(@Body() request: VerifyLicenseDto){
    const response = await this.licenseService.Verify(request);
    return response;
  }

  @Get()
  @ApiHeader(machineHeaderOptions)
  @UseInterceptors(CacheInterceptor)
  @UseGuards(MachineGuard)
  getLicense(@Req() request: AuthenticatedMachineRequest){
    return request.license
  }

  @Post("create")
  @ApiBearerAuth(ACCESS_TOKEN)
  @SuperAdminOnly()
  async createLicense(@Body() request: CreateLicenseDto){
    const response = await this.licenseService.AddLicense(request);
    return response;
  }

  @Patch("revoke/:licenseId")
  @ApiBearerAuth(ACCESS_TOKEN)
  @SuperAdminOnly()
  async revoke(@Param("licenseId") licenseId: string){
    const response = await this.licenseService.RevokeLicense(licenseId);
    return response;
  }

  @Patch("activate/:licenseId")
  @ApiBearerAuth(ACCESS_TOKEN)
  @SuperAdminOnly()
  async activate(@Param("licenseId") licenseId: string){
    const response = await this.licenseService.ReactivateLicense(licenseId);
    return response;
  }

  @Get("all")
  @ApiBearerAuth(ACCESS_TOKEN)
  @SuperAdminOnly()
  async getAllLicenses(){
    const response = await this.licenseService.GetAllLicenses();
    return response;
  }

}
