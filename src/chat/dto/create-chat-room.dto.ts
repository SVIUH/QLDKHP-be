import { IsInt } from "class-validator";

export class CreateChatRoomDto {
  @IsInt()
  student_code: number;

  @IsInt()
  admin_id: number;
}
