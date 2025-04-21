import { ApiProperty } from '@nestjs/swagger'
import { ClassCreateDto } from './class.create.dto'
import { ClassDetailCreateDto } from './class_detail.create.dto'

export class ClassToDBDto extends ClassCreateDto {
  @ApiProperty({
    example: 234433,
    description: 'id of the subject when create the class',
  })
  subject_id: number

  @ApiProperty({
    type: [ClassDetailCreateDto],
    description: 'The detail of the class',
    example: [
      {
        study_time: 'LT - Thứ 5(T10 -> T12)',
        group_practice: 2,
        room_name: 'A1-101',
        towner: 'A1',
      },
      {
        study_time: 'LT - Thứ 6(T10 -> T12)',
        group_practice: 3,
        room_name: 'A1-102',
        towner: 'A1',
      },
      {
        study_time: 'LT - Thứ 7(T10 -> T12)',
        group_practice: 4,
        room_name: 'A1-103',
        towner: 'A1',
      },
    ],
  })
  class_details: ClassDetailCreateDto[]
}
