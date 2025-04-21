import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginAdminDto {
  @ApiProperty({ example: "admin1", description: "Tên đăng nhập admin" })
  @IsString()
  email: string;

  @ApiProperty({ example: "123456", description: "Mật khẩu admin" })
  @IsString()
  password: string;
}
