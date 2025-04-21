import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
  Patch,
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
  @ApiOperation({
    summary: "Lấy danh sách lớp học (có thể lọc theo year, term, subject_id)",
  })
  @ApiResponse({ status: 200 })
  getAll(
    @Query("year") year?: string,
    @Query("term") term?: string,
    @Query("subject_id") subject_id?: string
  ) {
    const filter = {
      ...(year && { year: Number(year) }),
      ...(term && { term: Number(term) }),
      ...(subject_id && { subject_id: Number(subject_id) }),
    };

    return this.AdminService.getAllClassesWithFilter(filter);
  }

  @Post()
  @ApiOperation({ summary: "Tạo lớp học mới" })
  create(@Body() dto: CreateClassDto) {
    return this.AdminService.createClass(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Cập nhật lớp học theo ID" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateClassDto) {
    return this.AdminService.updateClass(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Xoá lớp học theo ID" })
  remove(@Param("id") id: number) {
    return this.AdminService.deleteClass(+id);
  }
}
