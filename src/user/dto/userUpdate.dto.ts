import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class UserUpdateDto {
  @ApiProperty({
    example: 'password',
    description: 'the password of the User',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  readonly oldPassword?: string

  @ApiProperty({
    example: 'new password',
    description: 'the password of the User',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  readonly password?: string

  @ApiProperty({
    example: 123,
    description: 'The total credits of the student',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly credit?: number
}
