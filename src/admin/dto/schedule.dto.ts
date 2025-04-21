import { IsInt, IsDate, IsOptional, IsNotEmpty } from "class-validator";

export class CreateScheduleDto {
  @IsInt()
  @IsNotEmpty()
  student_id: number;

  @IsInt()
  @IsNotEmpty()
  class_id: number;

  @IsDate()
  @IsNotEmpty()
  time: Date;
}

export class UpdateScheduleDto {
  @IsDate()
  @IsOptional()
  time?: Date;
}
