/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator'
import { EducationCreateDto } from './education.dto'

export class UserCreateDto {
  student_id?: number

  @ApiProperty({
    example: 'name',
    description: 'Name of the student',
  })
  @IsNotEmpty()
  readonly student_name: string

  @ApiProperty({
    example: '20067811',
    description: 'Code of the student',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly code: number

  @ApiProperty({
    example: '111111',
    description: 'Password of the student',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string

  @ApiProperty({
    example: 'c520a1@gmail.com',
    description: 'Email of the student',
  })
  @IsNotEmpty()
  readonly email: string

  @ApiProperty({
    type: EducationCreateDto,
  })
  education: EducationCreateDto
}
