import { ApiProperty } from '@nestjs/swagger'
import { CreateScheduleDto } from './create-schedule-dto'

export class ScheduleToDBDto extends CreateScheduleDto {
  @ApiProperty({
    example: 1,
    description: 'The id of the class',
  })
  class_id: number

  student_id: number
}
