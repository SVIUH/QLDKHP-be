import { OmitType } from '@nestjs/swagger'
import { UserCreateDto } from './userCreate.dto'

export class RegisterDTO extends OmitType(UserCreateDto, [
  'code',
  'password',
]) {}
