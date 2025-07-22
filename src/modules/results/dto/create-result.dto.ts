import { ApiProperty } from '@nestjs/swagger';

export class CreateResultDto {
  @ApiProperty({
    type: 'string',
    format: 'binary'
  })
  file: any;
}
