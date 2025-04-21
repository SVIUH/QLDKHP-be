import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator'

export class ClassCreateDto {
  class_id: number

  @ApiProperty({
    example: 100,
    description: 'Max capacity of the class',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(40)
  @Max(120)
  max_capacity: number

  @ApiProperty({
    example: 1,
    description: 'Term of the class',
  })
  @IsNotEmpty()
  @IsNumber()
  term: number

  @ApiProperty({
    example: 2021,
    description: 'Year of the class',
  })
  @IsNotEmpty()
  @IsNumber()
  year: number

  @ApiProperty({
    example: 'Võ Văn Hải',
    description: 'Name of the professor',
  })
  @IsNotEmpty()
  @IsString()
  professor_name: string

  @ApiProperty({
    example: 'ĐHKTPM15A',
    description: 'Name of the class',
  })
  @IsNotEmpty()
  @IsString()
  class_name: string
}
