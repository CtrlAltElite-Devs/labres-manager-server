import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateResultDto } from './dto/create-result.dto';
import { ResultsService } from './results.service';

@Controller('test-result')
export class ResultsController {
  
  constructor(
    private readonly resultService: ResultsService 
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateResultDto })
  async uploadFiles(@UploadedFile() file: Express.Multer.File) {
    const response = await this.resultService.UploadTestResults(file);
    return response;
  }

  @Get()
  getTestResults(){
    return "results";
  }

  @Get("/:id")
  getTestResultById(@Param("id") id: string){
    return id;
  }
}
