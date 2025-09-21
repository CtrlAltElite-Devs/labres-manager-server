import { Controller, Delete, Get, Param, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateResultDto } from './dto/create-result.dto';
import { ResultsService } from './results.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { AuthenticatedMachineRequest } from 'src/security/common/machine-request';
import { AuthenticatedRequest } from 'src/security/common/application-requests';
import { UseAuthenticationGuard, UseMachineGuard, UseUserOnlyGuard } from 'src/security/decorators/index.decorators';
import { UseFeatureFlag } from 'src/security/decorators/feature-flag.decorator';

@Controller('test-result')
export class ResultsController {
  constructor(private readonly resultService: ResultsService) {}

  @Get("license-protected")
  @UseMachineGuard()
  resultProtected(@Req() request: AuthenticatedMachineRequest){
    return request.license;
  }

  @Get("machine")
  @UseMachineGuard()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3)
  async getForMachine(@Req() request: AuthenticatedMachineRequest){
    const response = await this.resultService.GetTestResultsForMachine(request.license!.fingerPrint);
    return response;
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseMachineGuard()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateResultDto })
  async uploadFiles(@UploadedFile() file: Express.Multer.File, @Req() request: AuthenticatedMachineRequest) {
    const response = await this.resultService.UploadTestResults(file, request.license!);
    return response;
  }

  @Get()
  @UseAuthenticationGuard()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(2000)
  async getTestResults(@Req() request: AuthenticatedRequest) {
    const response = await this.resultService.GetTestResults(request.user, request.admin);
    return response;
  }

  @Get('/:id')
  @UseUserOnlyGuard()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(5000)
  async getTestResultById(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    const { user } = request;
    const response = await this.resultService.GetTestResultById(id, user!.pid);
    return response;
  }

  @Delete("/delete-all")
  @UseUserOnlyGuard()
  @UseFeatureFlag("delete-all")
  async deleteAllRecords(@Req() request: AuthenticatedRequest){
    const { user } = request;
    const response = await this.resultService.DeleteRecordsForUser(user!.pid);
    return response;
  }
}
