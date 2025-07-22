import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateResultDto } from './dto/create-result.dto';
import { ResultsService } from './results.service';
import { ACCESS_TOKEN } from 'src/bootstrap-configuration';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthenticatedRequest } from 'src/guards/application-requests';

@Controller('test-result')
@ApiBearerAuth(ACCESS_TOKEN)
export class ResultsController {
  constructor(private readonly resultService: ResultsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateResultDto })
  async uploadFiles(@UploadedFile() file: Express.Multer.File) {
    const response = await this.resultService.UploadTestResults(file);
    return response;
  }

  @Get()
  @UseGuards(AuthGuard)
  async getTestResults(@Req() request: AuthenticatedRequest) {
    const response = await this.resultService.GetTestResults(request.user);
    return response;
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getTestResultById(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
  ) {
    const { user } = request;
    const response = await this.resultService.GetTestResultById(id, user!);
    return response;
  }
}
