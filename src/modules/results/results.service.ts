import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TestResult, TestResultWithoutPdf } from 'src/entities/test-result.entity';
import { User } from 'src/entities/user.entity';
import { CreateResultResponseDto } from './dto/create-result-response.dto';
import { TestResultDto, TestResultMinimalDto } from './dto/test-result-dto';
import { License } from 'src/entities/license.entity';
import { AdminDto } from '../admin/dto/admin.dto';
import { UserDto } from '../auth/dto/user.dto';
import { TestResultRepository } from 'src/repositories/results.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { UnitOfWork } from '../common/unit-of-work';
import { ResultQueryResourceParameters } from './query-parameters/result-query-parameters';

@Injectable()
export class ResultsService {
  private readonly logger = new Logger(ResultsService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly testResultRepository: TestResultRepository,
    private readonly unitofWork: UnitOfWork
  ) {}

  async UploadTestResults(file: Express.Multer.File, license: License) {
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
        `Invalid test date ${testDate.getTime()}, Expected YYYY-MM-DD`,
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
      this.userRepository.create(createdUser);
    } else {
      this.logger.log(`existing user found`);
    }


    const testResult = new TestResult();
    testResult.user = createdUser ? createdUser : existingUser!;
    testResult.testName = testName;
    testResult.testDate = testDate;
    testResult.size = size;
    testResult.machine = license;
    testResult.binaryPdf = file.buffer;

    this.testResultRepository.create(testResult);

    await this.unitofWork.Commit();

    return CreateResultResponseDto.Map(testResult);
  }

  async GetTestResults(params: ResultQueryResourceParameters, user?: UserDto, admin?: AdminDto) {
    let results: TestResultWithoutPdf[];
    if (admin) {
      console.log("entered as admin")
      results = await this.testResultRepository.FindAllForAdmin(params);
    } else if (user) {
      console.log("entered as user")
      results = await this.testResultRepository.FindAllForUser(params, user.pid);
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

  async GetTestResultById(id: string, pid: string){
    const testResult = await this.testResultRepository.findOne({id: id, user : {pid: pid}})    

    if(testResult === null){
      throw new NotFoundException("Result not found");
    }

    const base64pdf = testResult.binaryPdf.toString("base64");

    const dto = new TestResultDto();
    dto.id = id;
    dto.base64Pdf = base64pdf;

    return dto;
  }

  async GetTestResultsForMachine(machineId: string) : Promise<TestResultMinimalDto[]>{
    const results = await this.testResultRepository.FindForMachine(machineId);

    const testResults = results.map((result) => {
      const dto = new TestResultMinimalDto();
      dto.id = result.id;
      dto.testName = result.testName;
      dto.size = result.size;
      dto.testDate = result.testDate;
      dto.userPid = result.user.pid;
      return dto;
    });

    return testResults
  }

  async DeleteRecordsForUser(pid: string){
    const result = await this.testResultRepository.nativeDelete({
      user: {
        pid: pid
      }
    })

    this.logger.log(`Deleted ${result} records`);
    return `Deleted ${result} records`
  }
}
