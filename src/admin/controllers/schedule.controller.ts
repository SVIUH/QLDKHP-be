import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Put,
} from "@nestjs/common";
import { AdminService } from "../services/admin.service";
import { CreateScheduleDto, UpdateScheduleDto } from "../dto/schedule.dto";
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
  @ApiResponse({
    status: 200,
    description: "Danh sách lịch học của sinh viên",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          student_id: { type: "number", example: 1 },
          class_id: { type: "number", example: 101 },
          time: {
            type: "string",
            format: "date-time",
            example: "2025-04-30T08:00:00.000Z",
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: "Không tìm thấy sinh viên" })
  getStudentSchedule(@Param("studentId") studentId: number) {
    return this.scheduleService.getSchedulesByStudent(+studentId);
  }

  @Post()
  @ApiOperation({ summary: "Thêm mới lịch học" })
  @ApiResponse({
    status: 201,
    description: "Lịch học đã được tạo thành công",
    schema: {
      type: "object",
      properties: {
        id: { type: "number", example: 1 },
        student_id: { type: "number", example: 1 },
        class_id: { type: "number", example: 101 },
        time: {
          type: "string",
          format: "date-time",
          example: "2025-04-30T08:00:00.000Z",
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Dữ liệu đầu vào không hợp lệ" })
  @ApiResponse({
    status: 401,
    description: "Chưa xác thực hoặc token không hợp lệ",
  })
  create(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.createSchedule(dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Cập nhật lịch học theo ID" })
  @ApiResponse({
    status: 200,
    description: "Cập nhật lịch học thành công",
    schema: {
      type: "object",
      properties: {
        id: { type: "number", example: 1 },
        student_id: { type: "number", example: 1 },
        class_id: { type: "number", example: 101 },
        time: {
          type: "string",
          format: "date-time",
          example: "2025-05-01T10:00:00.000Z",
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: "Dữ liệu không hợp lệ" })
  @ApiResponse({
    status: 404,
    description: "Không tìm thấy lịch học cần cập nhật",
  })
  update(@Param("id") id: number, @Body() dto: UpdateScheduleDto) {
    return this.scheduleService.updateSchedule(+id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Xoá lịch học theo ID" })
  remove(@Param("id") id: number) {
    return this.scheduleService.deleteSchedule(+id);
  }
}
