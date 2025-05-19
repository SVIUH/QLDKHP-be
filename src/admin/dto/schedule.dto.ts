// import { IsInt, IsDate, IsOptional, IsNotEmpty } from "class-validator";

// export class CreateScheduleDto {
//   @IsInt()
//   @IsNotEmpty()
//   student_id: number;

//   @IsInt()
//   @IsNotEmpty()
//   class_id: number;

//   @IsDate()
//   @IsNotEmpty()
//   time: Date;
// }

// export class UpdateScheduleDto {
//   @IsDate()
//   @IsOptional()
//   time?: Date;
// }
import { IsInt, IsDate, IsOptional, IsNotEmpty } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateScheduleDto {
  @ApiProperty({
    example: 1,
    description: "ID của sinh viên",
  })
  @IsInt()
  @IsNotEmpty()
  student_id: number;

  @ApiProperty({
    example: 101,
    description: "ID của lớp học",
  })
  @IsInt()
  @IsNotEmpty()
  class_id: number;

  @ApiProperty({
    example: "2025-04-30T08:00:00.000Z",
    description: "Thời gian diễn ra lớp học (ISO 8601 format)",
  })
  @IsDate()
  @IsNotEmpty()
  time: Date;
}

export class UpdateScheduleDto {
  @ApiPropertyOptional({
    example: "2025-05-01T10:00:00.000Z",
    description: "Thời gian mới cho buổi học",
  })
  @IsDate()
  @IsOptional()
  time?: Date;
}
