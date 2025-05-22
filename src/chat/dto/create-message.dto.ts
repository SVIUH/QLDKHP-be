import { IsEnum, IsInt, IsString } from "class-validator";
import { SenderType } from "@prisma/client";

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsEnum(SenderType)
  sender_type: SenderType;

  @IsInt()
  chat_room_id: number;
}
