/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Req,
    Res,
    UseGuards,
  } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { AuthGuard } from '../auth/guard/auth.guard'
import { Response as Resp } from '../common/common.type'
import { LoginDTO } from './dto/login.dto'
import { RegisterDTO } from './dto/register.dto'
import { UserService } from './user.service'
  
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Post('register')
  // @UsePipes(new CustomValidationPipe())
  async createUsers(@Body() userCreateDto: RegisterDTO): Promise<Resp | any> {
    const rs = await this.userService.createUser(userCreateDto)
    if (rs) {
      return {
        status: HttpStatus.CREATED,
        message: 'Register success',
      }
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Register fail',
      }
    }
  }
  
  @Post('login')
  async login(
    @Body() userLoginDto: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Resp> {
    const rs = await this.userService.login(userLoginDto)
    if (rs) {
      response.cookie('token', rs.token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      })
      return {
        status: HttpStatus.OK,
        message: 'Login success',
        data: rs,
      }
    } 
    else {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Login fail',
        }
      }
    }
  
  //seen profile
  @UseGuards(AuthGuard)
  @Get('/profile')
  async getUser(@Req() req: any): Promise<Resp> {
    if (req.error) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Please login again',
        errors: req.error,
      }
    }
    const user = await this.userService.getUser(parseInt(req.user.code))
    if (user) {
      return {
        status: HttpStatus.OK,
        message: 'Get user success',
        data: user,
      }
    } 
    else {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Get user fail',
      }
    }
  }
  
  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() request: any): Promise<Resp> {
    await this.userService.logout(request)
    //clear cookie
    request.res.clearCookie('token')
    return {
      status: HttpStatus.OK,
      message: 'Logout success',
    }
  }
}
  