import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator'

export class GradeCreateDto {
  grade_id: number
  digit_score: number

  letter_score: string

  @ApiProperty({
    example: 10,
    description: 'The midterm score of the grade',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  midterm: number

  @ApiProperty({
    example: 10,
    description: 'The final score of the grade',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  final: number

  @ApiProperty({
    example: 10,
    description: 'The theory 1 score of the grade',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  theory_1: number

  @ApiProperty({
    example: 10,
    description: 'The theory 2 score of the grade',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  theory_2: number

  @ApiProperty({
    example: 10,
    description: 'The theory 3 score of the grade',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  theory_3: number

  @ApiProperty({
    example: 10,
    description: 'The theory 4 score of the grade',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  theory_4: number

  @ApiProperty({
    example: 10,
    description: 'The theory 5 score of the grade',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  theory_5: number

  @ApiProperty({
    example: 10,
    description: 'The practice 1 score of the grade',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  practice_1: number

  @ApiProperty({
    example: 10,
    description: 'The practice 2 score of the grade',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  practice_2: number

  @ApiProperty({
    example: 10,
    description: 'The practice 3 score of the grade',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  practice_3: number

  @ApiProperty({
    example: 10,
    description: 'The practice 4 score of the grade',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  practice_4: number

  @ApiProperty({
    example: 10,
    description: 'The practice 5 score of the grade',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  practice_5: number
}
