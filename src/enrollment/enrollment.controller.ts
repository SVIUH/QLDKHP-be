/* eslint-disable prettier/prettier */

import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common'
  import { ApiTags } from '@nestjs/swagger'
  import { CommonService } from '../common/common.service'
  import { EnrollmentService } from './enrollment.service'
  import { EnrollmentToDBDto } from './dto/enrollment.dt.dto'
  import { AuthGuard } from '../auth/guard/auth.guard'
  
  @ApiTags('enrollments')
  @Controller('enrollments')
  export class EnrollmentController {
    constructor(private readonly enrollmentService: EnrollmentService) {}
  
    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() raw: EnrollmentToDBDto, @Req() req: any) {
      const data = {
        student_id: req.user.student_id,
        class_id: raw.class_id,
        class_detail_id: raw.class_detail_id,
      }
      const rs = await this.enrollmentService.create(data)
      if (rs) {
        return {
          status: 201,
          message: 'Create success',
        }
      } else {
        return {
          status: 400,
          message: 'Create fail',
        }
      }
    }
  
    @Get(':term')
    @UseGuards(AuthGuard)
    async getAllEnrollments(@Req() req: any, @Param('term') term: string) {
      const rs = await this.enrollmentService.getAllEnrollments(
        req.user.student_id,
        term,
      )
      if (rs) {
        return {
          status: 200,
          data: rs,
        }
      } else {
        return {
          status: 400,
          message: 'Get all enrollments fail',
          data: [],
        }
      }
    }
  }
  