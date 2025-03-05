/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator'

export class EducationCreateDto {
  education_id: number

  @ApiProperty({
    example: '2020-2021',
    description: 'Course of the student',
  })
  @IsNotEmpty()
  readonly course: string

  @ApiProperty({
    example: 'Đại học',
    description: 'Training level of the student',
  })
  @IsNotEmpty()
  readonly training_level: string

  @ApiProperty({
    example: 'Kỹ thuật phần mềm',
    description: 'Sector of the student',
  })
  @IsNotEmpty()
  readonly sector: string

  @ApiProperty({
    example: 'Khoa Công nghệ Thông tin',
    description: 'Faculty of the student',
  })
  @IsNotEmpty()
  readonly faculty: string

  @ApiProperty({
    example: 'Đại học Kỹ thuật phần mềm 16A - 7480103',
    description: 'identifier class of the student',
  })
  @IsNotEmpty()
  readonly identifier_class: string

  @ApiProperty({
    example: 'Chính quy',
    description: 'Training type of the student',
  })
  @IsNotEmpty()
  readonly training_type: string

  @ApiProperty({
    example: 'Kỹ thuật phần mềm - 7480103',
    description: 'Major of the student',
  })
  @IsNotEmpty()
  readonly major: string

  @ApiProperty({
    example: 'Cơ sở 1 (Thành phố Hồ Chí Minh)',
    description: 'Facility of the student',
  })
  @IsNotEmpty()
  readonly facility: string
}
