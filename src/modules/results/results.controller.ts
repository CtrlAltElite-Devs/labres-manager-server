import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader } from '@nestjs/swagger';
import { CreateResultDto } from './dto/create-result.dto';
import { ResultsService } from './results.service';
import { ACCESS_TOKEN } from 'src/configurations/bootstrap-configuration';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { MachineGuard } from 'src/guards/license/machine.guard';
import { AuthenticatedMachineRequest, machineHeaderOptions } from 'src/guards/license/machine-request';
import { AuthenticatedRequest } from 'src/guards/application/application-requests';
import { AuthGuard } from 'src/guards/application/auth.guard';
import { UserOnly } from 'src/guards/application/application-guard.decorators';
import { UseFeatureFlag } from 'src/guards/feature/feature-flag.decorator';

@Controller('test-result')
export class ResultsController {
  constructor(private readonly resultService: ResultsService) {}

  @Get("license-protected")
  @UseGuards(MachineGuard)
  @ApiHeader(machineHeaderOptions)
  resultProtected(@Req() request: AuthenticatedMachineRequest){
    return request.license;
  }

  @Get("machine")
  @UseGuards(MachineGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3)
  @ApiHeader(machineHeaderOptions)
  async getForMachine(@Req() request: AuthenticatedMachineRequest){
    const response = await this.resultService.GetTestResultsForMachine(request.license!.fingerPrint);
    return response;
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(MachineGuard)
  @ApiHeader(machineHeaderOptions)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateResultDto })
  async uploadFiles(@UploadedFile() file: Express.Multer.File, @Req() request: AuthenticatedMachineRequest) {
    const response = await this.resultService.UploadTestResults(file, request.license!);
    return response;
  }

  @Get()
  @ApiBearerAuth(ACCESS_TOKEN)
  @UseGuards(AuthGuard)
  async getTestResults(@Req() request: AuthenticatedRequest) {
    const response = await this.resultService.GetTestResults(request.user, request.admin);
    return response;
  }

  @Get('/:id')
  @ApiBearerAuth(ACCESS_TOKEN)
  @UserOnly()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(5)
  async getTestResultById(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    const { user } = request;
    const response = await this.resultService.GetTestResultById(id, user!);
    return response;
  }

  @Delete("/delete-all")
  @ApiBearerAuth(ACCESS_TOKEN)
  @UserOnly()
  @UseFeatureFlag("delete-all")
  async deleteAllRecords(@Req() request: AuthenticatedRequest){
    const { user } = request;
    const response = await this.resultService.DeleteRecordsForUser(user!);
    return response;
  }


}
