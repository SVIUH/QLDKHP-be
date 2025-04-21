import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateScheduleDto {
  schedule_id?: number

  @ApiProperty({
    example: '2021-10-10',
    description: 'date',
  })
  @IsNotEmpty()
  time: Date
}
