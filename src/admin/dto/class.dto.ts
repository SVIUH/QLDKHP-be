import { IsInt, IsString, IsBoolean, IsOptional } from "class-validator";

export class CreateClassDto {
  @IsInt()
  subject_id: number;

  @IsString()
  professor_name: string;

  @IsString()
  class_name: string;

  @IsInt()
  max_capacity: number;

  @IsInt()
  current_capacity?: number;

  @IsInt()
  term: number;

  @IsInt()
  year: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsBoolean()
  isEnrolling?: boolean;
}

export class UpdateClassDto {
  class_name?: string;
  max_capacity?: number;
  professor_name?: string;
  isEnrolling?: boolean;
}
