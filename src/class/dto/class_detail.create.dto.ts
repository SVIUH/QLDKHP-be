import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator'

export class ClassDetailCreateDto {
  class_detail_id: number
  @ApiProperty({
    example: 'LT - Thứ 5(T10 -> T12)',
    description: 'time of the class',
  })
  @IsNotEmpty()
  @IsString()
  study_time: string

  @ApiProperty({
    example: 2,
    description: 'group practice',
  })
  @IsNumber()
  group_practice: number

  @ApiProperty({
    example: 'A1-101',
    description: 'room name',
  })
  @IsNotEmpty()
  @IsString()
  room_name: string

  @ApiProperty({
    example: 'A1',
    description: 'towner',
  })
  @IsNotEmpty()
  @IsString()
  towner: string
}
