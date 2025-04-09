import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { AdminService } from "../services/admin.service";
import { CreateScheduleDto } from "../dto/schedule.dto";
import { AuthGuard } from "src/common/guards/auth.guard";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

@ApiTags("Schedule Management")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("admin/schedule")
export class ScheduleController {
  constructor(private readonly scheduleService: AdminService) {}

  @Get(":studentId")
  @ApiOperation({ summary: "Lấy lịch học của sinh viên" })
  getStudentSchedule(@Param("studentId") studentId: number) {
    return this.scheduleService.getSchedulesByStudent(+studentId);
  }

  @Post()
  @ApiOperation({ summary: "Thêm mới lịch học" })
  create(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.createSchedule(dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Xoá lịch học theo ID" })
  remove(@Param("id") id: number) {
    return this.scheduleService.deleteSchedule(+id);
  }
}
