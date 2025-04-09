import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    HttpStatus,
  } from '@nestjs/common'
  import { ScheduleService } from './schedule.service'
  import { CreateScheduleDto } from './dto/create-schedule-dto'
  import { UpdateScheduleDto } from './dto/update.schedule.dto'
  import { AuthGuard } from '../auth/guard/auth.guard'
  import { ApiTags } from '@nestjs/swagger'
  import { ScheduleToDBDto } from './dto/schedule.db.dto'
  
  @Controller('schedule')
  @ApiTags('schedule')
  @UseGuards(AuthGuard)
  export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {}
  
    @Post()
    create(@Body() createScheduleDto: ScheduleToDBDto, @Req() req: any) {
      const rs = this.scheduleService.create({
        ...createScheduleDto,
        student_id: req.user.student_id,
      })
  
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
  
    @Get()
    async findAll(@Req() req: any) {
      const data = await this.scheduleService.findAll(req.user.student_id)
      if (data) {
        return {
          status: HttpStatus.OK,
          message: 'Get all schedule success',
          data,
        }
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Get all schedule fail',
        }
      }
    }
  
    @Patch(':id')
    update(
      @Param('id') id: string,
      @Body() updateScheduleDto: UpdateScheduleDto,
    ) {
      const rs = this.scheduleService.update(+id, updateScheduleDto)
      if (rs) {
        return {
          status: HttpStatus.OK,
          message: 'Update success',
        }
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Update fail',
        }
      }
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      const rs = this.scheduleService.remove(+id)
      if (rs) {
        return {
          status: HttpStatus.OK,
          message: 'Delete success',
        }
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Delete fail',
        }
      }
    }
  }
  