import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { AdminService } from "../services/admin.service";
import { AuthGuard } from "src/common/guards/auth.guard";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

@ApiTags("Grade Management")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("admin/grade")
export class GradeController {
  constructor(private readonly gradeService: AdminService) {}

  @Get(":studentId")
  @ApiOperation({ summary: "Lấy điểm của một sinh viên" })
  getGrades(@Param("studentId") studentId: number) {
    return this.gradeService.getGradesByStudent(+studentId);
  }

  @Post()
  @ApiOperation({ summary: "Cập nhật điểm cho sinh viên" })
  async updateGrade(@Body() dto: any) {
    return this.gradeService.updateGrade(dto);
  }
}
