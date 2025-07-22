/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TestResult } from 'src/entities/test-result.entity';
import { User } from 'src/entities/user.entity';
import { CreateResultResponseDto } from './dto/create-result-response.dto';
import { Admin } from 'src/entities/admin.entity';
import { TestResultDto, TestResultMinimalDto } from './dto/test-result-dto';

@Injectable()
export class ResultsService {
  private readonly logger = new Logger(ResultsService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,

    @InjectRepository(TestResult)
    private readonly testResultRepository: EntityRepository<TestResult>,
  ) {}

  async UploadTestResults(file: Express.Multer.File) {
    const fileType = file.mimetype;

    if (fileType !== 'application/pdf') {
      throw new BadRequestException('File type must be application/pdf');
    }

    const size = file.size;
    const fileName = file.originalname;

    const parts: string[] = fileName.split('_');

    if (parts.length < 3) {
      throw new BadRequestException(
        'Invalid File format. Expected format: PID_nameOfTest_testDate.pdf',
      );
    }

    const pid = parts[0]; // "12345"
    let testDateStr = parts[parts.length - 1]; // "2024-03-30"
    if (testDateStr.endsWith('.pdf')) {
      testDateStr = testDateStr.replace('.pdf', '');
    }
    
    // Convert testDateStr to a Date object
    const testDate = new Date(testDateStr);
    if (isNaN(testDate.getTime())) {
      throw new BadRequestException(
        `Invalid test date ${testDate.getTime()}, Exptected YYYY-MM-DD`,
      );
    }

    const testName = parts.slice(1, -1).join(' '); // "BloodTest" or multi-word test names

    // check if pid exists
    const existingUser = await this.userRepository.findOne({ pid: pid });

    //if user does not exist
    let createdUser: User | null = null;
    if (existingUser === null) {
      this.logger.log(`No Existing user, will create user for pid:${pid}`);
      createdUser = new User();
      createdUser.pid = pid;
      await this.userRepository.insert(createdUser);
    } else {
      this.logger.log(`existing user found`);
    }


    const testResult = new TestResult();
    testResult.user = createdUser ? createdUser : existingUser!;
    testResult.testName = testName;
    testResult.testDate = testDate;
    testResult.size = size;
    testResult.binaryPdf = file.buffer;

    await this.testResultRepository.insert(testResult);

    return CreateResultResponseDto.Map(testResult);
  }

  async GetTestResults(user?: User, admin?: Admin) {
    let results: any[];
    if (admin) {
      console.log("entered as admin")
      results = await this.testResultRepository.findAll({
        fields: ['id', 'user', 'testName', 'size', 'testDate'], // applying projection
      });
    } else if (user) {
      console.log("entered as user")
      results = await this.testResultRepository.find(
        { user: { pid: user.pid } },
        {
          fields: ['id', 'user', 'testName', 'size', 'testDate'], // applying projection
        },
      );
    } else {
      throw new BadRequestException(
        'User or Admin must be provided to get test results',
      );
    }

    const testResults = results.map((result) => {
      const dto = new TestResultMinimalDto();
      dto.id = result.id;
      dto.testName = result.testName;
      dto.size = result.size;
      dto.testDate = result.testDate;
      dto.userPid = result.user.pid;
      return dto;
    });

    return testResults;
  }

  async GetTestResultById(id: string, user: User){
    const testResult = await this.testResultRepository.findOne({id: id})

    if(testResult === null){
      throw new NotFoundException("Result not found");
    }

    if(testResult.user.pid !== user.pid){
      throw new UnauthorizedException("User does not own the result");
    }

    const base64pdf = testResult.binaryPdf.toString("base64");

    const dto = new TestResultDto();
    dto.id = id;
    dto.base64Pdf = base64pdf;

    return dto;
  }
}
