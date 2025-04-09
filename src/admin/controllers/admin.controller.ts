import { Body, Controller, Post, Get, UseGuards } from "@nestjs/common";
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
}
