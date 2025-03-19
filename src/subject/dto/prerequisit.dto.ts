import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class PrerequisiteCreateDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the prerequisite subject',
  })
  @IsNotEmpty()
  @IsNumber()
  prerequisite_subject_id: number

  prerequisite_id: number
}
