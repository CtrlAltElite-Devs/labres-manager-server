import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { LicenseService } from './license.service';
import { VerifyLicenseDto } from './dto/verify-license.dto';
import { AuthenticatedMachineRequest, machineHeaderOptions } from 'src/guards/license/machine-request';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { MachineGuard } from 'src/guards/license/machine.guard';
import { ApiHeader } from '@nestjs/swagger';

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

}
