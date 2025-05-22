import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "../services/chat.service";
import { CreateMessageDto } from "../dto/create-message.dto";

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage("send_message")
  async handleSendMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    const message = await this.chatService.createMessage(dto);

    this.server.to(`room-${dto.chat_room_id}`).emit("receive_message", message);
  }

  @SubscribeMessage("join_room")
  handleJoinRoom(
    @MessageBody() chatRoomId: number,
    @ConnectedSocket() client: Socket
  ) {
    client.join(`room-${chatRoomId}`);
  }
}
