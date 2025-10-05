import { BadRequestException, Injectable } from "@nestjs/common";

export type ValidatedTestResult = {
    pid: string;
    testName: string;
    size: number;
    testDate: Date
}

@Injectable()
export class ResultHelper {
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
}