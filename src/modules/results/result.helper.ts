import { BadRequestException, Injectable } from "@nestjs/common";
import { PIDValidator, DOBValidator, LastNameValidator, TestNameValidator, TestDateValidator, ValidatedTestResultV2, ValidatedTestResult } from "./validators/result.validator";

@Injectable()
export class ResultHelper {
    private readonly validators: [
        PIDValidator,
        DOBValidator,
        LastNameValidator,
        TestNameValidator,
        TestDateValidator
    ] = [
        new PIDValidator(),
        new DOBValidator(),
        new LastNameValidator(),
        new TestNameValidator(),
        new TestDateValidator()
    ];

    ValidateTestResult(file: Express.Multer.File) : ValidatedTestResult {
        const fileType = file.mimetype;

        if(fileType !== "application/pdf"){
            throw new BadRequestException("File type must be application/pdf");
        }

        const parts: string[] = file.originalname.split('_');

        if(parts.length < 3){
            throw new BadRequestException(
                'Invalid File format. Expected format: PID_nameOfTest_testDate.pdf',
            );
        }

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

        const testName = parts.slice(1, -1).join(' ');
        const size = file.size;
        const pid = parts[0];

        return {
            pid,
            testName,
            size,
            testDate
        }
    }

    ValidateTestResultV2(file: Express.Multer.File): ValidatedTestResultV2 {
        if (file.mimetype !== 'application/pdf') {
            throw new BadRequestException("File type must be application/pdf");
        }

        const parts = file.originalname.replace('.pdf', '').split('_');

        if (parts.length < this.validators.length) {
            throw new BadRequestException(
                `Invalid file format. Expected: PID_DOB_LASTNAME_TESTNAME_TESTDATE.pdf`
            );
        }

        // Accumulate validated fields with correct types
        const result = {} as ValidatedTestResultV2;

        // PID, DOB, LastName are fixed positions
        result.pid = this.validators[0].validate(parts[0]);
        result.dob = this.validators[1].validate(parts[1]);
        result.lastName = this.validators[2].validate(parts[2]);
        console.log(JSON.stringify(result, null, 2));

        // testName can have underscores, take everything from index 3 to second-last part
        const testNamePart = parts.slice(3, parts.length - 1).join(' ');
        result.testName = this.validators[3].validate(testNamePart);

        // testDate is always the last part
        result.testDate = this.validators[4].validate(parts[parts.length - 1]);

        // File size
        result.size = file.size;

        return result;
    }
}
