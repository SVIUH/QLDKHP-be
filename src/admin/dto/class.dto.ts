import {
  IsInt,
  IsString,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateClassDetailDto {
  @IsString()
  study_time: string;

  @IsOptional()
  @IsInt()
  group_practice?: number;

  @IsString()
  room_name: string;

  @IsString()
  towner: string;
}

export class CreateClassDto {
  @IsInt()
  subject_id: number;

  @IsString()
  professor_name: string;

  @IsString()
  class_name: string;

  @IsInt()
  max_capacity: number;

  @IsOptional()
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClassDetailDto)
  classDetails: CreateClassDetailDto[];
}

export class UpdateClassDto {
  class_name?: string;
  max_capacity?: number;
  professor_name?: string;
  isEnrolling?: boolean;
}
