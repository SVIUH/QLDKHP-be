import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common'
import { SubjectService } from './subject.service'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../auth/guard/auth.guard'
import { SubjectToDBDto } from './dto/subject.db.dto'
  
@Controller('subject')
@ApiTags('subjects')
export class SubjectController {
    constructor(private readonly subjectService: SubjectService) {}
  
    //fix role admin and student
    @Post()
    @UseGuards(AuthGuard)
    async createSubject(@Body() data: SubjectToDBDto) {
      const rs = this.subjectService.createSubject(data)
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
    @UseGuards(AuthGuard)
    async getAllSubjects(@Req() req: any) {
      console.log('USER:', req.user);
      const rs = await this.subjectService.getAllSubjects(req.user.student_id)
      return {
        status: HttpStatus.OK,
        message: 'Get all subjects success',
        data: rs,
      }
    }
}
  