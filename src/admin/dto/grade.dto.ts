import { IsNumber, IsOptional } from "class-validator";

export class UpdateGradeDto {
  @IsNumber()
  student_id: number;

  @IsNumber()
  subject_id: number;

  @IsNumber()
  @IsOptional()
  midterm?: number;

  @IsNumber()
  @IsOptional()
  final?: number;

  @IsNumber()
  @IsOptional()
  theory_1?: number;

  @IsNumber()
  @IsOptional()
  practice_1?: number;

  @IsNumber()
  @IsOptional()
  theory_2?: number;

  @IsNumber()
  @IsOptional()
  practice_2?: number;

  @IsNumber()
  @IsOptional()
  theory_3?: number;

  @IsNumber()
  @IsOptional()
  practice_3?: number;

  @IsNumber()
  @IsOptional()
  theory_4?: number;

  @IsNumber()
  @IsOptional()
  practice_4?: number;

  @IsNumber()
  @IsOptional()
  theory_5?: number;

  @IsNumber()
  @IsOptional()
  practice_5?: number;

  // Các trường khác nếu cần
}
