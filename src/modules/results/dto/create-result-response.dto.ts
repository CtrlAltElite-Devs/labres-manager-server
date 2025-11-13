import { TestResult } from "src/entities/test-result.entity";

export class CreateResultResponseDto {
    id: string;
    testName: string;
    size: number;
    testDate: Date

    static Map(result: TestResult) : CreateResultResponseDto {
        const dto = new CreateResultResponseDto();
        dto.id = result.id;
        dto.testName = result.testName;
        dto.size = result.size;
        dto.testDate = result.testDate;
        return dto;
    }
}
