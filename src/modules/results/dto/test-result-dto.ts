import { ApiProperty } from "@nestjs/swagger";

export class TestResultMinimalDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userPid?: string;
    
    @ApiProperty()
    testName: string;

    @ApiProperty()
    size: number;

    @ApiProperty()
    testDate: Date;    
}



export class TestResultDto {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    base64Pdf: string;
}