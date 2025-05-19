import { Body, Controller, Post, Get, Param } from "@nestjs/common";
import { ChatService } from "../services/chat.service";
import { CreateChatRoomDto } from "../dto/create-chat-room.dto";
import { CreateMessageDto } from "../dto/create-message.dto";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  //Tạo phòng chat
  @Post("create-room")
  createChatRoom(@Body() dto: CreateChatRoomDto) {
    return this.chatService.createChatRoom(dto);
  }
  //Gửi tin nhắn
  @Post("message")
  createMessage(@Body() dto: CreateMessageDto) {
    return this.chatService.createMessage(dto);
  }
  //Lấy tất cả tin nhắn theo chatRoomId
  @Get("messages/:chatRoomId")
  getMessages(@Param("chatRoomId") chatRoomId: number) {
    return this.chatService.getMessages(Number(chatRoomId));
  }
  //Lấy phòng chat theo student_code
  @Get("rooms/student/:studentCode")
  getChatRoomsByStudent(@Param("studentCode") studentCode: number) {
    return this.chatService.getChatRoomsByStudent(Number(studentCode));
  }
  //lấy tất cả phòng chat
  @Get("rooms")
  getAllChatRooms() {
    return this.chatService.getAllChatRooms();
  }
}
