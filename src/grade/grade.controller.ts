import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GradeService } from "./grade.service";
import { AuthGuard } from "../auth/guard/auth.guard";
import { GradeToDBDto } from "./dto/grade.db.dto";

@Controller("grades")
@ApiTags("grades")
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Req() req: any) {
    console.log("🧠 req.user:", req.user);
    const rs = await this.gradeService.findAll(req.user.student_id);
    if (rs) {
      return {
        status: HttpStatus.OK,
        data: rs,
      };
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: "No data found",
      };
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  async uploadGrade(@Body() data: GradeToDBDto, @Req() req: any) {
    const rs = this.gradeService.uploadGrade({
      ...data,
      student_id: req.user.student_id,
    });
    if (rs) {
      return {
        status: HttpStatus.CREATED,
        message: "Upload success",
      };
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: "Upload fail",
      };
    }
  }
}
