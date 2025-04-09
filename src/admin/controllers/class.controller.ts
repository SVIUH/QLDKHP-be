import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { AdminService } from "../services/admin.service";
import { CreateClassDto, UpdateClassDto } from "../dto/class.dto";
import { AuthGuard } from "src/common/guards/auth.guard";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

@ApiTags("Class Management")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("admin/class")
export class ClassController {
  constructor(private readonly AdminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: "Lấy danh sách lớp học" })
  @ApiResponse({ status: 200 })
  getAll() {
    return this.AdminService.getAllClasses();
  }

  @Post()
  @ApiOperation({ summary: "Tạo lớp học mới" })
  create(@Body() dto: CreateClassDto) {
    return this.AdminService.createClass(dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Xoá lớp học theo ID" })
  remove(@Param("id") id: number) {
    return this.AdminService.deleteClass(+id);
  }
}
