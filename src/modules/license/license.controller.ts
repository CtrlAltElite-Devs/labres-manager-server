import { Body, Controller, Get, Param, Patch, Post, Req, UseInterceptors } from '@nestjs/common';
import { LicenseService } from './license.service';
import { VerifyLicenseDto } from './dto/verify-license.dto';
import { AuthenticatedMachineRequest } from 'src/security/common/machine-request';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { UseMachineGuard, UseSuperAdminOnlyGuard } from 'src/security/decorators/index.decorators';
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
  @UseMachineGuard()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(5)
  getLicense(@Req() request: AuthenticatedMachineRequest){
    return request.license
  }

  @Post("create")
  @UseSuperAdminOnlyGuard()
  async createLicense(@Body() request: CreateLicenseDto){
    const response = await this.licenseService.AddLicense(request);
    return response;
  }

  @Patch("revoke/:licenseId")
  @UseSuperAdminOnlyGuard()
  async revoke(@Param("licenseId") licenseId: string){
    const response = await this.licenseService.RevokeLicense(licenseId);
    return response;
  }

  @Patch("activate/:licenseId")
  @UseSuperAdminOnlyGuard()
  async activate(@Param("licenseId") licenseId: string){
    const response = await this.licenseService.ReactivateLicense(licenseId);
    return response;
  }

  @Get("all")
  @UseSuperAdminOnlyGuard()
  async getAllLicenses(){
    const response = await this.licenseService.GetAllLicenses();
    return response;
  }

}
