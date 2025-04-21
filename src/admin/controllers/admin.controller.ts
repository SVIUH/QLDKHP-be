import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { AdminService } from "../services/admin.service";
import { LoginAdminDto } from "../dto/login.dto";
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthGuard } from "src/common/guards/auth.guard";
import { UpdateStudentDto } from "../dto/student.dto";

@ApiTags("Admin Auth")
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post("login")
  @ApiOperation({ summary: "Đăng nhập cho Admin" })
  @ApiResponse({
    status: 200,
    description: "Đăng nhập thành công, trả về access token",
  })
  async login(@Body() body: LoginAdminDto) {
    return this.adminService.login(body.email, body.password);
  }

  @Get("students")
  @ApiBearerAuth() // Cho Swagger biết dùng Bearer Token
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Lấy tất cả sinh viên" })
  async getAllStudents() {
    return this.adminService.getAllStudents();
  }

  @Patch("students/:id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Cập nhật thông tin sinh viên" })
  async updateStudent(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: UpdateStudentDto
  ) {
    return this.adminService.updateStudent(id, data);
  }

  @Delete("students/:id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Xoá sinh viên" })
  async deleteStudent(@Param("id", ParseIntPipe) id: number) {
    return this.adminService.deleteStudent(id);
  }
}
