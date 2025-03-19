import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator'

export class SubjectCreateDto {
  subject_id: number

  @ApiProperty({
    example: 'name',
    description: 'Name of the subject',
  })
  @IsNotEmpty()
  @IsString()
  subject_name: string

  @ApiProperty({
    example: 3,
    description: 'Number of credits of the subject',
  })
  @Min(2)
  @Max(8)
  @IsNumber()
  @IsNotEmpty()
  credits: number

  @ApiProperty({
    example: '1-1st',
    description: 'subjects taught during the semester',
  })
  @IsNotEmpty()
  @IsString()
  term: string

  @ApiProperty({
    example: true,
    description: 'Is the subject is required learn or just optional',
  })
  @IsNotEmpty()
  @IsBoolean()
  isRequired: boolean

  @ApiProperty({
    example: 3,
    description: 'Number of theory hours of the subject',
  })
  @IsNumber()
  @IsNotEmpty()
  theory: number

  @ApiProperty({
    example: 2,
    description: 'Number of practice hours of the subject',
  })
  @IsNumber()
  @IsNotEmpty()
  practice: number
}
