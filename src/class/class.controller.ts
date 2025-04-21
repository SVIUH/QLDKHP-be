import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    UseGuards,
  } from '@nestjs/common'
  import { ApiProperty, ApiTags } from '@nestjs/swagger'
  
  import { ClassService } from './class.service'
  import { AuthGuard } from '../auth/guard/auth.guard'
  import { ClassToDBDto } from './dto/class.db.dto'
  
  @Controller('classes')
  @ApiTags('classes')
  export class ClassController {
    constructor(private readonly classService: ClassService) {}
  
    @Post()
    @UseGuards(AuthGuard)
    async createClass(@Body() data: ClassToDBDto) {
      const rs = this.classService.createClass(data)
      if (rs) {
        return {
          status: HttpStatus.CREATED,
          message: 'Create success',
        }
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Create fail',
        }
      }
    }
  
    @Get(':term')
    @UseGuards(AuthGuard)
    async getAllClasses(@Param('term') term: string) {
      const rs = await this.classService.getAllClasses(term)
      return {
        status: HttpStatus.OK,
        message: 'Get all subjects success',
        data: rs,
      }
    }
  
    @Post('close-register/:subject_id')
    @UseGuards(AuthGuard)
    async closeRegisterClass(@Param('subject_id') subject_id: string) {
      const rs = await this.classService.closeRegisterClass(parseInt(subject_id))
      if (rs) {
        return {
          status: HttpStatus.OK,
          message: 'Close register success',
        }
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Close register fail',
        }
      }
    }
  }
  