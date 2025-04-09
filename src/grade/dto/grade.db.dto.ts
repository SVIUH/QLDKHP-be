import { ApiProperty } from '@nestjs/swagger'
import { GradeCreateDto } from './grade.create.dto'

export class GradeToDBDto extends GradeCreateDto {
  @ApiProperty({
    example: 1,
    description: 'The id of the subject',
  })
  subject_id: number

  student_id: number
}
