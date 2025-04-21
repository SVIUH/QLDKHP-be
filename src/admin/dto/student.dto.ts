import { IsOptional, IsString, IsEmail, IsBoolean } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateStudentDto {
  @ApiPropertyOptional({ description: "Tên sinh viên" })
  @IsOptional()
  @IsString()
  student_name?: string;

  @ApiPropertyOptional({ description: "Email sinh viên" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: "Trạng thái học tập (VD: đang học, đã nghỉ)",
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: "Giới tính (true = nam, false = nữ)" })
  @IsOptional()
  @IsBoolean()
  gender?: boolean;
}
