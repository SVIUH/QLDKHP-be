import { ApiProperty } from '@nestjs/swagger'
import { PrerequisiteCreateDto } from './prerequisit.dto'
import { SubjectCreateDto } from './subject.create.dto'

export class SubjectToDBDto {
  @ApiProperty({
    type: SubjectCreateDto,
    description: 'The subject to be created',
  })
  subject: SubjectCreateDto

  @ApiProperty({
    type: [PrerequisiteCreateDto],
    description: 'The prerequisites of the subject',
  })
  prerequisites: PrerequisiteCreateDto[]
}
